import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/stats - Get dashboard statistics for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userType = session.user.userType;

    if (userType === 'company') {
      // Company user stats
      const stats = await getCompanyStats(userId);
      return NextResponse.json({ success: true, data: stats });
    } else {
      // Individual/Team user stats
      const stats = await getTeamUserStats(userId);
      return NextResponse.json({ success: true, data: stats });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

async function getTeamUserStats(userId: string) {
  // Get user's teams
  const userTeams = await prisma.teamMember.findMany({
    where: { userId, status: 'active' },
    select: { teamId: true },
  });
  const teamIds = userTeams.map(t => t.teamId);

  // Run all queries in parallel
  const [
    teamsCount,
    opportunitiesCount,
    eoiCount,
    conversationsCount,
    applicationsCount,
    acceptedCount,
    profileViews,
  ] = await Promise.all([
    // Number of teams user is part of
    prisma.teamMember.count({
      where: { userId, status: 'active' },
    }),

    // Available opportunities (active, not expired)
    prisma.opportunity.count({
      where: {
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    }),

    // EOIs sent by user's teams (fromType = 'team' and fromId in teamIds)
    prisma.expressionOfInterest.count({
      where: {
        fromType: 'team',
        fromId: { in: teamIds.length > 0 ? teamIds : ['none'] },
      },
    }),

    // Active conversations
    prisma.conversationParticipant.count({
      where: {
        userId,
        conversation: {
          status: 'active',
        },
      },
    }),

    // Total applications from user's teams
    prisma.teamApplication.count({
      where: {
        teamId: { in: teamIds.length > 0 ? teamIds : ['none'] },
      },
    }),

    // Accepted applications (successful liftouts)
    prisma.teamApplication.count({
      where: {
        teamId: { in: teamIds.length > 0 ? teamIds : ['none'] },
        status: 'accepted',
      },
    }),

    // Profile views (count from activity logs or estimate)
    // For now, using a simple count based on team visibility
    teamIds.length > 0
      ? prisma.team.count({
          where: {
            id: { in: teamIds },
            visibility: 'public',
          },
        }).then(publicTeams => publicTeams * 5) // Estimate 5 views per public team
      : Promise.resolve(0),
  ]);

  const successRate = applicationsCount > 0
    ? Math.round((acceptedCount / applicationsCount) * 100)
    : 0;

  return {
    teamsOrProfiles: teamsCount,
    opportunities: opportunitiesCount,
    expressionsOfInterest: eoiCount,
    activeConversations: conversationsCount,
    liftoutSuccessRate: successRate,
    marketReach: profileViews,
    applications: applicationsCount,
    acceptedApplications: acceptedCount,
  };
}

async function getCompanyStats(userId: string) {
  // Get user's company
  const companyUser = await prisma.companyUser.findFirst({
    where: { userId },
    select: { companyId: true },
  });

  if (!companyUser) {
    return {
      teamsOrProfiles: 0,
      opportunities: 0,
      expressionsOfInterest: 0,
      activeConversations: 0,
      liftoutSuccessRate: 0,
      marketReach: 0,
    };
  }

  const companyId = companyUser.companyId;

  // First get company's opportunity IDs for EOI counting
  const companyOpportunities = await prisma.opportunity.findMany({
    where: { companyId },
    select: { id: true },
  });
  const opportunityIds = companyOpportunities.map(o => o.id);

  // Run all queries in parallel
  const [
    opportunitiesCount,
    activeOpportunities,
    eoiCount,
    conversationsCount,
    applicationsCount,
    acceptedCount,
    teamsEngaged,
    companyViews,
  ] = await Promise.all([
    // Total opportunities posted
    prisma.opportunity.count({
      where: { companyId },
    }),

    // Active opportunities
    prisma.opportunity.count({
      where: {
        companyId,
        status: 'active',
      },
    }),

    // EOIs received (where target is company or its opportunities)
    prisma.expressionOfInterest.count({
      where: {
        OR: [
          { toType: 'company', toId: companyId },
          ...(opportunityIds.length > 0
            ? [{ toType: 'opportunity' as const, toId: { in: opportunityIds } }]
            : []),
        ],
      },
    }),

    // Active conversations
    prisma.conversationParticipant.count({
      where: {
        userId,
        conversation: {
          status: 'active',
        },
      },
    }),

    // Total applications received
    prisma.teamApplication.count({
      where: {
        opportunityId: { in: opportunityIds.length > 0 ? opportunityIds : ['none'] },
      },
    }),

    // Accepted applications (successful liftouts)
    prisma.teamApplication.count({
      where: {
        opportunityId: { in: opportunityIds.length > 0 ? opportunityIds : ['none'] },
        status: 'accepted',
      },
    }),

    // Unique teams that have applied or expressed interest
    prisma.teamApplication.groupBy({
      by: ['teamId'],
      where: {
        opportunityId: { in: opportunityIds.length > 0 ? opportunityIds : ['none'] },
      },
    }).then(groups => groups.length),

    // Company profile views (estimate based on opportunity views)
    prisma.opportunity.count({
      where: {
        companyId,
        status: 'active',
      },
    }).then(activeOpps => activeOpps * 25), // Estimate 25 views per active opportunity
  ]);

  const successRate = applicationsCount > 0
    ? Math.round((acceptedCount / applicationsCount) * 100)
    : 0;

  return {
    teamsOrProfiles: teamsEngaged,
    opportunities: activeOpportunities,
    totalOpportunities: opportunitiesCount,
    expressionsOfInterest: eoiCount,
    activeConversations: conversationsCount,
    liftoutSuccessRate: successRate,
    marketReach: companyViews,
    applications: applicationsCount,
    acceptedApplications: acceptedCount,
  };
}
