import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// GET /api/opportunities - List opportunities (API only)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const path = searchParams ? `/api/opportunities?${searchParams}` : '/api/opportunities';

    const response = await proxyToApiServer(path, { method: 'GET' }, session);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      const transformedOpportunities = (data.data.opportunities || []).map((opp: any) => ({
        ...opp,
        company: typeof opp.company === 'object' && opp.company !== null ? opp.company.name : opp.company,
        companyData: typeof opp.company === 'object' ? opp.company : undefined,
      }));

      return NextResponse.json({
        opportunities: transformedOpportunities,
        total: data.data.pagination?.total || 0,
        pagination: data.data.pagination,
        filters: {
          industries: [],
          locations: [],
          types: [],
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying opportunities to API server:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities from API' },
      { status: 500 }
    );
  }
}

// POST /api/opportunities - Create opportunity (company users only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can create opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email)) {
    const body = await request.json();
    const mockOpportunity = {
      id: `demo-opp-${Date.now()}`,
      ...body,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      applications: [],
    };
    console.log('[Demo] Opportunity created:', mockOpportunity.id);
    return NextResponse.json({ opportunity: mockOpportunity }, { status: 201 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const response = await proxyToApiServer(
      '/api/opportunities',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data }, { status: 201 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating opportunity via API:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
