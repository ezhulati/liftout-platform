import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { getMockApplicationById, updateMockApplicationStatus } from '@/lib/mock-data/applications';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/${id}`, {
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
    const application = getMockApplicationById(id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application,
      _mock: true
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.log('API server request failed, falling back to mock data');
      }
    }

    // Fallback - update mock application if status is provided
    if (body.status) {
      const updated = updateMockApplicationStatus(id, body.status, body.notes);
      if (!updated) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        application: updated,
        message: 'Application updated successfully (mock mode)',
        _mock: true
      });
    }

    // For other updates in mock mode, just return success
    const application = getMockApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application,
      message: 'Application updated successfully (mock mode)',
      _mock: true
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
