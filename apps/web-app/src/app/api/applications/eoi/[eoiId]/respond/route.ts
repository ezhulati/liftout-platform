import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eoiId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { eoiId } = await params;

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

    const body = await request.json();

    const response = await fetch(`${API_BASE}/api/interests/${eoiId}/respond`, {
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
    console.error('Error responding to EOI:', error);
    return NextResponse.json(
      { error: 'Failed to respond to expression of interest' },
      { status: 500 }
    );
  }
}
