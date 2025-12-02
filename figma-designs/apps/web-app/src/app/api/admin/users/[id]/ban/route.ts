import { NextRequest, NextResponse } from 'next/server';
import { withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { banUser, unbanUser } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[id]/ban - Ban user
export const POST = withAdminAction(
  'user.ban' as AdminActionType,
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
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    await banUser(userId, admin.id, reason);

    return NextResponse.json({ success: true, message: 'User banned' });
  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json({ error: 'Failed to ban user' }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id]/ban - Unban user
export const DELETE = withAdminAction(
  'user.unban' as AdminActionType,
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

    await unbanUser(userId);

    return NextResponse.json({ success: true, message: 'User unbanned' });
  } catch (error) {
    console.error('Unban user error:', error);
    return NextResponse.json({ error: 'Failed to unban user' }, { status: 500 });
  }
});
