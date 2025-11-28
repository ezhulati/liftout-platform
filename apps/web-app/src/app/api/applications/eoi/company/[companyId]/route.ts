import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    await params; // companyId kept for compatibility; API filters by user context

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

    const response = await fetch(`${API_BASE}/api/interests?type=received`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching company EOIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expressions of interest' },
      { status: 500 }
    );
  }
}
