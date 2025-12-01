import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Demo opportunity data for demo users
const DEMO_OPPORTUNITIES: Record<string, any> = {
  'opp-demo-1': {
    id: 'opp-demo-1',
    title: 'Lead FinTech Analytics Division',
    description: 'Strategic opportunity to lead our new FinTech analytics division. Looking for an intact team with strong quantitative skills and financial services experience.\n\nWe are seeking a high-performing team to drive our analytics capabilities in the rapidly evolving FinTech space. The ideal team will have deep expertise in quantitative analysis, machine learning, and financial modeling.',
    company: 'NextGen Financial',
    companyData: {
      id: 'company-demo-1',
      name: 'NextGen Financial',
      industry: 'Financial Services',
      description: 'Leading financial services company focused on innovation and technology-driven solutions.',
    },
    location: 'New York, NY',
    remote: false,
    industry: 'Financial Services',
    type: 'expansion',
    teamSize: 5,
    compensation: {
      type: 'salary',
      range: '$180k - $250k',
      equity: true,
      benefits: 'Full benefits, 401k match, equity package, flexible PTO',
    },
    requirements: [
      'Team of 3-8 members with at least 2 years working together',
      'Strong background in quantitative analysis and financial modeling',
      'Experience with Python, machine learning, and data science tools',
      'Prior experience in financial services or FinTech',
      'Track record of delivering high-impact projects',
    ],
    responsibilities: [
      'Lead and grow the FinTech analytics division',
      'Develop predictive models for risk assessment and market analysis',
      'Collaborate with product and engineering teams',
      'Drive innovation in analytics capabilities',
      'Mentor and develop junior team members',
    ],
    strategicRationale: 'NextGen Financial is expanding into AI-driven analytics to maintain our competitive edge. We need a proven team that can hit the ground running and accelerate our roadmap by 12-18 months.',
    integrationPlan: 'The team will operate as a semi-autonomous unit with direct CEO reporting. Full onboarding support, dedicated resources, and clear success metrics within the first 90 days.',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 5,
    views: 142,
    isConfidential: false,
  },
  'opp-demo-2': {
    id: 'opp-demo-2',
    title: 'Healthcare AI Team Lead',
    description: 'Build and lead our healthcare AI initiative. Looking for a team with ML expertise and healthcare domain knowledge.\n\nMedTech Innovations is seeking a world-class team to drive our healthcare AI strategy. You will have the opportunity to work on cutting-edge medical imaging and diagnostic tools.',
    company: 'MedTech Innovations',
    companyData: {
      id: 'company-demo-2',
      name: 'MedTech Innovations',
      industry: 'Healthcare Technology',
      description: 'Pioneering healthcare technology company transforming patient care through AI.',
    },
    location: 'Boston, MA',
    remote: true,
    industry: 'Healthcare Technology',
    type: 'capability',
    teamSize: 6,
    compensation: {
      type: 'total_package',
      range: '$200k - $300k',
      equity: true,
      benefits: 'Comprehensive health coverage, stock options, unlimited PTO, remote-first',
    },
    requirements: [
      'Team of 4-10 members with healthcare or biotech experience',
      'Deep expertise in machine learning and computer vision',
      'Experience with medical imaging analysis or diagnostics',
      'FDA regulatory experience preferred',
      'Published research or patents in healthcare AI',
    ],
    responsibilities: [
      'Lead healthcare AI product development',
      'Build and scale ML infrastructure for medical imaging',
      'Navigate FDA approval processes',
      'Collaborate with clinical partners and researchers',
      'Drive product roadmap and technical strategy',
    ],
    strategicRationale: 'MedTech Innovations is entering the AI diagnostics market. We need an experienced team to help us navigate regulatory requirements and build world-class products.',
    integrationPlan: 'Fully remote team with quarterly in-person gatherings. Direct access to executive leadership and board. Clear path to equity participation and leadership roles.',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 8,
    views: 234,
    isConfidential: false,
  },
  'opp-demo-3': {
    id: 'opp-demo-3',
    title: 'Enterprise Platform Engineering',
    description: 'Join our platform team to build next-generation infrastructure. Full team acquisition opportunity.\n\nCloudScale Systems is looking for a proven engineering team to accelerate our platform capabilities. You will have ownership of critical infrastructure serving millions of users.',
    company: 'CloudScale Systems',
    companyData: {
      id: 'company-demo-3',
      name: 'CloudScale Systems',
      industry: 'Technology',
      description: 'Fast-growing cloud infrastructure company backed by top-tier VCs.',
    },
    location: 'San Francisco, CA',
    remote: false,
    industry: 'Technology',
    type: 'acquisition',
    teamSize: 4,
    compensation: {
      type: 'equity',
      range: '$170k - $230k',
      equity: true,
      benefits: 'Premium health insurance, generous equity, 401k, catered meals',
    },
    requirements: [
      'Team of 3-6 members with platform engineering experience',
      'Strong Kubernetes, AWS, and infrastructure automation skills',
      'Experience with Go, Python, or Rust',
      'Track record of building scalable systems',
      'DevOps and SRE practices experience',
    ],
    responsibilities: [
      'Design and build next-gen cloud infrastructure',
      'Lead platform engineering initiatives',
      'Improve system reliability and performance',
      'Mentor and grow engineering teams',
      'Drive technical decisions and architecture',
    ],
    strategicRationale: 'CloudScale is preparing for IPO and needs to rapidly scale our platform capabilities. An experienced team can help us achieve our ambitious growth targets.',
    integrationPlan: 'Team will own a critical platform domain with full autonomy. Fast-track to senior leadership positions with significant equity upside.',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 12,
    views: 189,
    isConfidential: false,
  },
};

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

// Map database status to frontend status
function mapStatus(dbStatus: string): 'open' | 'in_review' | 'closed' {
  switch (dbStatus) {
    case 'active':
      return 'open';
    case 'paused':
      return 'in_review';
    case 'filled':
    case 'expired':
      return 'closed';
    default:
      return 'open';
  }
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

  // Check for demo opportunity IDs
  if (id.startsWith('opp-demo-')) {
    const demoOpportunity = DEMO_OPPORTUNITIES[id];
    if (demoOpportunity) {
      return NextResponse.json({ opportunity: demoOpportunity });
    }
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
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
      status: mapStatus(opportunity.status),
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
