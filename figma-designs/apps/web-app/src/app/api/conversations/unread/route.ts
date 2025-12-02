import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/conversations/unread - Get total unread message count
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all conversations where user is a participant
    const participations = await prisma.conversationParticipant.findMany({
      where: {
        userId: session.user.id,
        leftAt: null,
      },
      select: {
        conversationId: true,
        lastReadAt: true,
      },
    });

    // Count unread messages across all conversations
    let totalUnread = 0;

    for (const participation of participations) {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: participation.conversationId,
          senderId: { not: session.user.id },
          createdAt: participation.lastReadAt
            ? { gt: participation.lastReadAt }
            : undefined,
        },
      });
      totalUnread += unreadCount;
    }

    return NextResponse.json({
      unreadCount: totalUnread,
      conversationCount: participations.length,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count', details: String(error) },
      { status: 500 }
    );
  }
}
