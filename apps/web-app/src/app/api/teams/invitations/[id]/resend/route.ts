import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// POST - Resend invitation (reminder)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = params.id;

    // Handle demo invitations (IDs starting with demo-)
    if (memberId.startsWith('demo-')) {
      console.log(`[Demo] Resending invitation ${memberId}`);
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);
      return NextResponse.json({
        success: true,
        message: 'Invitation resent successfully (demo mode)',
        expiresAt: newExpiresAt.toISOString(),
      });
    }

    // Find the pending team member (invitation)
    const pendingMember = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            createdBy: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!pendingMember) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (pendingMember.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation has already been accepted or is no longer pending' },
        { status: 400 }
      );
    }

    // Verify user has permission to resend (must be team admin/lead or the inviter)
    const currentUserMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: pendingMember.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    const isTeamCreator = pendingMember.team.createdBy === session.user.id;
    const isTeamAdmin = currentUserMembership?.isAdmin || currentUserMembership?.isLead;
    const isOriginalInviter = pendingMember.invitedBy === session.user.id;

    if (!isTeamCreator && !isTeamAdmin && !isOriginalInviter) {
      return NextResponse.json(
        { error: 'You do not have permission to resend this invitation' },
        { status: 403 }
      );
    }

    // Generate new invitation token and extend expiration
    const newToken = crypto.randomUUID();
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 days from now

    // Update the invitation
    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: {
        invitationToken: newToken,
        invitationExpiresAt: newExpiresAt,
        invitedAt: new Date(), // Reset invited date
      },
    });

    // TODO: Send actual email notification here
    // For now, log the invitation details
    console.log(`[Invitation Resent] Team: ${pendingMember.team.name}, To: ${pendingMember.user?.email}, Token: ${newToken}`);

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'resend_invitation',
        resourceType: 'team_member',
        resourceId: memberId,
        newValues: {
          invitationExpiresAt: newExpiresAt.toISOString(),
          teamName: pendingMember.team.name,
          inviteeEmail: pendingMember.user?.email,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully',
      expiresAt: newExpiresAt.toISOString(),
      invitationId: memberId,
    });
  } catch (error) {
    console.error('Resend invitation error:', error);
    return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
  }
}
