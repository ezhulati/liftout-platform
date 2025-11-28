import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { getMockMessages, addMockMessage } from '@/lib/mock-data';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '50';

        const response = await fetch(
          `${API_BASE}/api/conversations/${id}/messages?page=${page}&limit=${limit}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session as any).accessToken}`,
            },
          }
        );

        if (!response.ok) {
          return returnMockMessages(id);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching messages from API:', error);
        return returnMockMessages(id);
      }
    }

    return returnMockMessages(id);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

function returnMockMessages(conversationId: string) {
  const messages = getMockMessages(conversationId);

  return NextResponse.json({
    messages,
    total: messages.length,
    _mock: true
  });
}

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

    const body = await request.json();
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/conversations/${id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          return createMockMessageResponse(id, body, session);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error sending message via API:', error);
        return createMockMessageResponse(id, body, session);
      }
    }

    return createMockMessageResponse(id, body, session);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

function createMockMessageResponse(conversationId: string, body: any, session: any) {
  const newMessage = addMockMessage({
    conversationId,
    senderId: session.user.id,
    senderName: session.user.name || 'You',
    content: body.content || ''
  });

  if (!newMessage) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: newMessage,
    _mock: true
  }, { status: 201 });
}
