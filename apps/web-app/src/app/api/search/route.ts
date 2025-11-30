import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// GET /api/search - Unified search
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    // Fallback to local search if API server is not available
    return handleLocalSearch(request);
  }

  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const path = searchParams ? `/api/search?${searchParams}` : '/api/search';

    const response = await proxyToApiServer(path, { method: 'GET' }, session);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying search to API server:', error);
    return handleLocalSearch(request);
  }
}

// Local search fallback when API server is unavailable
async function handleLocalSearch(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      data: {
        query,
        total: 0,
        opportunities: [],
        teams: [],
        companies: [],
        suggestions: []
      }
    });
  }

  // Return empty results for local fallback
  // In a production scenario, you'd query the database directly here
  return NextResponse.json({
    success: true,
    data: {
      query,
      total: 0,
      opportunities: [],
      teams: [],
      companies: [],
      suggestions: []
    }
  });
}
