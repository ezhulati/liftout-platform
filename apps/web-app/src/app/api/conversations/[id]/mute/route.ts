import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// NOTE: ConversationParticipant model doesn't have isMuted/mutedUntil fields yet
// Using in-memory storage for development until migration is run
// TODO: Run prisma db push and switch to Prisma client

// In-memory mute storage: Map<participantId, mutedUntil>
const muteStore = new Map<string, Date | null>();

// POST - Mute a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { duration } = body; // 'forever', '1hour', '8hours', '1day', '1week'

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    let mutedUntil: Date | null = null;
    if (duration !== 'forever') {
      const now = new Date();
      switch (duration) {
        case '1hour':
          mutedUntil = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case '8hours':
          mutedUntil = new Date(now.getTime() + 8 * 60 * 60 * 1000);
          break;
        case '1day':
          mutedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case '1week':
          mutedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // Store mute state in memory
    muteStore.set(participant.id, mutedUntil);

    return NextResponse.json({
      success: true,
      muted: true,
      mutedUntil: mutedUntil?.toISOString() || null,
    });
  } catch (error) {
    console.error('Mute conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to mute conversation' },
      { status: 500 }
    );
  }
}

// DELETE - Unmute a conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    // Remove mute state from memory
    muteStore.delete(participant.id);

    return NextResponse.json({ success: true, muted: false });
  } catch (error) {
    console.error('Unmute conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to unmute conversation' },
      { status: 500 }
    );
  }
}
