import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { scheduleMockInterview, getMockApplicationById } from '@/lib/mock-data/applications';

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

    const body = await request.json();
    const { interviewDate, notes } = body;

    if (!interviewDate) {
      return NextResponse.json(
        { error: 'Interview date is required' },
        { status: 400 }
      );
    }

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/${id}/interview`, {
          method: 'POST',
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
    const application = getMockApplicationById(id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const updated = scheduleMockInterview(id, interviewDate, notes);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to schedule interview' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      application: updated,
      message: 'Interview scheduled successfully',
      _mock: true
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Failed to schedule interview' },
      { status: 500 }
    );
  }
}
