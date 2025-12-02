import { NextRequest, NextResponse } from 'next/server';
import { withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { suspendUser, unsuspendUser } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[id]/suspend - Suspend user
export const POST = withAdminAction(
  'user.suspend' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2]; // Get ID before /suspend
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

    await suspendUser(userId, admin.id, reason);

    return NextResponse.json({ success: true, message: 'User suspended' });
  } catch (error) {
    console.error('Suspend user error:', error);
    return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id]/suspend - Unsuspend user
export const DELETE = withAdminAction(
  'user.unsuspend' as AdminActionType,
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

    await unsuspendUser(userId);

    return NextResponse.json({ success: true, message: 'User unsuspended' });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    return NextResponse.json({ error: 'Failed to unsuspend user' }, { status: 500 });
  }
});
