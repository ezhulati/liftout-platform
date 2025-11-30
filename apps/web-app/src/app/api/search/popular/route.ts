import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// GET /api/search/popular - Get popular/trending searches
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    // Return default popular searches if API server is not available
    return NextResponse.json({
      success: true,
      data: {
        popular: [
          'Software Engineering',
          'Data Science',
          'Product Management',
          'Design',
          'Remote',
          'Healthcare',
          'FinTech',
          'AI/ML'
        ]
      }
    });
  }

  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const path = searchParams ? `/api/search/popular?${searchParams}` : '/api/search/popular';

    const response = await proxyToApiServer(path, { method: 'GET' }, session);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return NextResponse.json({
      success: true,
      data: {
        popular: [
          'Software Engineering',
          'Data Science',
          'Product Management',
          'Design'
        ]
      }
    });
  }
}
