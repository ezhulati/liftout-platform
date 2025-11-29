import { NextRequest, NextResponse } from 'next/server';
import { withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { verifyTeam, rejectTeamVerification } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/teams/[id]/verify - Verify team
export const POST = withAdminAction(
  'team.verify' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2];
    return { targetType: 'team', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const teamId = params?.id;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    await verifyTeam(teamId, admin.id);
    return NextResponse.json({ success: true, message: 'Team verified' });
  } catch (error) {
    console.error('Verify team error:', error);
    return NextResponse.json({ error: 'Failed to verify team' }, { status: 500 });
  }
});

// DELETE /api/admin/teams/[id]/verify - Reject verification
export const DELETE = withAdminAction(
  'team.reject' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2];
    return { targetType: 'team', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const teamId = params?.id;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    await rejectTeamVerification(teamId, admin.id, reason);
    return NextResponse.json({ success: true, message: 'Team verification rejected' });
  } catch (error) {
    console.error('Reject team verification error:', error);
    return NextResponse.json({ error: 'Failed to reject verification' }, { status: 500 });
  }
});
