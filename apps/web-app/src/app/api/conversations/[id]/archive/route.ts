import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// NOTE: The ConversationParticipant model doesn't have isArchived/archivedAt fields
// Using the conversation.status field instead to track archived state

// POST - Archive a conversation
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

    // Verify user is participant in this conversation
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

    // Update conversation status to archived
    await prisma.conversation.update({
      where: { id },
      data: {
        status: 'archived',
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

    // Update conversation status back to active
    await prisma.conversation.update({
      where: { id },
      data: {
        status: 'active',
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
