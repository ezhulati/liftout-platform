import { NextResponse } from 'next/server';
import { getHealthStatus, getMetricsSummary } from '@/lib/monitoring';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health - Health check endpoint
 *
 * Returns the health status of the application including:
 * - Overall status (healthy, degraded, unhealthy)
 * - Database connectivity
 * - Memory usage
 * - Performance metrics
 */
export async function GET() {
  try {
    const healthStatus = await getHealthStatus();
    const metricsSummary = getMetricsSummary();

    // Check database connectivity
    let dbStatus: { status: 'pass' | 'fail'; message?: string } = {
      status: 'fail',
      message: 'Database check skipped',
    };

    try {
      const start = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      const duration = Math.round(performance.now() - start);
      dbStatus = {
        status: 'pass',
        message: `Connected (${duration}ms)`,
      };
    } catch (error) {
      dbStatus = {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }

    // Add database check to health status
    healthStatus.checks.push({
      name: 'database',
      ...dbStatus,
    });

    // Recalculate overall status
    const failedChecks = healthStatus.checks.filter((c) => c.status === 'fail').length;
    if (failedChecks > 0) {
      healthStatus.status = failedChecks === healthStatus.checks.length ? 'unhealthy' : 'degraded';
    }

    const response = {
      ...healthStatus,
      metrics: {
        totalRequests: metricsSummary.totalRequests,
        avgResponseTime: metricsSummary.avgDuration,
        slowRequests: metricsSummary.slowRequests,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };

    // Return appropriate status code based on health
    const statusCode = healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 503 }
    );
  }
}
