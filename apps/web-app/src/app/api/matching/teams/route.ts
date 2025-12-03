import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Decimal, JsonValue } from '@prisma/client/runtime/library';
import { Prisma, TeamVisibility } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Helper to check if user is from a verified company
async function isVerifiedCompanyUser(userId: string): Promise<boolean> {
  const companyUser = await prisma.companyUser.findFirst({
    where: { userId },
    include: {
      company: {
        select: { verificationStatus: true },
      },
    },
  });
  return companyUser?.company?.verificationStatus === 'verified';
}

// Helper to anonymize team data for anonymous visibility mode
function anonymizeTeamData(teamData: any): any {
  return {
    ...teamData,
    name: `Anonymous Team #${teamData.id.slice(-6).toUpperCase()}`,
    description: 'Team details hidden in anonymous mode. Express interest to learn more.',
    // Keep key matching data visible
    industry: teamData.industry,
    size: teamData.size,
    location: teamData.location ? 'Location withheld' : null,
  };
}

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
  description: string | null;
  industry: string | null;
  specialization: string | null;
  location: string | null;
  remoteStatus: string | null;
  size: number | null;
  yearsWorkingTogether: Decimal | number | string | null;
  availabilityStatus: string | null;
  verificationStatus: string | null;
  salaryExpectationMin: number | null;
  salaryExpectationMax: number | null;
  members: TeamMember[];
  _count: { applications: number; members: number };
}

interface OpportunityWithCompany {
  id: string;
  title: string;
  industry: string | null;
  location: string | null;
  remotePolicy: string | null;
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  compensationMin: number | null;
  compensationMax: number | null;
  requiredSkills: JsonValue;
  preferredSkills: JsonValue;
  company: { id: string; name: string; industry: string | null };
}

interface ScoreBreakdown {
  skillsMatch: number;
  industryMatch: number;
  locationMatch: number;
  sizeMatch: number;
  compensationMatch: number;
  experienceMatch: number;
  availabilityMatch: number;
}

// GET /api/matching/teams?opportunityId=xxx - Find matching teams for an opportunity
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const opportunityId = request.nextUrl.searchParams.get('opportunityId');
    const minScore = parseInt(request.nextUrl.searchParams.get('minScore') || '50');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

    if (!opportunityId) {
      return NextResponse.json({ error: 'opportunityId is required' }, { status: 400 });
    }

    // Fetch the opportunity
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        company: {
          select: { id: true, name: true, industry: true }
        }
      }
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if current user is from a verified company
    const isVerified = session.user.userType === 'company'
      ? await isVerifiedCompanyUser(session.user.id)
      : false;

    // Build visibility filter - verified companies can see anonymous teams
    const visibilityFilter: TeamVisibility[] = [TeamVisibility.public];
    if (isVerified) {
      visibilityFilter.push(TeamVisibility.anonymous);
    }

    // Fetch available teams with visibility filter
    // Only exclude teams that have explicitly set allowDiscovery to false
    const teams = await prisma.team.findMany({
      where: {
        visibility: { in: visibilityFilter },
        availabilityStatus: { not: 'not_available' },
        deletedAt: null,
        // Exclude teams that have explicitly disabled discovery
        NOT: {
          metadata: {
            path: ['visibilitySettings', 'allowDiscovery'],
            equals: false,
          },
        },
      },
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
      },
      take: 100, // Get more teams for better matching
    });

    // Calculate match scores
    const matches = teams.map(team => {
      const score = calculateTeamMatchScore(team, opportunity as unknown as OpportunityWithCompany);

      let teamData = {
        id: team.id,
        name: team.name,
        description: team.description,
        industry: team.industry,
        specialization: team.specialization,
        location: team.location,
        remoteStatus: team.remoteStatus,
        size: team.size,
        yearsWorkingTogether: team.yearsWorkingTogether,
        availabilityStatus: team.availabilityStatus,
        verificationStatus: team.verificationStatus,
        memberCount: team._count.members,
        applicationCount: team._count.applications,
        skills: extractTeamSkills(team.members),
        visibility: team.visibility,
        isAnonymous: team.isAnonymous,
      };

      // Anonymize team data if in anonymous mode
      if (team.visibility === TeamVisibility.anonymous || team.isAnonymous) {
        teamData = anonymizeTeamData(teamData);
      }

      return {
        team: teamData,
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
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company.name,
          industry: opportunity.industry,
        },
        matches: filteredMatches,
        total: filteredMatches.length,
      }
    });
  } catch (error) {
    console.error('Error finding team matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matching teams' },
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
function calculateTeamMatchScore(team: TeamWithMembers, opportunity: OpportunityWithCompany) {
  const breakdown = {
    skillsMatch: calculateSkillsScore(team, opportunity),
    industryMatch: calculateIndustryScore(team, opportunity),
    locationMatch: calculateLocationScore(team, opportunity),
    sizeMatch: calculateSizeScore(team, opportunity),
    compensationMatch: calculateCompensationScore(team, opportunity),
    experienceMatch: calculateExperienceScore(team),
    availabilityMatch: calculateAvailabilityScore(team),
  };

  const weights = {
    skillsMatch: 0.30,
    industryMatch: 0.20,
    locationMatch: 0.10,
    sizeMatch: 0.10,
    compensationMatch: 0.15,
    experienceMatch: 0.10,
    availabilityMatch: 0.05,
  };

  const total = Math.round(
    Object.entries(breakdown).reduce((sum, [key, score]) => {
      return sum + score * weights[key as keyof typeof weights];
    }, 0)
  );

  const recommendation = getRecommendation(total);
  const { strengths, concerns } = extractInsights(team, opportunity, breakdown);

  return {
    total,
    breakdown,
    recommendation,
    strengths,
    concerns,
  };
}

function calculateSkillsScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
  const teamSkills = extractTeamSkills(team.members).map(s => s.toLowerCase());
  const requiredSkillsArr = Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills as string[] : [];
  const preferredSkillsArr = Array.isArray(opportunity.preferredSkills) ? opportunity.preferredSkills as string[] : [];
  const requiredSkills = requiredSkillsArr.map(s => s.toLowerCase());
  const preferredSkills = preferredSkillsArr.map(s => s.toLowerCase());

  if (requiredSkills.length === 0 && preferredSkills.length === 0) return 70;

  let score = 0;
  const totalSkills = requiredSkills.length + preferredSkills.length * 0.5;

  // Required skills (more important)
  const matchedRequired = requiredSkills.filter((skill: string) =>
    teamSkills.some(ts => ts.includes(skill) || skill.includes(ts))
  ).length;
  score += (matchedRequired / Math.max(requiredSkills.length, 1)) * 70;

  // Preferred skills
  const matchedPreferred = preferredSkills.filter((skill: string) =>
    teamSkills.some(ts => ts.includes(skill) || skill.includes(ts))
  ).length;
  score += (matchedPreferred / Math.max(preferredSkills.length, 1)) * 30;

  return Math.min(Math.round(score), 100);
}

function calculateIndustryScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
  const teamIndustry = team.industry?.toLowerCase() || '';
  const oppIndustry = opportunity.industry?.toLowerCase() || '';

  if (!teamIndustry || !oppIndustry) return 50;
  if (teamIndustry === oppIndustry) return 100;

  // Industry transfer compatibility
  const transfers: Record<string, string[]> = {
    'financial services': ['fintech', 'investment banking', 'private equity', 'consulting'],
    'technology': ['fintech', 'healthcare technology', 'enterprise software'],
    'healthcare': ['healthcare technology', 'biotechnology', 'pharmaceuticals'],
    'consulting': ['financial services', 'technology', 'strategy'],
  };

  const related = transfers[teamIndustry] || [];
  if (related.some(r => oppIndustry.includes(r) || r.includes(oppIndustry))) {
    return 75;
  }

  return 40;
}

function calculateLocationScore(team: TeamWithMembers, opportunity: OpportunityWithCompany): number {
  const teamLocation = team.location?.toLowerCase() || '';
  const oppLocation = opportunity.location?.toLowerCase() || '';
  const teamRemote = team.remoteStatus;
  const oppRemote = opportunity.remotePolicy;

  // Remote matches
  if (teamRemote === 'remote' && oppRemote === 'remote') return 100;
  if (oppRemote === 'remote') return 90;

  // Location matches
  if (teamLocation && oppLocation && teamLocation === oppLocation) return 100;

  // Hybrid compatibility
  if (teamRemote === 'hybrid' || oppRemote === 'hybrid') return 70;

  // Remote team for onsite opportunity
  if (teamRemote === 'remote' && oppRemote === 'onsite') return 30;

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

  if (!teamMin && !teamMax) return 70; // No expectations set
  if (!oppMin && !oppMax) return 70; // No budget set

  // Check for overlap
  const overlapMin = Math.max(teamMin, oppMin);
  const overlapMax = Math.min(teamMax, oppMax);

  if (overlapMax >= overlapMin) {
    // There's overlap
    const overlapSize = overlapMax - overlapMin;
    const teamRange = teamMax - teamMin || 1;
    return Math.min(Math.round(70 + (overlapSize / teamRange) * 30), 100);
  }

  // No overlap - calculate gap
  const gap = teamMin > oppMax ? teamMin - oppMax : oppMin - teamMax;
  const gapPercent = gap / Math.max(teamMin, oppMin);
  return Math.max(0, Math.round(70 - gapPercent * 100));
}

function calculateExperienceScore(team: TeamWithMembers): number {
  const yearsWorking = Number(team.yearsWorkingTogether) || 0;

  if (yearsWorking >= 5) return 100;
  if (yearsWorking >= 3) return 85;
  if (yearsWorking >= 2) return 70;
  if (yearsWorking >= 1) return 55;
  return 40;
}

function calculateAvailabilityScore(team: TeamWithMembers): number {
  switch (team.availabilityStatus) {
    case 'available': return 100;
    case 'selective': return 70;
    case 'engaged': return 40;
    default: return 0;
  }
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

  if (breakdown.skillsMatch >= 80) strengths.push('Exceptional skills alignment');
  else if (breakdown.skillsMatch < 50) concerns.push('Skills gap may require training');

  if (breakdown.industryMatch >= 90) strengths.push('Direct industry experience');
  else if (breakdown.industryMatch < 50) concerns.push('Industry transition needed');

  if (breakdown.experienceMatch >= 85) strengths.push('Highly cohesive team');
  else if (breakdown.experienceMatch < 50) concerns.push('Limited shared working history');

  if (breakdown.compensationMatch < 60) concerns.push('Compensation expectations may not align');

  if (breakdown.locationMatch < 50) concerns.push('Location/remote work mismatch');

  if (team.verificationStatus === 'verified') strengths.push('Verified credentials');
  else if (team.verificationStatus === 'pending') concerns.push('Verification pending');

  return { strengths, concerns };
}
