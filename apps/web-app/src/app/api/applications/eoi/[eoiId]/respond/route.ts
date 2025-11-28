import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { updateMockEOIStatus, getMockEOIById } from '@/lib/mock-data/eoi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

    const body = await request.json();
    const { status } = body;

    if (!status || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (accepted or declined) is required' },
        { status: 400 }
      );
    }

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(
          `${API_BASE}/api/applications/eoi/${eoiId}/respond`,
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
        console.log('API server request failed, falling back to mock data');
      }
    }

    // Fallback to mock data
    const eoi = getMockEOIById(eoiId);

    if (!eoi) {
      return NextResponse.json(
        { error: 'Expression of interest not found' },
        { status: 404 }
      );
    }

    // Check if already responded
    if (eoi.status !== 'pending') {
      return NextResponse.json(
        { error: `EOI has already been ${eoi.status}` },
        { status: 400 }
      );
    }

    const updated = updateMockEOIStatus(eoiId, status);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update EOI status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      eoi: updated,
      message: `Expression of interest ${status}`,
      _mock: true
    });
  } catch (error) {
    console.error('Error responding to EOI:', error);
    return NextResponse.json(
      { error: 'Failed to respond to expression of interest' },
      { status: 500 }
    );
  }
}
