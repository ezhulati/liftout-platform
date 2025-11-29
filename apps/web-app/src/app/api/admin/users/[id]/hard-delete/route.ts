import { NextRequest, NextResponse } from 'next/server';
import { withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { hardDeleteUser } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[id]/hard-delete - Permanently delete user
export const POST = withAdminAction(
  'user.ban' as AdminActionType, // Using ban as the strongest action type
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
    const { confirmationEmail } = body;

    if (!confirmationEmail || confirmationEmail.trim().length === 0) {
      return NextResponse.json(
        { error: 'You must type the user email to confirm permanent deletion' },
        { status: 400 }
      );
    }

    await hardDeleteUser(userId, admin.id, confirmationEmail);

    return NextResponse.json({
      success: true,
      message: 'User permanently deleted',
    });
  } catch (error) {
    console.error('Hard delete user error:', error);
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (error.message === 'Confirmation email does not match') {
        return NextResponse.json(
          { error: 'Confirmation email does not match. Please type the exact user email.' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
});
