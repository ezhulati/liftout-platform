import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { getTeamById, updateTeam, softDeleteTeam } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// GET /api/admin/teams/[id] - Get team details
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
    try {
      const teamId = params?.id;
      if (!teamId) {
        return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
      }

      const team = await getTeamById(teamId);
      return NextResponse.json({ team });
    } catch (error) {
      console.error('Get team error:', error);
      if (error instanceof Error && error.message === 'Team not found') {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
    }
  }
);

// PUT /api/admin/teams/[id] - Update team
export const PUT = withAdminAction(
  'team.update' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    return { targetType: 'team', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const teamId = params?.id;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, industry, verificationStatus } = body;

    const team = await updateTeam(teamId, { name, description, industry, verificationStatus }, admin.id);
    return NextResponse.json({ team });
  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
});

// DELETE /api/admin/teams/[id] - Soft delete team
export const DELETE = withAdminAction(
  'team.delete' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    return { targetType: 'team', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const teamId = params?.id;
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    await softDeleteTeam(teamId, admin.id);
    return NextResponse.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    console.error('Delete team error:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
});
