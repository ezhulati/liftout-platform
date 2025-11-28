import { NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { getAdminDashboardMetrics } from '@/lib/services/adminService';

export const GET = withAdminAccess(async () => {
  try {
    const metrics = await getAdminDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
});
