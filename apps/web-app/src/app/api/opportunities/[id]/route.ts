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

// GET /api/opportunities/[id] - Get opportunity details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${params.id}`,
      { method: 'GET' },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform response to match frontend expectations
    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT /api/opportunities/[id] - Update opportunity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      `/api/opportunities/${params.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can delete opportunities' },
      { status: 403 }
    );
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${params.id}`,
      { method: 'DELETE' },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}

// PATCH /api/opportunities/[id] - Update opportunity status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      `/api/opportunities/${params.id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity status' },
      { status: 500 }
    );
  }
}
