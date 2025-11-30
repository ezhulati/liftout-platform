import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/matching/opportunities?teamId=xxx - Find matching opportunities for a team
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = request.nextUrl.searchParams.get('teamId');
    const minScore = parseInt(request.nextUrl.searchParams.get('minScore') || '50');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
    }

    // Fetch the team with members and skills
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { status: 'active' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                skills: {
                  include: { skill: true }
                },
                profile: {
                  select: {
                    title: true,
                    yearsExperience: true,
                    location: true,
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { applications: true, members: true }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Fetch active opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            logoUrl: true,
            verificationStatus: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      take: 100,
      orderBy: [
        { featured: 'desc' },
        { boostScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Extract team skills for matching
    const teamSkills = extractTeamSkills(team.members);

    // Calculate match scores
    const matches = opportunities.map(opportunity => {
      const score = calculateOpportunityMatchScore(team, teamSkills, opportunity);
      return {
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          description: opportunity.description?.slice(0, 300),
          company: opportunity.company,
          industry: opportunity.industry,
          location: opportunity.location,
          remotePolicy: opportunity.remotePolicy,
          compensation: {
            min: opportunity.compensationMin,
            max: opportunity.compensationMax,
            currency: opportunity.compensationCurrency,
          },
          teamSize: {
            min: opportunity.teamSizeMin,
            max: opportunity.teamSizeMax,
          },
          requiredSkills: opportunity.requiredSkills,
          urgency: opportunity.urgency,
          featured: opportunity.featured,
          applicationCount: opportunity._count.applications,
          createdAt: opportunity.createdAt,
        },
        score,
      };
    });

    // Filter and sort by score
    const filteredMatches = matches
      .filter(m => m.score.total >= minScore)
      .sort((a, b) => b.score.total - a.score.total)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        team: {
          id: team.id,
          name: team.name,
          industry: team.industry,
          skills: teamSkills,
        },
        matches: filteredMatches,
        total: filteredMatches.length,
      }
    });
  } catch (error) {
    console.error('Error finding opportunity matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matching opportunities' },
      { status: 500 }
    );
  }
}

// Helper to extract team skills from members
function extractTeamSkills(members: any[]): string[] {
  const skills = new Set<string>();
  members.forEach(member => {
    member.user.skills?.forEach((s: any) => {
      skills.add(s.skill.name);
    });
  });
  return Array.from(skills);
}

// Calculate match score between team and opportunity
function calculateOpportunityMatchScore(team: any, teamSkills: string[], opportunity: any) {
  const breakdown = {
    skillsMatch: calculateSkillsScore(teamSkills, opportunity),
    industryMatch: calculateIndustryScore(team, opportunity),
    locationMatch: calculateLocationScore(team, opportunity),
    sizeMatch: calculateSizeScore(team, opportunity),
    compensationMatch: calculateCompensationScore(team, opportunity),
    urgencyBonus: calculateUrgencyBonus(opportunity),
    companyQuality: calculateCompanyQuality(opportunity.company),
  };

  const weights = {
    skillsMatch: 0.30,
    industryMatch: 0.20,
    locationMatch: 0.10,
    sizeMatch: 0.10,
    compensationMatch: 0.15,
    urgencyBonus: 0.05,
    companyQuality: 0.10,
  };

  const total = Math.round(
    Object.entries(breakdown).reduce((sum, [key, score]) => {
      return sum + score * weights[key as keyof typeof weights];
    }, 0)
  );

  const recommendation = getRecommendation(total);
  const { strengths, concerns, insights } = extractInsights(team, opportunity, breakdown);

  return {
    total,
    breakdown,
    recommendation,
    strengths,
    concerns,
    insights,
  };
}

function calculateSkillsScore(teamSkills: string[], opportunity: any): number {
  const teamSkillsLower = teamSkills.map(s => s.toLowerCase());
  const requiredSkills = (opportunity.requiredSkills || []).map((s: string) => s.toLowerCase());
  const preferredSkills = (opportunity.preferredSkills || []).map((s: string) => s.toLowerCase());

  if (requiredSkills.length === 0 && preferredSkills.length === 0) return 70;

  let score = 0;

  // Required skills (critical)
  if (requiredSkills.length > 0) {
    const matchedRequired = requiredSkills.filter((skill: string) =>
      teamSkillsLower.some(ts => ts.includes(skill) || skill.includes(ts))
    ).length;
    score += (matchedRequired / requiredSkills.length) * 70;
  } else {
    score += 35;
  }

  // Preferred skills (bonus)
  if (preferredSkills.length > 0) {
    const matchedPreferred = preferredSkills.filter((skill: string) =>
      teamSkillsLower.some(ts => ts.includes(skill) || skill.includes(ts))
    ).length;
    score += (matchedPreferred / preferredSkills.length) * 30;
  } else {
    score += 15;
  }

  return Math.min(Math.round(score), 100);
}

