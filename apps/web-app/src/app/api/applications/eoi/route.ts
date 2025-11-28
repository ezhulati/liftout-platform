import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { createMockEOI, getAllMockEOIs } from '@/lib/mock-data';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/eoi`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        });

        if (!response.ok) {
          return returnMockEOIs(request);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching EOIs from API:', error);
        return returnMockEOIs(request);
      }
    }

    return returnMockEOIs(request);
  } catch (error) {
    console.error('Error fetching EOIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expressions of interest' },
      { status: 500 }
    );
  }
}

function returnMockEOIs(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    status: searchParams.get('status') || undefined,
    fromType: searchParams.get('fromType') || undefined,
    toType: searchParams.get('toType') || undefined,
  };

  const result = getAllMockEOIs(filters);

  return NextResponse.json({
    eois: result.eois,
    total: result.total,
    _mock: true
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/eoi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          return createMockEOIResponse(body, session);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error creating EOI via API:', error);
        return createMockEOIResponse(body, session);
      }
    }

    return createMockEOIResponse(body, session);
  } catch (error) {
    console.error('Error creating EOI:', error);
    return NextResponse.json(
      { error: 'Failed to create expression of interest' },
      { status: 500 }
    );
  }
}

function createMockEOIResponse(body: any, session: any) {
  const userType = session.user.userType;

  const newEOI = createMockEOI({
    fromType: userType === 'company' ? 'company' : 'team',
    fromId: userType === 'company' ? 'company_demo' : 'team_demo_001',
    fromName: userType === 'company' ? session.user.companyName || 'Demo Company' : 'TechFlow Data Science Team',
    toType: body.toType || (userType === 'company' ? 'team' : 'company'),
    toId: body.toId || 'unknown',
    toName: body.toName || 'Unknown',
    opportunityId: body.opportunityId,
    opportunityTitle: body.opportunityTitle,
    message: body.message,
  });

  return NextResponse.json({
    eoi: newEOI,
    _mock: true,
    message: 'Expression of interest sent successfully (demo mode)'
  }, { status: 201 });
}
