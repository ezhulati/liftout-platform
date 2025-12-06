import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Archive a conversation (per-user archive via ConversationParticipant)
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

    // Find participant record
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

    // Update participant's archive status (per-user archive)
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, archived: true });
  } catch (error) {
    console.error('Archive conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    );
  }
}

// DELETE - Unarchive a conversation
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
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    // Update participant's archive status
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });

    return NextResponse.json({ success: true, archived: false });
  } catch (error) {
    console.error('Unarchive conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to unarchive conversation' },
      { status: 500 }
    );
  }
}

// GET - Check archive status
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

    return NextResponse.json({
      archived: participant.isArchived,
      archivedAt: participant.archivedAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Get archive status error:', error);
    return NextResponse.json(
      { error: 'Failed to get archive status' },
      { status: 500 }
    );
  }
}
