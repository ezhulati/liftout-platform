import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { getMockConversations, createMockConversation } from '@/lib/mock-data';

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
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '20';

        const response = await fetch(
          `${API_BASE}/api/conversations?page=${page}&limit=${limit}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session as any).accessToken}`,
            },
          }
        );

        if (!response.ok) {
          return returnMockConversations(session);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching conversations from API:', error);
        return returnMockConversations(session);
      }
    }

    return returnMockConversations(session);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

function returnMockConversations(session: any) {
  const conversations = getMockConversations(session.user.id);

  return NextResponse.json({
    conversations,
    total: conversations.length,
    _mock: true
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          return createMockConversationResponse(body, session);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error creating conversation via API:', error);
        return createMockConversationResponse(body, session);
      }
    }

    return createMockConversationResponse(body, session);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

function createMockConversationResponse(body: any, session: any) {
  const newConv = createMockConversation({
    title: body.title || `Conversation with ${body.participantName || 'Unknown'}`,
    participants: [
      {
        id: session.user.id,
        name: session.user.name || 'You',
        role: session.user.userType === 'company' ? 'Company Representative' : 'Team Lead'
      },
      ...(body.participants || [])
    ],
    opportunityId: body.opportunityId,
    opportunityTitle: body.opportunityTitle,
  });

  return NextResponse.json({
    conversation: newConv,
    _mock: true,
    message: 'Conversation created successfully (demo mode)'
  }, { status: 201 });
}
