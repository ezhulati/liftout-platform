import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { getMockConversations } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/conversations/unread`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        });

        if (!response.ok) {
          return returnMockUnreadCount(session);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching unread count from API:', error);
        return returnMockUnreadCount(session);
      }
    }

    return returnMockUnreadCount(session);
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}

function returnMockUnreadCount(session: any) {
  const conversations = getMockConversations(session.user.id);
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return NextResponse.json({
    unreadCount,
    _mock: true
  });
}
