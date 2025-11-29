import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { searchUsers } from '@/lib/services/adminService';

export const dynamic = 'force-dynamic';

export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      query: searchParams.get('query') || undefined,
      userType: searchParams.get('userType') || undefined,
      status: searchParams.get('status') as 'active' | 'suspended' | 'banned' | undefined,
      verified: searchParams.has('verified')
        ? searchParams.get('verified') === 'true'
        : undefined,
      limit: searchParams.has('limit')
        ? parseInt(searchParams.get('limit')!, 10)
        : 20,
      offset: searchParams.has('offset')
        ? parseInt(searchParams.get('offset')!, 10)
        : 0,
    };

    const { users, total } = await searchUsers(filters);

    return NextResponse.json({
      users,
      total,
      limit: filters.limit,
      offset: filters.offset,
    });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});
