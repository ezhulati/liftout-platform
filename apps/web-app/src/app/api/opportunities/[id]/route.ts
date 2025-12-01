import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isApiServerAvailable, proxyToApiServer } from '@/lib/api-helpers';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id?.startsWith('demo-');
};

// Demo opportunity data for matching page
const getDemoOpportunity = (id: string) => {
  const demoOpportunities: Record<string, object> = {
    'demo-opp-1': {
      id: 'demo-opp-1',
      title: 'Senior Engineering Team - FinTech Expansion',
      company: 'TechCorp Inc.',
      companyLogo: null,
      description: 'Growing fintech startup seeking experienced engineering team to lead our next phase of growth. We are looking for a cohesive team that can hit the ground running and help us build scalable financial products.',
      teamSize: 5,
      location: 'San Francisco, CA',
      remote: true,
      industry: 'Financial Technology',
      type: 'expansion',
      compensation: {
        type: 'salary',
        range: '$180k - $250k',
        equity: true,
        benefits: 'Full benefits, 401k matching',
      },
      requirements: [
        'Team of 3-6 members with proven track record',
        '5+ years of collective experience in fintech or financial services',
        'Strong expertise in TypeScript, React, and Node.js',
        'Experience with AWS or cloud infrastructure',
        'History of working together for at least 2 years',
      ],
      responsibilities: [
        'Lead development of core payment processing platform',
        'Architect and implement scalable microservices',
        'Mentor junior developers and establish best practices',
        'Collaborate with product team on feature roadmap',
        'Drive technical decisions and code quality standards',
      ],
      strategicRationale: 'This acquisition is part of our strategic expansion into the B2B payments space. We need a proven team that can accelerate our time-to-market by 12-18 months compared to building a team from scratch.',
      integrationPlan: 'The team will operate semi-autonomously within our engineering org, with direct reporting to the VP of Engineering. Full onboarding and integration support will be provided during the first 90 days.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 5,
      views: 127,
      isConfidential: false,
    },
  };

  return demoOpportunities[id] || null;
};

// GET /api/opportunities/[id] - Get opportunity details (API only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo entity handling - return mock data for demo opportunity IDs
  if (isDemoEntity(id)) {
    const demoOpportunity = getDemoOpportunity(id);
    if (demoOpportunity) {
      console.log(`[Demo] Returning demo opportunity: ${id}`);
      return NextResponse.json({ opportunity: demoOpportunity });
    }
    // If demo ID not found, return not found
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
      { method: 'GET' },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching opportunity from API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT /api/opportunities/[id] - Update opportunity (company only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    const body = await request.json();
    console.log(`[Demo] Opportunity ${id} updated`);
    return NextResponse.json({ opportunity: { id, ...body, updatedAt: new Date().toISOString() } });
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
      `/api/opportunities/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating opportunity via API:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity (company only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can delete opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    console.log(`[Demo] Opportunity ${id} deleted`);
    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  }

  const apiAvailable = await isApiServerAvailable();
  if (!apiAvailable) {
    return NextResponse.json(
      { error: 'API server unavailable. Please start the API service.' },
      { status: 503 }
    );
  }

  try {
    const response = await proxyToApiServer(
      `/api/opportunities/${id}`,
      { method: 'DELETE' },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Error deleting opportunity via API:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}

// PATCH /api/opportunities/[id] - Update opportunity status (company only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.userType !== 'company') {
    return NextResponse.json(
      { error: 'Only company users can update opportunities' },
      { status: 403 }
    );
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email) || isDemoEntity(id)) {
    const body = await request.json();
    console.log(`[Demo] Opportunity ${id} status updated`);
    return NextResponse.json({ opportunity: { id, ...body, updatedAt: new Date().toISOString() } });
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
      `/api/opportunities/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      session
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    if (data.success && data.data) {
      return NextResponse.json({ opportunity: data.data });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating opportunity status via API:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity status' },
      { status: 500 }
    );
  }
}
