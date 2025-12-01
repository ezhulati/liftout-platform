import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations - List user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            leftAt: null,
          },
        },
        status: 'active',
      },
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
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Transform for frontend
    const transformedConversations = conversations.map((conv) => ({
      id: conv.id,
      subject: conv.subject || 'New Conversation',
      participants: conv.participants.map((p) => ({
        id: p.user.id,
        name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.email,
        role: p.role,
      })),
      lastMessage: conv.messages[0] || null,
      lastMessageAt: conv.lastMessageAt?.toISOString(),
      messageCount: conv.messageCount,
      unreadCount: 0, // Would need to calculate based on lastReadAt
      createdAt: conv.createdAt.toISOString(),
      opportunityId: conv.opportunityId,
    }));

    return NextResponse.json({
      conversations: transformedConversations,
      total: transformedConversations.length,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, participantIds, opportunityId, teamId, companyId } = body;

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        subject: subject || 'New Conversation',
        opportunityId,
        teamId,
        companyId,
        participants: {
          create: [
            { userId: session.user.id, role: 'owner' },
            ...(participantIds || []).map((id: string) => ({
              userId: id,
              role: 'participant',
            })),
          ],
        },
      },
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
      },
    });

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        subject: conversation.subject,
        participants: conversation.participants.map((p) => ({
          id: p.user.id,
          name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.email,
          role: p.role,
        })),
        createdAt: conversation.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation', details: String(error) },
      { status: 500 }
    );
  }
}
