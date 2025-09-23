import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { emailInvitationService } from '@/lib/email-invitations';

// GET /api/teams/invitations - Get user's invitations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const userEmail = session.user.email;

    if (teamId) {
      // Get invitations for a specific team
      const invitations = await emailInvitationService.getTeamInvitations(teamId);
      return NextResponse.json({ invitations });
    } else {
      // Get user's pending invitations
      const invitations = await emailInvitationService.getUserInvitations(userEmail);
      return NextResponse.json({ invitations });
    }

  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

// POST /api/teams/invitations - Send invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { teamId, teamName, inviteeEmail, role, message } = body;

    // Validation
    if (!teamId || !teamName || !inviteeEmail || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['member', 'admin', 'leader'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // TODO: Verify user has permission to invite to this team

    const invitationData = {
      teamId,
      teamName,
      inviterEmail: session.user.email,
      inviterName: session.user.name || session.user.email,
      inviteeEmail,
      role,
      message: message || undefined,
    };

    const invitationId = await emailInvitationService.sendInvitation(invitationData);

    return NextResponse.json({ 
      success: true, 
      invitationId,
      message: 'Invitation sent successfully' 
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}