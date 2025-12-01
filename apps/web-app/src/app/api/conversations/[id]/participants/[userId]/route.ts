import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Remove a participant from a conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id, userId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if current user is a participant
    const currentUserParticipant = conversation.participants.find(p => p.userId === session.user.id);
    if (!currentUserParticipant) {
      return NextResponse.json({ error: 'Not authorized to remove participants' }, { status: 403 });
    }

    // Find the participant to remove
    const participantToRemove = conversation.participants.find(p => p.userId === userId);
    if (!participantToRemove) {
      return NextResponse.json({ error: 'User is not a participant in this conversation' }, { status: 404 });
    }

    // Users can only remove themselves, unless they have special permission
    // For now, allow removing yourself or removing others if you're an admin role
    const canRemove = userId === session.user.id || currentUserParticipant.role === 'admin';
    if (!canRemove) {
      return NextResponse.json({ error: 'Not authorized to remove this participant' }, { status: 403 });
    }

    // Don't allow removing the last participant
    if (conversation.participants.length <= 1) {
      return NextResponse.json({ error: 'Cannot remove the last participant' }, { status: 400 });
    }

    // Remove the participant
    await prisma.conversationParticipant.delete({
      where: { id: participantToRemove.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Participant removed successfully',
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    return NextResponse.json(
      { error: 'Failed to remove participant' },
      { status: 500 }
    );
  }
}
