import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

// GET /api/applications - List applications (teamId or opportunityId required)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();
    if (!apiAvailable) {
      return NextResponse.json(
        { error: 'API server unavailable. Please start the API service.' },
        { status: 503 }
      );
    }

    const queryString = request.nextUrl.searchParams.toString();
    const response = await fetch(
      `${API_BASE}/api/applications${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit a new application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Demo user handling - simulate success
    if (isDemoUser(session.user.email)) {
      const body = await request.json();
      const mockApplication = {
        id: `demo-app-${Date.now()}`,
        ...body,
        status: 'submitted',
        appliedBy: session.user.id,
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      console.log('[Demo] Application created:', mockApplication.id);
      return NextResponse.json({ success: true, data: mockApplication }, { status: 201 });
    }

    const apiAvailable = await isApiServerAvailable();
    if (!apiAvailable) {
      return NextResponse.json(
        { error: 'API server unavailable. Please start the API service.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${API_BASE}/api/applications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
