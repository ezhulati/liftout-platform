import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Add a participant to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, role = 'member' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Verify the conversation exists and current user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.participants.length === 0) {
      return NextResponse.json({ error: 'Not authorized to add participants' }, { status: 403 });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId,
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ error: 'User is already a participant' }, { status: 400 });
    }

    // Add the new participant
    const participant = await prisma.conversationParticipant.create({
      data: {
        conversationId: id,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profile: {
              select: {
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        conversationId: participant.conversationId,
        userId: participant.userId,
        role: participant.role,
        joinedAt: participant.joinedAt.toISOString(),
        user: {
          id: participant.user.id,
          firstName: participant.user.firstName,
          lastName: participant.user.lastName,
          email: participant.user.email,
          profilePhotoUrl: participant.user.profile?.profilePhotoUrl,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding participant:', error);
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    );
  }
}

// GET - List participants in a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the conversation exists and current user is a participant
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
                profile: {
                  select: {
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if current user is a participant
    const isParticipant = conversation.participants.some(p => p.userId === session.user.id);
    if (!isParticipant) {
      return NextResponse.json({ error: 'Not authorized to view participants' }, { status: 403 });
    }

    return NextResponse.json({
      participants: conversation.participants.map(p => ({
        id: p.id,
        conversationId: p.conversationId,
        userId: p.userId,
        role: p.role,
        joinedAt: p.joinedAt.toISOString(),
        user: {
          id: p.user.id,
          firstName: p.user.firstName,
          lastName: p.user.lastName,
          email: p.user.email,
          profilePhotoUrl: p.user.profile?.profilePhotoUrl,
        },
      })),
    });
  } catch (error) {
    console.error('Error listing participants:', error);
    return NextResponse.json(
      { error: 'Failed to list participants' },
      { status: 500 }
    );
  }
}
