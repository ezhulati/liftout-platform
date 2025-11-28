import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';
import { getMockOpportunities, createMockOpportunity } from '@/lib/mock-data';

// GET /api/opportunities - List opportunities
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if API server is available
  const apiAvailable = await isApiServerAvailable();

  if (apiAvailable) {
    try {
      // Forward query parameters to API server
      const searchParams = request.nextUrl.searchParams.toString();
      const path = searchParams ? `/api/opportunities?${searchParams}` : '/api/opportunities';

      const response = await proxyToApiServer(path, { method: 'GET' }, session);
      const data = await response.json();

      if (!response.ok) {
        // Fall back to mock data on error
        console.warn('API server returned error, falling back to mock data');
        return returnMockOpportunities(request);
      }

      // Transform response to match existing frontend expectations if needed
      // The API server returns { success: true, data: { opportunities, pagination } }
      // The frontend expects { opportunities, total, filters }
      if (data.success && data.data) {
        return NextResponse.json({
          opportunities: data.data.opportunities || [],
          total: data.data.pagination?.total || 0,
          pagination: data.data.pagination,
          filters: {
            industries: [],
            locations: [],
            types: []
          }
        });
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('Error proxying to API server:', error);
      // Fall back to mock data
      return returnMockOpportunities(request);
    }
  }

  // API server not available, use mock data
  return returnMockOpportunities(request);
}

// Helper to return mock opportunities
function returnMockOpportunities(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get('search') || undefined,
    industry: searchParams.get('industry') || undefined,
    location: searchParams.get('location') || undefined,
    type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    minTeamSize: searchParams.get('minTeamSize') ? parseInt(searchParams.get('minTeamSize')!) : undefined,
    maxTeamSize: searchParams.get('maxTeamSize') ? parseInt(searchParams.get('maxTeamSize')!) : undefined,
  };

  const result = getMockOpportunities(filters);

  return NextResponse.json({
    opportunities: result.opportunities,
    total: result.total,
    filters: {
      industries: ['Financial Services', 'Healthcare Technology', 'Enterprise Software', 'Developer Tools', 'Private Equity'],
      locations: ['New York, NY', 'Boston, MA', 'London, UK', 'San Francisco, CA', 'Chicago, IL'],
      types: ['expansion', 'capability', 'market_entry', 'acquisition']
    },
    _mock: true // Indicate this is mock data
  });
}

// POST /api/opportunities - Create opportunity
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only company users can create opportunities
  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can create opportunities' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Check if API server is available
    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
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
          // Fall back to mock creation on error
          console.warn('API server returned error, falling back to mock creation');
          const mockOpp = createMockOpportunity(body);
          return NextResponse.json({ opportunity: mockOpp, _mock: true }, { status: 201 });
        }

        // Transform response to match existing frontend expectations
        if (data.success && data.data) {
          return NextResponse.json({ opportunity: data.data }, { status: 201 });
        }

        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error proxying to API server:', error);
        // Fall back to mock creation
        const mockOpp = createMockOpportunity(body);
        return NextResponse.json({ opportunity: mockOpp, _mock: true }, { status: 201 });
      }
    }

    // API server not available, use mock data
    const mockOpp = createMockOpportunity(body);
    return NextResponse.json({ opportunity: mockOpp, _mock: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
