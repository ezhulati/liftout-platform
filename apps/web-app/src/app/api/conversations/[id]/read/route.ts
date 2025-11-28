import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { markMessagesAsRead, getMockConversationById } from '@/lib/mock-data/conversations';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/conversations/${id}/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.log('API server request failed, falling back to mock data');
      }
    }

    // Fallback to mock data
    const conversation = getMockConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Mark messages as read for the current user
    markMessagesAsRead(id, (session.user as any).id || '1');

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read',
      _mock: true
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
