import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EntityType } from '@prisma/client';

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

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: m.sender
          ? `${m.sender.firstName || ''} ${m.sender.lastName || ''}`.trim()
          : 'Unknown',
        createdAt: m.createdAt.toISOString(),
        isRead: m.isRead,
      })),
      total: messages.length,
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
    await prisma.conversation.update({
      where: { id },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender
          ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
          : 'Unknown',
        createdAt: message.createdAt.toISOString(),
        isRead: message.isRead,
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
