import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to format compensation range
function formatCompensation(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Competitive';
  if (min && max) {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  }
  if (min) return `$${(min / 1000).toFixed(0)}k+`;
  if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
  return 'Competitive';
}

// Helper to format team size
function formatTeamSize(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Flexible';
  if (min && max) return `${min}-${max} members`;
  if (min) return `${min}+ members`;
  if (max) return `Up to ${max} members`;
  return 'Flexible';
}

// GET /api/opportunities/[id] - Get opportunity details from database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            companySize: true,
            description: true,
            websiteUrl: true,
            headquartersLocation: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Parse JSON fields safely
    let requiredSkills: string[] = [];
    let preferredSkills: string[] = [];
    let benefits: string[] = [];

    try {
      requiredSkills = opportunity.requiredSkills ? JSON.parse(opportunity.requiredSkills as string) : [];
    } catch {
      requiredSkills = [];
    }

    try {
      preferredSkills = opportunity.preferredSkills ? JSON.parse(opportunity.preferredSkills as string) : [];
    } catch {
      preferredSkills = [];
    }

    try {
      benefits = opportunity.benefits ? JSON.parse(opportunity.benefits as string) : [];
    } catch {
      benefits = [];
    }

    // Transform for frontend
    const transformedOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      description: opportunity.description,
      company: opportunity.company?.name || 'Unknown Company',
      companyData: opportunity.company,
      companyLogo: null,
      location: opportunity.location || 'Remote',
      remote: opportunity.remotePolicy === 'remote',
      industry: opportunity.industry,
      type: opportunity.department || 'Strategic Expansion',
      teamSize: formatTeamSize(opportunity.teamSizeMin, opportunity.teamSizeMax),
      teamSizeMin: opportunity.teamSizeMin,
      teamSizeMax: opportunity.teamSizeMax,
      compensation: {
        type: 'salary',
        range: formatCompensation(opportunity.compensationMin, opportunity.compensationMax),
        equity: opportunity.equityOffered,
        equityRange: opportunity.equityRange,
        benefits: benefits.join(', ') || 'Competitive benefits package',
      },
      requirements: requiredSkills,
      preferredSkills,
      benefits,
      responsibilities: [
        'Lead team initiatives and drive project success',
        'Collaborate with cross-functional teams',
        'Contribute to strategic planning and execution',
        'Mentor and develop team capabilities',
      ],
      strategicRationale: `This opportunity is part of ${opportunity.company?.name || 'our'}'s strategic growth initiative. We're seeking a proven team that can accelerate our objectives and deliver immediate impact.`,
      integrationPlan: 'The team will be integrated with full onboarding support, direct leadership access, and autonomy to drive results within the first 90 days.',
      deadline: opportunity.urgency === 'urgent'
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        : opportunity.urgency === 'high'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: opportunity.status,
      urgent: opportunity.urgency === 'urgent' || opportunity.urgency === 'high',
      postedAt: opportunity.createdAt.toISOString(),
      createdAt: opportunity.createdAt.toISOString(),
      updatedAt: opportunity.updatedAt.toISOString(),
      applicants: opportunity._count.applications,
      views: Math.floor(Math.random() * 100) + 50,
      isConfidential: opportunity.visibility === 'private',
    };

    return NextResponse.json({ opportunity: transformedOpportunity });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity', details: String(error) },
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

  try {
    const body = await request.json();

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        teamSizeMin: body.teamSizeMin,
        teamSizeMax: body.teamSizeMax,
        requiredSkills: body.requiredSkills ? JSON.stringify(body.requiredSkills) : undefined,
        preferredSkills: body.preferredSkills ? JSON.stringify(body.preferredSkills) : undefined,
        industry: body.industry,
        department: body.department,
        seniorityLevel: body.seniorityLevel,
        location: body.location,
        remotePolicy: body.remotePolicy,
        compensationMin: body.compensationMin,
        compensationMax: body.compensationMax,
        equityOffered: body.equityOffered,
        equityRange: body.equityRange,
        benefits: body.benefits ? JSON.stringify(body.benefits) : undefined,
        urgency: body.urgency,
        status: body.status,
        visibility: body.visibility,
      },
    });

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity', details: String(error) },
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

  try {
    await prisma.opportunity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity', details: String(error) },
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

  try {
    const body = await request.json();

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity status', details: String(error) },
      { status: 500 }
    );
  }
}
