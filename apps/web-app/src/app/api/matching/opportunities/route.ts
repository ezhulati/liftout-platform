import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Decimal } from '@prisma/client/runtime/library';
import type { JsonValue } from '@prisma/client/runtime/library';

export const dynamic = 'force-dynamic';

// Demo user detection
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// Demo matches for team users
const DEMO_OPPORTUNITY_MATCHES = [
  {
    opportunity: {
      id: 'opp-demo-1',
      title: 'Lead FinTech Analytics Division',
      description: 'Strategic opportunity to lead our new FinTech analytics division. Looking for an intact team with strong quantitative skills and financial services experience.',
      company: {
        id: 'company-demo-1',
        name: 'NextGen Financial',
        industry: 'Financial Services',
        logoUrl: null,
        verificationStatus: 'verified',
      },
      industry: 'Financial Services',
      location: 'New York, NY',
      remotePolicy: 'hybrid',
      compensation: { min: 180000, max: 250000, currency: 'USD' },
      teamSize: { min: 3, max: 8 },
      requiredSkills: ['Python', 'Machine Learning', 'Financial Modeling'],
      urgency: 'high',
      featured: true,
      applicationCount: 5,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    score: {
      total: 92,
      breakdown: {
        skillsMatch: 95,
        industryMatch: 90,
        locationMatch: 85,
        sizeMatch: 100,
        compensationMatch: 90,
        urgencyBonus: 85,
        companyQuality: 90,
      },
      recommendation: 'excellent',
      strengths: ['Strong skills alignment', 'Direct industry experience', 'Verified company', 'Featured opportunity'],
      concerns: [],
      insights: ['High urgency - faster decision process expected', '3 years of team cohesion provides competitive advantage'],
    },
  },
  {
    opportunity: {
      id: 'opp-demo-2',
      title: 'Healthcare AI Team Lead',
      description: 'Build and lead our healthcare AI initiative. Looking for a team with ML expertise and healthcare domain knowledge.',
      company: {
        id: 'company-demo-2',
        name: 'MedTech Innovations',
        industry: 'Healthcare Technology',
        logoUrl: null,
        verificationStatus: 'verified',
      },
      industry: 'Healthcare Technology',
      location: 'Boston, MA',
      remotePolicy: 'remote',
      compensation: { min: 200000, max: 300000, currency: 'USD' },
      teamSize: { min: 4, max: 10 },
      requiredSkills: ['Python', 'TensorFlow', 'Healthcare AI'],
      urgency: 'standard',
      featured: false,
      applicationCount: 8,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    score: {
      total: 85,
      breakdown: {
        skillsMatch: 88,
        industryMatch: 75,
        locationMatch: 100,
        sizeMatch: 90,
        compensationMatch: 95,
        urgencyBonus: 70,
        companyQuality: 85,
      },
      recommendation: 'excellent',
      strengths: ['Strong skills alignment', 'Compensation meets expectations', 'Remote-friendly'],
      concerns: ['Significant industry transition'],
      insights: ['Remote opportunity provides flexibility'],
    },
  },
  {
    opportunity: {
      id: 'opp-demo-3',
      title: 'Enterprise Platform Engineering',
      description: 'Join our platform team to build next-generation infrastructure. Full team acquisition opportunity.',
      company: {
        id: 'company-demo-3',
        name: 'CloudScale Systems',
        industry: 'Technology',
        logoUrl: null,
        verificationStatus: 'pending',
      },
      industry: 'Technology',
      location: 'San Francisco, CA',
      remotePolicy: 'hybrid',
      compensation: { min: 170000, max: 230000, currency: 'USD' },
      teamSize: { min: 3, max: 6 },
      requiredSkills: ['Kubernetes', 'AWS', 'Go'],
      urgency: 'high',
      featured: true,
      applicationCount: 12,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    score: {
      total: 78,
      breakdown: {
        skillsMatch: 72,
        industryMatch: 85,
        locationMatch: 80,
        sizeMatch: 95,
        compensationMatch: 80,
        urgencyBonus: 85,
        companyQuality: 70,
      },
      recommendation: 'good',
      strengths: ['Direct industry experience', 'Featured opportunity'],
      concerns: ['Skills gap may require training'],
      insights: ['High urgency - faster decision process expected', 'Competitive opportunity with 12+ applications'],
    },
  },
];

// Types for matching calculations
interface TeamMember {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    skills?: Array<{ skill: { name: string } }>;
    profile?: { title?: string | null; yearsExperience?: number | null; location?: string | null } | null;
  };
}

interface TeamWithMembers {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  remoteStatus: string | null;
  size: number | null;
  yearsWorkingTogether: Decimal | number | string | null;
  salaryExpectationMin: number | null;
  salaryExpectationMax: number | null;
  members: TeamMember[];
  _count: { applications: number; members: number };
}

interface Company {
  id: string;
  name: string;
  industry: string | null;
  logoUrl: string | null;
  verificationStatus: string | null;
}

interface OpportunityWithCompany {
  id: string;
  title: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  remotePolicy: string | null;
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  compensationMin: number | null;
  compensationMax: number | null;
  compensationCurrency: string | null;
  requiredSkills: JsonValue;
  preferredSkills: JsonValue;
  urgency: string | null;
  featured: boolean;
  createdAt: Date;
  company: Company;
  _count: { applications: number };
}

interface ScoreBreakdown {
  skillsMatch: number;
  industryMatch: number;
  locationMatch: number;
  sizeMatch: number;
  compensationMatch: number;
  urgencyBonus: number;
  companyQuality: number;
}

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

    // For demo users, return demo matches
    if (isDemoUser(session.user.email)) {
      const filteredMatches = DEMO_OPPORTUNITY_MATCHES
        .filter(m => m.score.total >= minScore)
        .slice(0, limit);

      return NextResponse.json({
        success: true,
        data: {
          team: {
            id: teamId,
            name: 'TechFlow Analytics',
            industry: 'Financial Services',
            skills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'React'],
          },
          matches: filteredMatches,
          total: filteredMatches.length,
        }
      });
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
function extractTeamSkills(members: TeamMember[]): string[] {
  const skills = new Set<string>();
  members.forEach(member => {
    member.user.skills?.forEach((s) => {
      skills.add(s.skill.name);
    });
  });
  return Array.from(skills);
}

// Calculate match score between team and opportunity
function calculateOpportunityMatchScore(team: TeamWithMembers, teamSkills: string[], opportunity: OpportunityWithCompany) {
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

function calculateSkillsScore(teamSkills: string[], opportunity: OpportunityWithCompany): number {
  const teamSkillsLower = teamSkills.map(s => s.toLowerCase());
  const requiredSkillsArr = Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills as string[] : [];
  const preferredSkillsArr = Array.isArray(opportunity.preferredSkills) ? opportunity.preferredSkills as string[] : [];
  const requiredSkills = requiredSkillsArr.map(s => s.toLowerCase());
  const preferredSkills = preferredSkillsArr.map(s => s.toLowerCase());

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

function calculateIndustryScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
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

function calculateLocationScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
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

function calculateSizeScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
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

function calculateCompensationScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
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

function calculateUrgencyBonus(opportunity: OpportunityWithCompany): number {
  switch (opportunity.urgency) {
    case 'critical': return 100;
    case 'high': return 85;
    case 'standard': return 70;
    case 'low': return 50;
    default: return 70;
  }
}

function calculateCompanyQuality(company: Company): number {
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

function extractInsights(team: TeamWithMembers, opportunity: OpportunityWithCompany, breakdown: ScoreBreakdown) {
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
