import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpportunityStatus, TeamVisibility } from '@prisma/client';

// Helper to check if user is from a verified company
async function isVerifiedCompanyUser(userId: string): Promise<boolean> {
  const companyUser = await prisma.companyUser.findFirst({
    where: { userId },
    include: {
      company: {
        select: { verificationStatus: true },
      },
    },
  });
  return companyUser?.company?.verificationStatus === 'verified';
}

// Helper to anonymize team data for anonymous visibility mode
function anonymizeTeam(team: any): any {
  return {
    ...team,
    name: `Anonymous Team #${team.id.slice(-6).toUpperCase()}`,
    description: team.description ? 'Team description hidden in anonymous mode' : null,
    // Keep industry and size visible for matching purposes
  };
}

// Helper to map database status to frontend status
function mapOpportunityStatus(dbStatus: string): 'open' | 'in_review' | 'closed' {
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

// GET /api/search - Unified search
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type'); // 'opportunities', 'teams', 'companies', or null for all
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          query,
          total: 0,
          opportunities: [],
          teams: [],
          companies: [],
          suggestions: [],
        },
      });
    }

    const results: {
      opportunities: any[];
      teams: any[];
      companies: any[];
    } = {
      opportunities: [],
      teams: [],
      companies: [],
    };

    // Search opportunities
    if (!type || type === 'opportunities') {
      const opportunities = await prisma.opportunity.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } },
          ],
          status: OpportunityStatus.active,
          visibility: 'public',
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      results.opportunities = opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        company: opp.company.name,
        companyId: opp.company.id,
        companyLogo: opp.company.logoUrl,
        location: opp.location,
        industry: opp.industry,
        status: mapOpportunityStatus(opp.status),
        createdAt: opp.createdAt.toISOString(),
      }));
    }

    // Search teams - handle visibility based on user type
    if (!type || type === 'teams') {
      // Check if current user is from a verified company
      const isVerified = session.user.userType === 'company'
        ? await isVerifiedCompanyUser(session.user.id)
        : false;

      // Build visibility filter based on user type
      const visibilityFilter: any[] = [
        { visibility: TeamVisibility.public },
      ];

      // Verified company users can also see anonymous teams
      if (isVerified) {
        visibilityFilter.push({ visibility: TeamVisibility.anonymous });
      }

      const teams = await prisma.team.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } },
          ],
          AND: [
            { OR: visibilityFilter },
            // Also check allowDiscovery setting in metadata
            {
              OR: [
                { metadata: { equals: null } },
                { metadata: { path: ['visibilitySettings', 'allowDiscovery'], equals: true } },
                { metadata: { path: ['visibilitySettings', 'allowDiscovery'], equals: null } },
              ],
            },
          ],
        },
        include: {
          members: {
            select: { id: true },
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      results.teams = teams.map((team) => {
        const baseTeam = {
          id: team.id,
          name: team.name,
          description: team.description,
          size: team.members.length,
          industry: team.industry,
          visibility: team.visibility,
          isAnonymous: team.isAnonymous,
          createdAt: team.createdAt.toISOString(),
        };

        // Anonymize team data if visibility is anonymous
        if (team.visibility === TeamVisibility.anonymous || team.isAnonymous) {
          return anonymizeTeam(baseTeam);
        }

        return baseTeam;
      });
    }

    // Search companies
    if (!type || type === 'companies') {
      const companies = await prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      results.companies = companies.map((company) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        industry: company.industry,
        logo: company.logoUrl,
        createdAt: company.createdAt.toISOString(),
      }));
    }

    const total =
      results.opportunities.length +
      results.teams.length +
      results.companies.length;

    return NextResponse.json({
      success: true,
      data: {
        query,
        total,
        ...results,
        suggestions: [], // Could be populated with autocomplete suggestions
      },
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search', details: String(error) },
      { status: 500 }
    );
  }
}
