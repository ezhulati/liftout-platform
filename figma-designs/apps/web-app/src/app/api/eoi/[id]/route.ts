import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// GET - Get a specific EOI
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eoi = await prisma.expressionOfInterest.findUnique({
      where: { id: params.id },
    });

    if (!eoi) {
      return NextResponse.json({ error: 'EOI not found' }, { status: 404 });
    }

    return NextResponse.json(eoi);
  } catch (error) {
    console.error('Error fetching EOI:', error);
    return NextResponse.json({ error: 'Failed to fetch EOI' }, { status: 500 });
  }
}

// PATCH - Update EOI status (accept/decline)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, responseMessage } = body;

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const eoi = await prisma.expressionOfInterest.findUnique({
      where: { id: params.id },
    });

    if (!eoi) {
      return NextResponse.json({ error: 'EOI not found' }, { status: 404 });
    }

    // Verify user has permission to respond (is team admin)
    if (eoi.toType === 'team') {
      const membership = await prisma.teamMember.findFirst({
        where: {
          teamId: eoi.toId,
          userId: session.user.id,
          status: 'active',
          OR: [{ isAdmin: true }, { isLead: true }],
        },
      });

      if (!membership) {
        return NextResponse.json({ error: 'Not authorized to respond to this EOI' }, { status: 403 });
      }
    }

    // Update the EOI
    const updatedEoi = await prisma.expressionOfInterest.update({
      where: { id: params.id },
      data: {
        status,
        respondedAt: new Date(),
        metadata: {
          ...((eoi.metadata as object) || {}),
          responseMessage,
          respondedBy: session.user.id,
        },
      },
    });

    // Create notification for the sender
    await prisma.notification.create({
      data: {
        userId: eoi.fromId,
        type: 'application_update',
        title: status === 'accepted' ? 'EOI Accepted!' : 'EOI Update',
        message: status === 'accepted'
          ? 'Great news! The team has accepted your expression of interest.'
          : 'The team has declined your expression of interest.',
        data: { eoiId: eoi.id, status },
        actionUrl: `/app/eoi/${eoi.id}`,
      },
    });

    // If accepted, create a conversation
    if (status === 'accepted') {
      // Get the team for the conversation
      const team = await prisma.team.findUnique({
        where: { id: eoi.toId },
        select: { name: true },
      });

      // Create conversation between company user and team
      const conversation = await prisma.conversation.create({
        data: {
          teamId: eoi.toId,
          interestId: eoi.id,
          subject: `Discussion: ${team?.name || 'Team'} - Expression of Interest`,
          status: 'active',
          isAnonymous: false,
        },
      });

      // Add participants
      await prisma.conversationParticipant.createMany({
        data: [
          { conversationId: conversation.id, userId: eoi.fromId, role: 'company' },
          { conversationId: conversation.id, userId: session.user.id, role: 'team' },
        ],
      });

      // Create welcome message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: null,
          senderType: 'team',
          content: `Conversation started following accepted expression of interest. Welcome! Feel free to discuss next steps.`,
          messageType: 'system',
        },
      });

      // Update conversation last message
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date(), messageCount: 1 },
      });
    }

    return NextResponse.json(updatedEoi);
  } catch (error) {
    console.error('Error updating EOI:', error);
    return NextResponse.json({ error: 'Failed to update EOI' }, { status: 500 });
  }
}
