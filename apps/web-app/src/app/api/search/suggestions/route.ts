import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// GET /api/search/suggestions - Get search suggestions/autocomplete
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get('q') || '';

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      data: { suggestions: [] }
    });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    // Return empty suggestions if API server is not available
    return NextResponse.json({
      success: true,
      data: { suggestions: [] }
    });
  }

  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const path = `/api/search/suggestions?${searchParams}`;

    const response = await proxyToApiServer(path, { method: 'GET' }, session);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({
      success: true,
      data: { suggestions: [] }
    });
  }
}
