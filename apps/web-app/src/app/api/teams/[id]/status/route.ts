import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get team posting status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const teamId = params.id;

    // Get team with status info
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        postingStatus: true,
        postedAt: true,
        unpostedAt: true,
        availabilityStatus: true,
        visibility: true,
        createdAt: true,
        members: {
          where: { status: 'active' },
          select: {
            id: true,
            userId: true,
            isLead: true,
            isAdmin: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check if user is a member
    const isMember = team.members.some((m) => m.userId === session.user.id);
    const isLeadOrAdmin = team.members.some(
      (m) => m.userId === session.user.id && (m.isLead || m.isAdmin)
    );

    // Derive status message
    let statusMessage = '';
    let statusColor = '';
    switch (team.postingStatus) {
      case 'draft':
        statusMessage = 'Team is in draft mode. Complete all requirements to post.';
        statusColor = 'gray';
        break;
      case 'ready':
        statusMessage = 'Team is ready to post! Click "Post Team" to make visible to companies.';
        statusColor = 'blue';
        break;
      case 'posted':
        statusMessage = 'Team is live and visible to companies.';
        statusColor = 'green';
        break;
      case 'unposted':
        statusMessage = 'Team is hidden from company searches.';
        statusColor = 'yellow';
        break;
    }

    return NextResponse.json({
      teamId: team.id,
      teamName: team.name,
      postingStatus: team.postingStatus,
      postedAt: team.postedAt,
      unpostedAt: team.unpostedAt,
      availabilityStatus: team.availabilityStatus,
      visibility: team.visibility,
      memberCount: team.members.length,
      isMember,
      isLeadOrAdmin,
      canPost: isLeadOrAdmin,
      canUnpost: isLeadOrAdmin && team.postingStatus === 'posted',
      statusMessage,
      statusColor,
    });
  } catch (error) {
    console.error('Get team status error:', error);
    return NextResponse.json(
      { error: 'Failed to get team status' },
      { status: 500 }
    );
  }
}
