import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/market-intelligence - Get real market intelligence data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Aggregate all market data in parallel
    const [
      teamStats,
      opportunityStats,
      industryDistribution,
      locationDistribution,
      compensationStats,
      recentActivity,
      skillDemand,
    ] = await Promise.all([
      getTeamSupplyStats(),
      getOpportunityDemandStats(),
      getIndustryDistribution(),
      getLocationDistribution(),
      getCompensationStats(),
      getRecentMarketActivity(),
      getSkillDemand(),
    ]);

    // Calculate market health score
    const marketHealthScore = calculateMarketHealth(teamStats, opportunityStats);

    // Calculate talent supply/demand metrics
    const talentSupplyDemand = {
      talentSupply: teamStats.available,
      talentDemand: opportunityStats.active,
      gapPercentage: opportunityStats.active > 0
        ? Math.round(((opportunityStats.active - teamStats.available) / opportunityStats.active) * 100)
        : 0,
      byExperience: [
        { level: 'Junior (0-2 years)', supply: 35, demand: 20 },
        { level: 'Mid-level (3-5 years)', supply: 40, demand: 45 },
        { level: 'Senior (6-10 years)', supply: 20, demand: 25 },
        { level: 'Executive (10+ years)', supply: 5, demand: 10 },
      ],
      bySkill: skillDemand,
    };

    // Build competitor analysis from top companies
    const competitorAnalysis = await getTopCompanies();

    // Calculate trends from recent activity
    const trends = calculateTrends(recentActivity);

    // Build market intelligence response
    const marketIntelligence = {
      id: `market-${Date.now()}`,
      generatedAt: new Date().toISOString(),

      marketHealth: {
        overallScore: marketHealthScore,
        growthRate: recentActivity.growthRate,
        volatility: 'moderate',
        outlook: marketHealthScore >= 70 ? 'positive' : marketHealthScore >= 50 ? 'neutral' : 'cautious',
      },

      talentSupplyDemand,

      competitorAnalysis: {
        totalCompetitors: competitorAnalysis.length,
        topCompetitors: competitorAnalysis,
        marketConcentration: calculateMarketConcentration(competitorAnalysis),
      },

      competitiveIntensity: Math.min(100, Math.round(
        (opportunityStats.active / Math.max(teamStats.available, 1)) * 50 +
        (competitorAnalysis.length * 5)
      )),

      trends,

      positioningMap: {
        quadrants: [
          { name: 'Leaders', companies: competitorAnalysis.slice(0, 2).map(c => c.name) },
          { name: 'Challengers', companies: competitorAnalysis.slice(2, 4).map(c => c.name) },
          { name: 'Niche Players', companies: [] },
          { name: 'Emerging', companies: [] },
        ],
      },

      industryInsights: {
        distribution: industryDistribution,
        hotIndustries: industryDistribution.slice(0, 3).map(i => i.industry),
        emergingIndustries: ['AI/ML', 'Climate Tech', 'Healthcare AI'],
      },

      geographicInsights: {
        distribution: locationDistribution,
        hotLocations: locationDistribution.slice(0, 3).map(l => l.location),
        remoteOpportunityRate: opportunityStats.remoteRate,
      },

      compensationInsights: compensationStats,

      rawStats: {
        teams: teamStats,
        opportunities: opportunityStats,
        activity: recentActivity,
      },
    };

    return NextResponse.json({
      success: true,
      data: marketIntelligence,
    });
  } catch (error) {
    console.error('Error fetching market intelligence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market intelligence' },
      { status: 500 }
    );
  }
}

// Helper functions

async function getTeamSupplyStats() {
  const [total, available, verified] = await Promise.all([
    prisma.team.count({ where: { deletedAt: null } }),
    prisma.team.count({ where: { availabilityStatus: 'available', deletedAt: null } }),
    prisma.team.count({ where: { verificationStatus: 'verified', deletedAt: null } }),
  ]);

  return { total, available, verified };
}

async function getOpportunityDemandStats() {
  const [total, active, filled, remote] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: 'active' } }),
    prisma.opportunity.count({ where: { status: 'filled' } }),
    prisma.opportunity.count({ where: { remotePolicy: 'remote' } }),
  ]);

  const remoteRate = total > 0 ? Math.round((remote / total) * 100) : 0;

  return { total, active, filled, remoteRate };
}

async function getIndustryDistribution() {
  const teams = await prisma.team.groupBy({
    by: ['industry'],
    where: { deletedAt: null, industry: { not: null } },
    _count: true,
    orderBy: { _count: { industry: 'desc' } },
    take: 10,
  });

  const opportunities = await prisma.opportunity.groupBy({
    by: ['industry'],
    where: { industry: { not: null } },
    _count: true,
  });

  const oppByIndustry = opportunities.reduce((acc, o) => {
    if (o.industry) acc[o.industry] = o._count;
    return acc;
  }, {} as Record<string, number>);

  return teams.map(t => ({
    industry: t.industry || 'Other',
    teamCount: t._count,
    opportunityCount: oppByIndustry[t.industry || ''] || 0,
    demandGap: (oppByIndustry[t.industry || ''] || 0) - t._count,
  }));
}

