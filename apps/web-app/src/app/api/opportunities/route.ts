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

// GET /api/opportunities - List opportunities from database
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const location = searchParams.get('location') || '';
    const status = searchParams.get('status') || 'active';

    // Build where clause
    const where: any = {};

    // For team users, only show active public opportunities
    if (session.user.userType === 'individual') {
      where.status = 'active';
      where.visibility = 'public';
    } else if (session.user.userType === 'company') {
      // Company users see their own opportunities
      // For now, show all opportunities to company users
      if (status && status !== 'all') {
        where.status = status;
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Industry filter
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }

    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            companySize: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform opportunities for frontend
    const transformedOpportunities = opportunities.map((opp) => {
      // Parse JSON fields safely
      let requiredSkills: string[] = [];
      let benefits: string[] = [];

      try {
        requiredSkills = opp.requiredSkills ? JSON.parse(opp.requiredSkills as string) : [];
      } catch {
        requiredSkills = [];
      }

      try {
        benefits = opp.benefits ? JSON.parse(opp.benefits as string) : [];
      } catch {
        benefits = [];
      }

      return {
        id: opp.id,
        title: opp.title,
        description: opp.description,
        company: opp.company?.name || 'Unknown Company',
        companyData: opp.company,
        location: opp.location || 'Remote',
        compensation: formatCompensation(opp.compensationMin, opp.compensationMax),
        teamSize: formatTeamSize(opp.teamSizeMin, opp.teamSizeMax),
        timeline: opp.urgency === 'urgent' ? 'Immediate' : opp.urgency === 'high' ? '1-2 months' : '3-6 months',
        status: opp.status,
        urgent: opp.urgency === 'urgent' || opp.urgency === 'high',
        confidential: opp.visibility === 'private',
        requirements: requiredSkills,
        benefits,
        type: opp.department || 'Strategic Expansion',
        industry: opp.industry,
        createdAt: opp.createdAt.toISOString(),
        updatedAt: opp.updatedAt.toISOString(),
        applications: { length: opp._count.applications },
      };
    });

    // Get unique values for filters
    const allOpportunities = await prisma.opportunity.findMany({
      select: {
        industry: true,
        location: true,
        department: true,
      },
      distinct: ['industry', 'location', 'department'],
    });

    const industries = [...new Set(allOpportunities.map(o => o.industry).filter(Boolean))] as string[];
    const locations = [...new Set(allOpportunities.map(o => o.location).filter(Boolean))] as string[];
    const types = [...new Set(allOpportunities.map(o => o.department).filter(Boolean))] as string[];

    return NextResponse.json({
      opportunities: transformedOpportunities,
      total: transformedOpportunities.length,
      filters: {
        industries,
        locations,
        types,
      },
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities', details: String(error) },
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

  try {
    const body = await request.json();

    // Get company for this user
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!companyUser) {
      return NextResponse.json(
        { error: 'You must be associated with a company to create opportunities' },
        { status: 403 }
      );
    }

    // Create opportunity in database
    const opportunity = await prisma.opportunity.create({
      data: {
        companyId: companyUser.companyId,
        createdBy: session.user.id,
        title: body.title,
        description: body.description,
        teamSizeMin: body.teamSizeMin || undefined,
        teamSizeMax: body.teamSizeMax || undefined,
        requiredSkills: body.requiredSkills ? JSON.stringify(body.requiredSkills) : undefined,
        preferredSkills: body.preferredSkills ? JSON.stringify(body.preferredSkills) : undefined,
        industry: body.industry || undefined,
        department: body.department || undefined,
        seniorityLevel: body.seniorityLevel || 'senior',
        location: body.location || undefined,
        remotePolicy: body.remotePolicy || 'hybrid',
        compensationMin: body.compensationMin || undefined,
        compensationMax: body.compensationMax || undefined,
        equityOffered: body.equityOffered || false,
        equityRange: body.equityRange || undefined,
        benefits: body.benefits ? JSON.stringify(body.benefits) : undefined,
        urgency: body.urgency || 'standard',
        contractType: body.contractType || 'full_time',
        status: 'active',
        visibility: body.visibility || 'public',
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity', details: String(error) },
      { status: 500 }
    );
  }
}