function calculateIndustryScore(team: any, opportunity: any): number {
  const teamIndustry = team.industry?.toLowerCase() || '';
  const oppIndustry = opportunity.industry?.toLowerCase() || '';

  if (!teamIndustry || !oppIndustry) return 50;
  if (teamIndustry === oppIndustry) return 100;

  // Industry compatibility matrix
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'financial services': {
      'fintech': 90,
      'investment banking': 95,
      'private equity': 90,
      'consulting': 75,
      'technology': 60,
    },
    'technology': {
      'fintech': 85,
      'healthcare technology': 80,
      'enterprise software': 90,
      'consulting': 65,
    },
    'healthcare': {
      'healthcare technology': 90,
      'biotechnology': 85,
      'pharmaceuticals': 80,
    },
    'consulting': {
      'financial services': 75,
      'technology': 70,
      'strategy': 90,
    },
  };

  const compatibility = compatibilityMatrix[teamIndustry]?.[oppIndustry];
  if (compatibility) return compatibility;

  // Check reverse
  const reverseCompatibility = compatibilityMatrix[oppIndustry]?.[teamIndustry];
  if (reverseCompatibility) return reverseCompatibility;

  // Partial word matching
  if (teamIndustry.split(' ').some((w: string) => oppIndustry.includes(w))) return 65;

  return 40;
}

function calculateLocationScore(team: any, opportunity: any): number {
  const teamLocation = team.location?.toLowerCase() || '';
  const oppLocation = opportunity.location?.toLowerCase() || '';
  const teamRemote = team.remoteStatus;
  const oppRemote = opportunity.remotePolicy;

  // Remote opportunities work for everyone
  if (oppRemote === 'remote') return 100;

  // Remote teams need remote or hybrid opportunities
  if (teamRemote === 'remote') {
    if (oppRemote === 'hybrid') return 70;
    if (oppRemote === 'onsite') return 30;
  }

  // Hybrid is flexible
  if (teamRemote === 'hybrid' || oppRemote === 'hybrid') return 75;

  // Location match for onsite
  if (teamLocation && oppLocation) {
    if (teamLocation === oppLocation) return 100;
    // Same country/region partial match
    if (teamLocation.split(',').pop()?.trim() === oppLocation.split(',').pop()?.trim()) return 70;
  }

  return 50;
}

function calculateSizeScore(team: any, opportunity: any): number {
  const teamSize = team.size || team._count?.members || 0;
  const minSize = opportunity.teamSizeMin || 1;
  const maxSize = opportunity.teamSizeMax || 20;

  if (teamSize >= minSize && teamSize <= maxSize) return 100;

  if (teamSize < minSize) {
    const deficit = minSize - teamSize;
    return Math.max(0, 100 - deficit * 15);
  }

  if (teamSize > maxSize) {
    const excess = teamSize - maxSize;
    return Math.max(0, 100 - excess * 10);
  }

  return 50;
}

function calculateCompensationScore(team: any, opportunity: any): number {
  const teamMin = team.salaryExpectationMin || 0;
  const teamMax = team.salaryExpectationMax || 0;
  const oppMin = opportunity.compensationMin || 0;
  const oppMax = opportunity.compensationMax || 0;

  if (!teamMin && !teamMax) return 70;
  if (!oppMin && !oppMax) return 70;

  // Opportunity meets or exceeds expectations
  if (oppMax >= teamMax) return 100;
  if (oppMax >= teamMin) return 85;

  // Calculate gap
  if (oppMax < teamMin) {
    const gap = teamMin - oppMax;
    const gapPercent = gap / teamMin;
    return Math.max(20, Math.round(70 - gapPercent * 100));
  }

  return 70;
}

function calculateUrgencyBonus(opportunity: any): number {
  switch (opportunity.urgency) {
    case 'critical': return 100;
    case 'high': return 85;
    case 'standard': return 70;
    case 'low': return 50;
    default: return 70;
  }
}

function calculateCompanyQuality(company: any): number {
  let score = 50;

  if (company.verificationStatus === 'verified') score += 30;
  else if (company.verificationStatus === 'pending') score += 10;

  if (company.logoUrl) score += 10;
  if (company.industry) score += 10;

  return Math.min(score, 100);
}

function getRecommendation(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'poor';
}

function extractInsights(team: any, opportunity: any, breakdown: any) {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const insights: string[] = [];

  // Strengths
  if (breakdown.skillsMatch >= 80) {
    strengths.push('Strong skills alignment');
  }
  if (breakdown.industryMatch >= 90) {
    strengths.push('Direct industry experience');
  }
  if (breakdown.compensationMatch >= 85) {
    strengths.push('Compensation meets expectations');
  }
  if (opportunity.featured) {
    strengths.push('Featured opportunity');
  }
  if (opportunity.company?.verificationStatus === 'verified') {
    strengths.push('Verified company');
  }

  // Concerns
  if (breakdown.skillsMatch < 50) {
    concerns.push('Skills gap may require training');
  }
  if (breakdown.industryMatch < 50) {
    concerns.push('Significant industry transition');
  }
  if (breakdown.compensationMatch < 60) {
    concerns.push('Below compensation expectations');
  }
  if (breakdown.locationMatch < 50) {
    concerns.push('Location/remote work mismatch');
  }
  if (breakdown.sizeMatch < 70) {
    concerns.push('Team size doesn\'t match requirements');
  }

  // Insights
  if (breakdown.urgencyBonus >= 85) {
    insights.push('High urgency - faster decision process expected');
  }
  if (opportunity._count?.applications > 10) {
    insights.push(`Competitive opportunity with ${opportunity._count.applications}+ applications`);
  }
  const yearsWorking = Number(team.yearsWorkingTogether) || 0;
  if (yearsWorking >= 3) {
    insights.push(`${yearsWorking} years of team cohesion provides competitive advantage`);
  }

  return { strengths, concerns, insights };
}
