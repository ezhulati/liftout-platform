import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations/[id] - Get conversation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      data: {
        id: conversation.id,
        teamId: conversation.teamId,
        companyId: conversation.companyId,
        opportunityId: conversation.opportunityId,
        subject: conversation.subject || 'Conversation',
        status: conversation.status,
        isAnonymous: conversation.isAnonymous,
        lastMessageAt: conversation.lastMessageAt?.toISOString(),
        messageCount: conversation.messageCount,
        unreadCounts: {},
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        participants: conversation.participants.map((p) => ({
          id: p.id,
          userId: p.userId,
          role: p.role,
          joinedAt: p.joinedAt.toISOString(),
          leftAt: p.leftAt?.toISOString() || null,
          lastReadAt: p.lastReadAt?.toISOString() || null,
          user: {
            id: p.user.id,
            firstName: p.user.firstName || '',
            lastName: p.user.lastName || '',
          },
        })),
        messages: conversation.messages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          content: m.content,
          senderId: m.senderId,
          messageType: 'text' as const,
          attachments: [],
          sentAt: m.createdAt.toISOString(),
          editedAt: null,
          deletedAt: null,
          sender: m.sender
            ? {
                id: m.sender.id,
                firstName: m.sender.firstName || '',
                lastName: m.sender.lastName || '',
              }
            : undefined,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Leave/archive conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark user as left the conversation
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: id,
        userId: session.user.id,
      },
      data: {
        leftAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Left conversation' });
  } catch (error) {
    console.error('Error leaving conversation:', error);
    return NextResponse.json(
      { error: 'Failed to leave conversation', details: String(error) },
      { status: 500 }
    );
  }
}
