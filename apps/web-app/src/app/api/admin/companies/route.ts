import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { getCompanies } from '@/lib/services/adminService';

export const dynamic = 'force-dynamic';

// GET /api/admin/companies - Get all companies with filters
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser) => {
    try {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get('query') || undefined;
      const verificationStatus = searchParams.get('verificationStatus') || undefined;
      const status = searchParams.get('status') as 'active' | 'deleted' | undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
      const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

      const { companies, total } = await getCompanies({
        query,
        verificationStatus,
        status,
        limit,
        offset,
      });

      return NextResponse.json({
        companies,
        total,
        limit,
        offset,
      });
    } catch (error) {
      console.error('Get companies error:', error);
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
  }
);
