import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';
import { getMockOpportunityById } from '@/lib/mock-data';

// GET /api/opportunities/[id] - Get opportunity details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if API server is available
  const apiAvailable = await isApiServerAvailable();

  if (apiAvailable) {
    try {
      const response = await proxyToApiServer(
        `/api/opportunities/${id}`,
        { method: 'GET' },
        session
      );

      const data = await response.json();

      if (!response.ok) {
        // Fall back to mock data
        const mockOpp = getMockOpportunityById(id);
        if (mockOpp) {
          return NextResponse.json({ opportunity: mockOpp, _mock: true });
        }
        return NextResponse.json(data, { status: response.status });
      }

      // Transform response to match frontend expectations
      if (data.success && data.data) {
        return NextResponse.json({ opportunity: data.data });
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      // Fall back to mock data
      const mockOpp = getMockOpportunityById(id);
      if (mockOpp) {
        return NextResponse.json({ opportunity: mockOpp, _mock: true });
      }
      return NextResponse.json(
        { error: 'Failed to fetch opportunity' },
        { status: 500 }
      );
    }
  }

  // API server not available, use mock data
  const mockOpp = getMockOpportunityById(id);
  if (mockOpp) {
    return NextResponse.json({ opportunity: mockOpp, _mock: true });
  }
  return NextResponse.json(
    { error: 'Opportunity not found' },
    { status: 404 }
  );
}

// PUT /api/opportunities/[id] - Update opportunity
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

  try {
    const body = await request.json();

    const apiAvailable = await isApiServerAvailable();
    if (!apiAvailable) {
      // For mock mode, just return success with the updated data
      return NextResponse.json({
        opportunity: { id, ...body },
        _mock: true,
        message: 'Update simulated (mock mode)'
      });
    }

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

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json({
      success: true,
      message: 'Delete simulated (mock mode)',
      _mock: true
    });
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

  try {
    const body = await request.json();

    const apiAvailable = await isApiServerAvailable();
    if (!apiAvailable) {
      return NextResponse.json({
        opportunity: { id, status: body.status },
        _mock: true,
        message: 'Status update simulated (mock mode)'
      });
    }

    const response = await proxyToApiServer(
      `/api/opportunities/${id}/status`,
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
