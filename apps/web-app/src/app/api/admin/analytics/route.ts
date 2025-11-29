import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Get platform analytics
export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days

    const now = new Date();
    const periodDays = parseInt(period, 10);
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Get current period stats
    const [
      totalUsers,
      newUsers,
      previousNewUsers,
      totalTeams,
      newTeams,
      previousNewTeams,
      totalCompanies,
      newCompanies,
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      newApplications,
      previousApplications,
      successfulMatches,
      activeConversations,
      totalMessages,
      newMessages,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      // New users in period
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),
      // New users in previous period
      prisma.user.count({
        where: {
          createdAt: { gte: previousPeriodStart, lt: startDate },
        },
      }),
      // Total teams
      prisma.team.count(),
      // New teams in period
      prisma.team.count({
        where: { createdAt: { gte: startDate } },
      }),
      // Previous period teams
      prisma.team.count({
        where: {
          createdAt: { gte: previousPeriodStart, lt: startDate },
        },
      }),
      // Total companies
      prisma.company.count(),
      // New companies in period
      prisma.company.count({
        where: { createdAt: { gte: startDate } },
      }),
      // Total opportunities
      prisma.opportunity.count(),
      // Active opportunities
      prisma.opportunity.count({
        where: { status: 'active' },
      }),
      // Total applications
      prisma.teamApplication.count(),
      // New applications in period
      prisma.teamApplication.count({
        where: { appliedAt: { gte: startDate } },
      }),
      // Previous period applications
      prisma.teamApplication.count({
        where: { appliedAt: { gte: previousPeriodStart, lt: startDate } },
      }),
      // Successful matches (accepted applications)
      prisma.teamApplication.count({
        where: { status: 'accepted' },
      }),
      // Active conversations
      prisma.conversation.count({
        where: { updatedAt: { gte: startDate } },
      }),
      // Total messages
      prisma.message.count(),
      // New messages in period
      prisma.message.count({
        where: { createdAt: { gte: startDate } },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth = previousNewUsers > 0
      ? Math.round(((newUsers - previousNewUsers) / previousNewUsers) * 100)
      : newUsers > 0 ? 100 : 0;

    const teamGrowth = previousNewTeams > 0
      ? Math.round(((newTeams - previousNewTeams) / previousNewTeams) * 100)
      : newTeams > 0 ? 100 : 0;

    const applicationGrowth = previousApplications > 0
      ? Math.round(((newApplications - previousApplications) / previousApplications) * 100)
      : newApplications > 0 ? 100 : 0;

    // Get user signup trend (last 7 days)
    const signupTrend = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const dayStart = new Date(now);
        dayStart.setDate(dayStart.getDate() - (6 - i));
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const count = await prisma.user.count({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
          },
        });

        return {
          label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
          value: count,
        };
      })
    );

    // Get user type distribution
    const userTypeDistribution = await prisma.user.groupBy({
      by: ['userType'],
      _count: true,
    });

    // Get application status distribution
    const applicationStatusDistribution = await prisma.teamApplication.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get top performing teams (by applications)
    const topTeams = await prisma.team.findMany({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        applications: { _count: 'desc' },
      },
      take: 5,
    });

    // Get recent activity summary
    const recentActivity = {
      newUsers: newUsers,
      newTeams: newTeams,
      newCompanies: newCompanies,
      newApplications: newApplications,
      newMessages: newMessages,
    };

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsers,
        userGrowth,
        totalTeams,
        newTeams,
        teamGrowth,
        totalCompanies,
        newCompanies,
        totalOpportunities,
        activeOpportunities,
        totalApplications,
        newApplications,
        applicationGrowth,
        successfulMatches,
        conversionRate: totalApplications > 0
          ? Math.round((successfulMatches / totalApplications) * 100)
          : 0,
        activeConversations,
        totalMessages,
        newMessages,
      },
      charts: {
        signupTrend,
        userTypeDistribution: userTypeDistribution.map((item) => ({
          type: item.userType || 'unknown',
          count: item._count,
        })),
        applicationStatusDistribution: applicationStatusDistribution.map((item) => ({
          status: item.status,
          count: item._count,
        })),
      },
      topTeams: topTeams.map((team) => ({
        id: team.id,
        name: team.name,
        applicationCount: team._count.applications,
      })),
      recentActivity,
      period: periodDays,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
});
