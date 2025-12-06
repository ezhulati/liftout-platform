import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMockHistoricalData } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

// GET /api/analytics/historical - Get historical time-series analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const period = request.nextUrl.searchParams.get('period') || '30d';

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    let daysBack: number;

    switch (period) {
      case '7d':
        daysBack = 7;
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        daysBack = 90;
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        daysBack = 365;
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
      default:
        daysBack = 30;
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user's company if they're a company user
    let companyId: string | null = null;
    if (session.user.userType === 'company') {
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
        select: { companyId: true },
      });
      companyId = companyUser?.companyId || null;
    }

    // Try to fetch real historical data
    const historicalData = await fetchHistoricalData(startDate, now, companyId, daysBack);

    // If no real data exists, use mock data
    if (historicalData.dataPoints.length === 0) {
      const mockData = generateMockHistoricalData(period);
      return NextResponse.json({
        success: true,
        data: mockData,
        isMockData: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: historicalData,
      isMockData: false,
    });
  } catch (error) {
    console.error('Error fetching historical analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical analytics' },
      { status: 500 }
    );
  }
}

interface HistoricalDataPoint {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
  hires: number;
  rejections: number;
}

interface HistoricalData {
  period: string;
  startDate: string;
  endDate: string;
  dataPoints: HistoricalDataPoint[];
  summary: {
    totalApplications: number;
    totalInterviews: number;
    totalOffers: number;
    totalHires: number;
    totalRejections: number;
    conversionRate: number;
    averageTimeToHire: number;
  };
}

async function fetchHistoricalData(
  startDate: Date,
  endDate: Date,
  companyId: string | null,
  daysBack: number
): Promise<HistoricalData> {
  const whereClause: any = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (companyId) {
    whereClause.opportunity = { companyId };
  }

  // Fetch all applications in the date range
  const applications = await prisma.teamApplication.findMany({
    where: whereClause,
    select: {
      createdAt: true,
      status: true,
      finalDecisionAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group data by day, week, or month depending on period
  const groupingInterval = daysBack <= 7 ? 'day' : daysBack <= 90 ? 'week' : 'month';
  const dataPoints: HistoricalDataPoint[] = [];

  // Create buckets for the time period
  const buckets = createTimeBuckets(startDate, endDate, groupingInterval);

  buckets.forEach(bucket => {
    const bucketApplications = applications.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate >= bucket.start && appDate < bucket.end;
    });

    const applicationCount = bucketApplications.length;
    const interviews = bucketApplications.filter(app =>
      app.status === 'interviewing' || app.status === 'accepted'
    ).length;
    const offers = bucketApplications.filter(app =>
      app.status === 'accepted'
    ).length;
    const hires = bucketApplications.filter(app =>
      app.status === 'accepted' && app.finalDecisionAt
    ).length;
    const rejections = bucketApplications.filter(app =>
      app.status === 'rejected'
    ).length;

    dataPoints.push({
      date: bucket.label,
      applications: applicationCount,
      interviews,
      offers,
      hires,
      rejections,
    });
  });

  // Calculate summary statistics
  const totalApplications = applications.length;
  const totalInterviews = applications.filter(app =>
    app.status === 'interviewing' || app.status === 'accepted'
  ).length;
  const totalOffers = applications.filter(app =>
    app.status === 'accepted'
  ).length;
  const totalHires = applications.filter(app =>
    app.status === 'accepted' && app.finalDecisionAt
  ).length;
  const totalRejections = applications.filter(app =>
    app.status === 'rejected'
  ).length;

  const conversionRate = totalApplications > 0
    ? Math.round((totalHires / totalApplications) * 100)
    : 0;

  // Calculate average time to hire
  const hiredApplications = applications.filter(app =>
    app.status === 'accepted' && app.finalDecisionAt
  );

  let averageTimeToHire = 0;
  if (hiredApplications.length > 0) {
    const totalDays = hiredApplications.reduce((sum, app) => {
      const days = Math.ceil(
        (new Date(app.finalDecisionAt!).getTime() - new Date(app.createdAt).getTime())
        / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);
    averageTimeToHire = Math.round(totalDays / hiredApplications.length);
  }

  return {
    period: `${daysBack}d`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    dataPoints,
    summary: {
      totalApplications,
      totalInterviews,
      totalOffers,
      totalHires,
      totalRejections,
      conversionRate,
      averageTimeToHire,
    },
  };
}

interface TimeBucket {
  start: Date;
  end: Date;
  label: string;
}

function createTimeBuckets(
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month'
): TimeBucket[] {
  const buckets: TimeBucket[] = [];
  let current = new Date(startDate);

  while (current < endDate) {
    const bucketStart = new Date(current);
    let bucketEnd: Date;
    let label: string;

    if (interval === 'day') {
      bucketEnd = new Date(current.getTime() + 24 * 60 * 60 * 1000);
      label = bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (interval === 'week') {
      bucketEnd = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
      label = `Week of ${bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      // month
      bucketEnd = new Date(bucketStart.getFullYear(), bucketStart.getMonth() + 1, 1);
      label = bucketStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    buckets.push({
      start: bucketStart,
      end: bucketEnd > endDate ? endDate : bucketEnd,
      label,
    });

    current = bucketEnd;
  }

  return buckets;
}
