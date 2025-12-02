import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { startImpersonation, endImpersonation } from '@/lib/services/adminService';
import { AdminActionType, extractRequestMetadata } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[id]/impersonate - Start impersonation session
export const POST = withAdminAction(
  'user.impersonate' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2];
    return { targetType: 'user', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const userId = params?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const body = await req.json();
    const { reason } = body;

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reason is required for impersonation' },
        { status: 400 }
      );
    }

    const metadata = extractRequestMetadata(req);
    const { token, expiresAt } = await startImpersonation(
      admin.id,
      userId,
      reason,
      { ipAddress: metadata.ipAddress, userAgent: metadata.userAgent }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      message: 'Impersonation session started. You have 30 minutes.',
    });
  } catch (error) {
    console.error('Start impersonation error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to start impersonation' }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id]/impersonate - End impersonation session
export const DELETE = withAdminAccess(
  async (req: NextRequest, admin: AdminUser) => {
    try {
      const { searchParams } = new URL(req.url);
      const token = searchParams.get('token');

      if (!token) {
        return NextResponse.json({ error: 'Token required' }, { status: 400 });
      }

      await endImpersonation(token);

      return NextResponse.json({
        success: true,
        message: 'Impersonation session ended',
      });
    } catch (error) {
      console.error('End impersonation error:', error);
      return NextResponse.json({ error: 'Failed to end impersonation' }, { status: 500 });
    }
  }
);

