import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id?.startsWith('demo-');
};

// GET /api/opportunities/[id] - Get opportunity details (API only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
      { method: 'GET' },
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
    console.error('Error fetching opportunity from API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT /api/opportunities/[id] - Update opportunity (company only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    const body = await request.json();
    console.log(`[Demo] Opportunity ${id} updated`);
    return NextResponse.json({ opportunity: { id, ...body, updatedAt: new Date().toISOString() } });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
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
    console.error('Error updating opportunity via API:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity (company only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can delete opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    console.log(`[Demo] Opportunity ${id} deleted`);
    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
      { method: 'DELETE' },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Error deleting opportunity via API:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}

// PATCH /api/opportunities/[id] - Update opportunity status (company only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    const body = await request.json();
    console.log(`[Demo] Opportunity ${id} status updated`);
    return NextResponse.json({ opportunity: { id, ...body, updatedAt: new Date().toISOString() } });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
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
    console.error('Error updating opportunity status via API:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity status' },
      { status: 500 }
    );
  }
}
