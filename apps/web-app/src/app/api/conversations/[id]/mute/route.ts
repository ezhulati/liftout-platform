import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Update participant's mute status in database
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        isMuted: true,
        mutedUntil,
      },
    });

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

    // Remove mute status in database
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        isMuted: false,
        mutedUntil: null,
      },
    });

    return NextResponse.json({ success: true, muted: false });
  } catch (error) {
    console.error('Unmute conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to unmute conversation' },
      { status: 500 }
    );
  }
}

// GET - Check mute status
export async function GET(
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
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    // Check if mute has expired
    const now = new Date();
    const isCurrentlyMuted = participant.isMuted &&
      (!participant.mutedUntil || participant.mutedUntil > now);

    return NextResponse.json({
      muted: isCurrentlyMuted,
      mutedUntil: participant.mutedUntil?.toISOString() || null,
    });
  } catch (error) {
    console.error('Get mute status error:', error);
    return NextResponse.json(
      { error: 'Failed to get mute status' },
      { status: 500 }
    );
  }
}