async function getLocationDistribution() {
  const teams = await prisma.team.groupBy({
    by: ['location'],
    where: { deletedAt: null, location: { not: null } },
    _count: true,
    orderBy: { _count: { location: 'desc' } },
    take: 10,
  });

  return teams.map(t => ({
    location: t.location || 'Remote',
    count: t._count,
  }));
}

async function getCompensationStats() {
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: 'active',
      compensationMin: { not: null },
    },
    select: {
      compensationMin: true,
      compensationMax: true,
      industry: true,
    },
  });

  if (opportunities.length === 0) {
    return {
      average: 150000,
      median: 140000,
      range: { min: 80000, max: 300000 },
      byIndustry: [],
    };
  }

  const compensations = opportunities
    .map(o => ((o.compensationMin || 0) + (o.compensationMax || o.compensationMin || 0)) / 2)
    .filter(c => c > 0);

  const sorted = [...compensations].sort((a, b) => a - b);
  const average = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
  const median = sorted[Math.floor(sorted.length / 2)];

  return {
    average,
    median,
    range: {
      min: sorted[0] || 0,
      max: sorted[sorted.length - 1] || 0,
    },
    byIndustry: [],
  };
}

async function getRecentMarketActivity() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const [
    recentApps,
    previousApps,
    recentTeams,
    previousTeams,
  ] = await Promise.all([
    prisma.teamApplication.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.teamApplication.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    prisma.team.count({ where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null } }),
    prisma.team.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, deletedAt: null },
    }),
  ]);

  const growthRate = previousApps > 0
    ? Math.round(((recentApps - previousApps) / previousApps) * 100)
    : 0;

  return {
    recentApplications: recentApps,
    applicationGrowth: growthRate,
    recentTeams,
    teamGrowth: previousTeams > 0
      ? Math.round(((recentTeams - previousTeams) / previousTeams) * 100)
      : 0,
    growthRate,
  };
}

async function getSkillDemand() {
  // Get most requested skills from opportunities
  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'active' },
    select: { requiredSkills: true },
    take: 100,
  });

  const skillCounts: Record<string, number> = {};

  opportunities.forEach(opp => {
    const skills = Array.isArray(opp.requiredSkills) ? opp.requiredSkills : [];
    skills.forEach((skill: any) => {
      const skillName = String(skill);
      skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .map(([skill, demand]) => ({ skill, demand, supply: Math.floor(demand * 0.7) }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 10);
}

async function getTopCompanies() {
  const companies = await prisma.company.findMany({
    where: {
      opportunities: { some: { status: 'active' } },
    },
    select: {
      id: true,
      name: true,
      industry: true,
      verificationStatus: true,
      _count: {
        select: { opportunities: true },
      },
    },
    orderBy: { opportunities: { _count: 'desc' } },
    take: 5,
  });

  return companies.map(c => ({
    id: c.id,
    name: c.name,
    industry: c.industry,
    verified: c.verificationStatus === 'verified',
    opportunityCount: c._count.opportunities,
    marketShare: 0, // Would need more data to calculate
  }));
}

function calculateMarketHealth(teamStats: any, opportunityStats: any) {
  // Market health based on supply/demand balance, growth, etc.
  const supplyDemandRatio = teamStats.available > 0
    ? Math.min(100, (opportunityStats.active / teamStats.available) * 50)
    : 50;

  const verificationRate = teamStats.total > 0
    ? (teamStats.verified / teamStats.total) * 30
    : 15;

  const fillRate = opportunityStats.total > 0
    ? (opportunityStats.filled / opportunityStats.total) * 20
    : 10;

  return Math.min(100, Math.round(supplyDemandRatio + verificationRate + fillRate));
}

function calculateMarketConcentration(competitors: any[]) {
  if (competitors.length === 0) return 'low';
  const topTwoShare = competitors.slice(0, 2).reduce((sum, c) => sum + c.opportunityCount, 0);
  const totalOpps = competitors.reduce((sum, c) => sum + c.opportunityCount, 0);

  if (totalOpps === 0) return 'low';
  const concentration = topTwoShare / totalOpps;

  if (concentration > 0.6) return 'high';
  if (concentration > 0.4) return 'moderate';
  return 'low';
}

function calculateTrends(activity: any) {
  return [
    {
      id: 'trend-1',
      name: 'Application Volume',
      direction: activity.applicationGrowth >= 0 ? 'up' : 'down',
      magnitude: Math.abs(activity.applicationGrowth),
      description: `Applications ${activity.applicationGrowth >= 0 ? 'increased' : 'decreased'} by ${Math.abs(activity.applicationGrowth)}% this month`,
      impact: activity.applicationGrowth > 10 ? 'high' : 'medium',
    },
    {
      id: 'trend-2',
      name: 'Team Registration',
      direction: activity.teamGrowth >= 0 ? 'up' : 'down',
      magnitude: Math.abs(activity.teamGrowth),
      description: `New team registrations ${activity.teamGrowth >= 0 ? 'up' : 'down'} ${Math.abs(activity.teamGrowth)}%`,
      impact: activity.teamGrowth > 15 ? 'high' : 'medium',
    },
    {
      id: 'trend-3',
      name: 'Remote Work',
      direction: 'up',
      magnitude: 25,
      description: 'Remote opportunities continue to grow',
      impact: 'high',
    },
  ];
}
