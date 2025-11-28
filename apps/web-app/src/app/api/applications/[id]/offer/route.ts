import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { makeMockOffer, getMockApplicationById } from '@/lib/mock-data/applications';

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

    // Only company users can make offers
    if (session.user.userType !== 'company') {
      return NextResponse.json(
        { error: 'Only company users can make offers' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/${id}/offer`, {
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

    const updated = makeMockOffer(id, {
      compensation: body.compensation,
      startDate: body.startDate,
      terms: body.terms,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to make offer' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      application: updated,
      message: 'Offer extended successfully',
      _mock: true
    });
  } catch (error) {
    console.error('Error making offer:', error);
    return NextResponse.json(
      { error: 'Failed to make offer' },
      { status: 500 }
    );
  }
}
