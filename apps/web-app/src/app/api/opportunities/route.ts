import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

/**
 * Helper to get authorization header for API server requests
 */
async function getAuthHeaders(session: any): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // If session has an access token, use it
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

/**
 * Helper to proxy requests to the API server
 */
async function proxyToApiServer(
  path: string,
  options: RequestInit,
  session: any
): Promise<Response> {
  const headers = await getAuthHeaders(session);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  return response;
}

// GET /api/opportunities - List opportunities
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Forward query parameters to API server
    const searchParams = request.nextUrl.searchParams.toString();
    const path = searchParams ? `/api/opportunities?${searchParams}` : '/api/opportunities';

    const response = await proxyToApiServer(path, { method: 'GET' }, session);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform response to match existing frontend expectations if needed
    // The API server returns { success: true, data: { opportunities, pagination } }
    // The frontend expects { opportunities, total, filters }
    if (data.success && data.data) {
      return NextResponse.json({
        opportunities: data.data.opportunities || [],
        total: data.data.pagination?.total || 0,
        pagination: data.data.pagination,
        filters: {
          industries: [],
          locations: [],
          types: []
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to API server:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

// POST /api/opportunities - Create opportunity
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only company users can create opportunities
  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can create opportunities' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      '/api/opportunities',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform response to match existing frontend expectations
    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data }, { status: 201 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
