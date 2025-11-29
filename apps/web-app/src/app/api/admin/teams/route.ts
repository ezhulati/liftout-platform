import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { getTeams } from '@/lib/services/adminService';

export const dynamic = 'force-dynamic';

// GET /api/admin/teams - Get all teams with filters
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser) => {
    try {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get('query') || undefined;
      const verificationStatus = searchParams.get('verificationStatus') || undefined;
      const status = searchParams.get('status') as 'active' | 'deleted' | undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
      const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

      const { teams, total } = await getTeams({
        query,
        verificationStatus,
        status,
        limit,
        offset,
      });

      return NextResponse.json({
        teams,
        total,
        limit,
        offset,
      });
    } catch (error) {
      console.error('Get teams error:', error);
      return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }
  }
);
