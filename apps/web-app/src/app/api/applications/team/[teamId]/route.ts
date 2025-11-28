import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable } from '@/lib/api-helpers';
import { getMockApplicationsByTeam } from '@/lib/mock-data';

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { teamId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const response = await fetch(`${API_BASE}/api/applications/team/${teamId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        });

        if (!response.ok) {
          // Fall back to mock data
          return returnMockTeamApplications(teamId);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching team applications from API:', error);
        return returnMockTeamApplications(teamId);
      }
    }

    // API server not available, use mock data
    return returnMockTeamApplications(teamId);
  } catch (error) {
    console.error('Error fetching team applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team applications' },
      { status: 500 }
    );
  }
}

function returnMockTeamApplications(teamId: string) {
  const applications = getMockApplicationsByTeam(teamId);

  return NextResponse.json({
    applications,
    total: applications.length,
    _mock: true
  });
}
