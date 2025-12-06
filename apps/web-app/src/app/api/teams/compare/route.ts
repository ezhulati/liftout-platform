import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  isVerifiedCompanyUser,
  isCompanyBlocked,
  anonymizeTeamData,
  type TeamData,
} from '@/lib/visibility';

// POST - Compare multiple teams
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Only company users can compare teams
    if (session.user.userType !== 'company') {
      return NextResponse.json(
        { error: 'Only company users can compare teams' },
        { status: 403 }
      );
    }

    // Check company verification status
    const verification = await isVerifiedCompanyUser(session.user.id);
    const viewerCompanyId = verification.companyId;

    const body = await request.json();
    const { teamIds } = body;

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 team IDs are required for comparison' },
        { status: 400 }
      );
    }

    if (teamIds.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 teams can be compared at once' },
        { status: 400 }
      );
    }

    // Determine which visibility modes user can access
    const visibilityFilter: ('public' | 'anonymous')[] = verification.isVerified
      ? ['public', 'anonymous']
      : ['public'];

    // Fetch teams with their members - only those visible to user
    const teams = await prisma.team.findMany({
      where: {
        id: { in: teamIds },
        postingStatus: 'posted',
        visibility: { in: visibilityFilter },
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
                profile: {
                  select: {
                    yearsExperience: true,
                    title: true,
                  },
                },
                skills: {
                  select: {
                    skill: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter out teams that have blocked the viewer's company
    const accessibleTeams = viewerCompanyId
      ? teams.filter(team => !isCompanyBlocked(team, viewerCompanyId))
      : teams;

    if (accessibleTeams.length < 2) {
      return NextResponse.json(
        { error: 'Not enough valid teams found for comparison' },
        { status: 404 }
      );
    }

    // Transform teams for comparison
    const comparisonData = accessibleTeams.map((team) => {
      const isAnonymousTeam = team.visibility === 'anonymous' || team.isAnonymous;
      // Calculate aggregate skills from members
      const allSkills: string[] = [];
      let totalExperience = 0;
      let memberCount = 0;

      team.members.forEach((member) => {
        if (member.user?.skills) {
          const skills = member.user.skills.map((s) => s.skill.name);
          allSkills.push(...skills);
        }
        if (member.user?.profile?.yearsExperience) {
          totalExperience += member.user.profile.yearsExperience;
          memberCount++;
        }
      });

      // Count skill frequency
      const skillCounts = allSkills.reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top 10 skills
      const topSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Build base comparison data
      const baseData = {
        id: team.id,
        name: isAnonymousTeam ? `Anonymous Team #${team.id.slice(-6).toUpperCase()}` : team.name,
        industry: team.industry,
        specialization: team.specialization,
        location: isAnonymousTeam ? generalizeLocation(team.location) : team.location,
        size: team.size,
        memberCount: team.members.length,
        yearsWorkingTogether: team.yearsWorkingTogether ? Number(team.yearsWorkingTogether) : 0,
        remoteStatus: team.remoteStatus,
        availabilityStatus: team.availabilityStatus,
        availabilityDate: team.availabilityDate,
        verificationStatus: team.verificationStatus,
        isAnonymous: isAnonymousTeam,
        compensation: {
          salaryMin: team.salaryExpectationMin,
          salaryMax: team.salaryExpectationMax,
          currency: team.salaryCurrency,
          equity: team.equityExpectation,
        },
        culture: {
          teamCulture: team.teamCulture,
          workingStyle: team.workingStyle,
          communicationStyle: team.communicationStyle,
        },
        experience: {
          averageYears: memberCount > 0 ? Math.round(totalExperience / memberCount) : 0,
          totalYears: totalExperience,
        },
        topSkills,
        // Hide identifying info for anonymous teams
        notableAchievements: isAnonymousTeam ? null : team.notableAchievements,
        portfolioUrl: isAnonymousTeam ? null : team.portfolioUrl,
      };

      return baseData;
    });

    // Generate comparison insights
    const insights = generateComparisonInsights(comparisonData);

    return NextResponse.json({
      teams: comparisonData,
      insights,
      comparedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Compare teams error:', error);
    return NextResponse.json(
      { error: 'Failed to compare teams' },
      { status: 500 }
    );
  }
}

// Generalize location for anonymous teams
function generalizeLocation(location: string | null): string | null {
  if (!location) return null;

  const locationLower = location.toLowerCase();
  const usRegions: Record<string, string> = {
    'new york': 'Northeast US',
    'los angeles': 'West Coast US',
    'san francisco': 'West Coast US',
    'chicago': 'Midwest US',
    'boston': 'Northeast US',
    'seattle': 'West Coast US',
    'austin': 'Southwest US',
    'denver': 'Mountain West US',
    'miami': 'Southeast US',
    'atlanta': 'Southeast US',
    'dallas': 'Southwest US',
    'houston': 'Southwest US',
  };

  for (const [city, region] of Object.entries(usRegions)) {
    if (locationLower.includes(city)) {
      return region;
    }
  }

  if (locationLower.includes('london') || locationLower.includes('uk')) {
    return 'United Kingdom';
  }

  if (locationLower.includes('remote')) {
    return 'Remote';
  }

  return location;
}

function generateComparisonInsights(teams: any[]) {
  const insights: string[] = [];

  // Size comparison
  const sizes = teams.map((t) => t.memberCount);
  const maxSize = Math.max(...sizes);
  const minSize = Math.min(...sizes);
  if (maxSize !== minSize) {
    const largestTeam = teams.find((t) => t.memberCount === maxSize);
    insights.push(`${largestTeam?.name} is the largest team with ${maxSize} members`);
  }

  // Experience comparison
  const avgExperiences = teams.map((t) => t.experience.averageYears);
  const maxExp = Math.max(...avgExperiences);
  if (maxExp > 0) {
    const mostExpTeam = teams.find((t) => t.experience.averageYears === maxExp);
    insights.push(`${mostExpTeam?.name} has the most experienced team (avg ${maxExp} years)`);
  }

  // Years working together
  const yearsTogetherArr = teams.map((t) => t.yearsWorkingTogether);
  const maxYearsTogether = Math.max(...yearsTogetherArr);
  if (maxYearsTogether > 0) {
    const longestTeam = teams.find((t) => t.yearsWorkingTogether === maxYearsTogether);
    insights.push(`${longestTeam?.name} has worked together the longest (${maxYearsTogether} years)`);
  }

  // Verification status
  const verifiedTeams = teams.filter((t) => t.verificationStatus === 'verified');
  if (verifiedTeams.length > 0 && verifiedTeams.length < teams.length) {
    insights.push(`${verifiedTeams.length} of ${teams.length} teams are verified`);
  } else if (verifiedTeams.length === teams.length) {
    insights.push('All teams are verified');
  }

  // Remote work preference
  const remoteTeams = teams.filter((t) => t.remoteStatus === 'remote');
  const hybridTeams = teams.filter((t) => t.remoteStatus === 'hybrid');
  if (remoteTeams.length > 0) {
    insights.push(`${remoteTeams.length} team(s) prefer fully remote work`);
  }
  if (hybridTeams.length > 0) {
    insights.push(`${hybridTeams.length} team(s) prefer hybrid work`);
  }

  // Availability
  const availableNow = teams.filter((t) => t.availabilityStatus === 'available');
  if (availableNow.length > 0) {
    insights.push(`${availableNow.length} team(s) are available immediately`);
  }

  return insights;
}
