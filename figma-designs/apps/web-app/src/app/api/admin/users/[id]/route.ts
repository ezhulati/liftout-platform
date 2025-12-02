import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { getUserById, updateUser, softDeleteUser } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// GET /api/admin/users/[id] - Get user details
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
    try {
      const userId = params?.id;
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }

      const user = await getUserById(userId);
      return NextResponse.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      if (error instanceof Error && error.message === 'User not found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
  }
);

// PUT /api/admin/users/[id] - Update user details
export const PUT = withAdminAction(
  'user.edit' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    return { targetType: 'user', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const userId = params?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const body = await req.json();
    const { firstName, lastName, email, userType, emailVerified } = body;

    const user = await updateUser(
      userId,
      { firstName, lastName, email, userType, emailVerified },
      admin.id
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id] - Soft delete user
export const DELETE = withAdminAction(
  'user.suspend' as AdminActionType, // Using suspend as soft delete action type
  async (req, _res) => {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    return { targetType: 'user', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const userId = params?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = body.reason || 'Deleted by admin';

    await softDeleteUser(userId, admin.id, reason);

    return NextResponse.json({ success: true, message: 'User soft deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
});
