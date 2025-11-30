import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { updateMockApplicationStatus, getMockApplicationById } from '@/lib/mock-data/applications';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id?.startsWith('demo-');
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function PATCH(
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
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Demo user handling - simulate success
    if (isDemoUser(session.user.email) || isDemoEntity(id)) {
      console.log(`[Demo] Application ${id} status updated to ${status}`);
      return NextResponse.json({
        application: { id, status, notes, updatedAt: new Date().toISOString() },
        message: `Application status updated to ${status}`,
        _demo: true,
      });
    }

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/${id}/status`, {
          method: 'PATCH',
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

    // Fallback to mock data
    const updated = updateMockApplicationStatus(id, status, notes);

    if (!updated) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application: updated,
      message: `Application status updated to ${status}`,
      _mock: true
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}
