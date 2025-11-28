import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';
import { getAllMockApplications, createMockApplication, getMockOpportunityById } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiAvailable = await isApiServerAvailable();

    if (apiAvailable) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const response = await fetch(
          `${process.env.API_SERVER_URL || 'http://localhost:8000'}/api/applications${queryString ? `?${queryString}` : ''}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session as any).accessToken}`,
            },
          }
        );

        if (!response.ok) {
          // Fall back to mock data
          return returnMockApplications(request);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error fetching applications from API:', error);
        return returnMockApplications(request);
      }
    }

    // API server not available, use mock data
    return returnMockApplications(request);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

function returnMockApplications(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    status: searchParams.get('status') || undefined,
    opportunityId: searchParams.get('opportunityId') || undefined,
    teamId: searchParams.get('teamId') || undefined,
  };

  const result = getAllMockApplications(filters);

  // Transform mock data to match expected format with proper field names
  const transformedApplications = result.applications.map(app => ({
    id: app.id,
    teamId: app.teamId,
    opportunityId: app.opportunityId,
    submittedById: 'user_demo_001',
    coverLetter: app.coverLetter || null,
    status: app.status === 'pending' ? 'submitted' :
            app.status === 'under_review' ? 'reviewing' :
            app.status === 'interview' ? 'interviewing' :
            app.status,
    submittedAt: app.appliedAt,
    reviewedAt: null,
    reviewedById: null,
    interviewScheduledAt: app.interviewDate || null,
    interviewNotes: app.notes || null,
    internalNotes: null,
    rejectionReason: null,
    createdAt: app.appliedAt,
    updatedAt: app.updatedAt,
    team: {
      id: app.teamId,
      name: app.teamName,
      description: null,
      size: 5,
      isAnonymous: false,
    },
    opportunity: {
      id: app.opportunityId,
      title: app.opportunityTitle,
      company: {
        id: 'company_mock_001',
        name: app.company,
      },
    },
  }));

  return NextResponse.json({
    data: transformedApplications,
    pagination: {
      page: 1,
      limit: 10,
      total: result.total,
      pages: Math.ceil(result.total / 10),
    },
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
        const response = await fetch(
          `${process.env.API_SERVER_URL || 'http://localhost:8000'}/api/applications`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${(session as any).accessToken}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          // Fall back to mock creation
          return createMockApplicationResponse(body);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (error) {
        console.error('Error creating application via API:', error);
        return createMockApplicationResponse(body);
      }
    }

    // API server not available, use mock data
    return createMockApplicationResponse(body);
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

function createMockApplicationResponse(body: any) {
  // Get opportunity details if available
  const opportunity = body.opportunityId ? getMockOpportunityById(body.opportunityId) : null;

  const newApp = createMockApplication({
    opportunityId: body.opportunityId,
    opportunityTitle: opportunity?.title || body.opportunityTitle || 'Unknown Opportunity',
    company: opportunity?.company || body.company || 'Unknown Company',
    teamId: body.teamId || 'team_demo_001',
    teamName: body.teamName || 'TechFlow Data Science Team',
    coverLetter: body.coverLetter,
  });

  return NextResponse.json({
    application: newApp,
    _mock: true,
    message: 'Application submitted successfully (demo mode)'
  }, { status: 201 });
}
