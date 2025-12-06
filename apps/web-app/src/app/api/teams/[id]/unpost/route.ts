import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to check if user is team admin/lead
async function isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'active',
      OR: [{ isAdmin: true }, { isLead: true }],
    },
  });
  return !!member;
}

// POST - Unpost team (hide from companies)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;

    // Verify user is team admin/lead
    const canUnpost = await isTeamAdmin(teamId, userId);
    if (!canUnpost) {
      // Also check if user is team creator
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { createdBy: true },
      });

      if (!team || team.createdBy !== userId) {
        return NextResponse.json(
          { error: 'Not authorized to unpost this team' },
          { status: 403 }
        );
      }
    }

    // Get current team status
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { postingStatus: true, name: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.postingStatus !== 'posted') {
      return NextResponse.json(
        { error: 'Team is not currently posted' },
        { status: 400 }
      );
    }

    // Get optional reason from body
    let reason = '';
    try {
      const body = await request.json();
      reason = body.reason || '';
    } catch {
      // No body provided, that's ok
    }

    // Update team posting status
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        postingStatus: 'unposted',
        unpostedAt: new Date(),
        // Store reason in metadata if provided
        ...(reason && {
          metadata: {
            unpostReason: reason,
            unpostedBy: userId,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        postingStatus: true,
        unpostedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team unposted successfully. Your team is now hidden from company searches.',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Unpost team error:', error);
    return NextResponse.json(
      { error: 'Failed to unpost team' },
      { status: 500 }
    );
  }
}
