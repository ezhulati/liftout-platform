import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EntityType } from '@prisma/client';
import { sendNewMessageEmail } from '@/lib/email';

// GET /api/conversations/[id]/messages - Get messages for a conversation
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

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
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
    });

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const transformedMessages = messages.map((m) => ({
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
    }));

    return NextResponse.json({
      data: {
        data: transformedMessages,
        pagination: {
          page,
          limit,
          total: messages.length,
          pages: Math.ceil(messages.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: session.user.id,
        senderType: session.user.userType === 'company' ? EntityType.company : EntityType.team,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update conversation's last message time
    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
      },
      include: {
        participants: {
          where: {
            leftAt: null,
            userId: { not: session.user.id }, // Other participants only
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                settings: true,
              },
            },
          },
        },
      },
    });

    // Send email notifications to other participants (async, don't block response)
    const senderName = `${message.sender?.firstName || 'Someone'}`;
    for (const p of conversation.participants) {
      if (p.user.email) {
        // Check if user has email notifications enabled (default: true)
        const settings = p.user.settings as { emailNotifications?: boolean } | null;
        const emailsEnabled = settings?.emailNotifications !== false;

        if (emailsEnabled) {
          sendNewMessageEmail({
            to: p.user.email,
            recipientName: p.user.firstName || 'there',
            senderName,
            messagePreview: content.trim(),
            conversationId: id,
            conversationSubject: conversation.subject || undefined,
          }).catch((err) => {
            console.error(`Failed to send message notification to ${p.user.email}:`, err);
          });
        }
      }
    }

    return NextResponse.json({
      data: {
        id: message.id,
        conversationId: message.conversationId,
        content: message.content,
        senderId: message.senderId,
        messageType: 'text' as const,
        attachments: [],
        sentAt: message.createdAt.toISOString(),
        editedAt: null,
        deletedAt: null,
        sender: message.sender
          ? {
              id: message.sender.id,
              firstName: message.sender.firstName || '',
              lastName: message.sender.lastName || '',
            }
          : undefined,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: String(error) },
      { status: 500 }
    );
  }
}
