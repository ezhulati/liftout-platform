import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { emailInvitationService } from '@/lib/email-invitations';

// PATCH /api/teams/invitations/[id] - Accept, decline, or revoke invitation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: { action?: string } | null = null;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    body = await request.json();
    const { action } = body;
    const invitationId = params.id;
    const userEmail = session.user.email;

    if (!action || !['accept', 'decline', 'revoke'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be accept, decline, or revoke' },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (action) {
      case 'accept':
        await emailInvitationService.acceptInvitation(invitationId, userEmail);
        message = 'Invitation accepted successfully';
        break;
        
      case 'decline':
        await emailInvitationService.declineInvitation(invitationId, userEmail);
        message = 'Invitation declined successfully';
        break;
        
      case 'revoke':
        await emailInvitationService.revokeInvitation(invitationId, userEmail);
        message = 'Invitation revoked successfully';
        break;
    }

    return NextResponse.json({ 
      success: true, 
      message 
    });

  } catch (error) {
    console.error(`Error ${body?.action || 'processing'}ing invitation:`, error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to ${body?.action || 'process'} invitation` },
      { status: 500 }
    );
  }
}

// POST /api/teams/invitations/[id] - Send reminder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;
    const invitationId = params.id;

    if (action !== 'reminder') {
      return NextResponse.json(
        { error: 'Invalid action for POST. Use "reminder"' },
        { status: 400 }
      );
    }

    await emailInvitationService.sendReminder(invitationId);

    return NextResponse.json({ 
      success: true, 
      message: 'Reminder sent successfully' 
    });

  } catch (error) {
    console.error('Error sending reminder:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}