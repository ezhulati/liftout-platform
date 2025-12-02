import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpportunityStatus } from '@prisma/client';

// GET /api/search/suggestions - Get search suggestions/autocomplete
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = request.nextUrl.searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { suggestions: [] },
      });
    }

    const suggestions: string[] = [];

    // Get matching opportunity titles
    const opportunities = await prisma.opportunity.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
        status: OpportunityStatus.active,
      },
      select: { title: true },
      take: 5,
    });
    suggestions.push(...opportunities.map((o) => o.title));

    // Get matching company names
    const companies = await prisma.company.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true },
      take: 3,
    });
    suggestions.push(...companies.map((c) => c.name));

    // Get matching team names
    const teams = await prisma.team.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        visibility: 'public',
      },
      select: { name: true },
      take: 3,
    });
    suggestions.push(...teams.map((t) => t.name));

    // Get unique suggestions
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 10);

    return NextResponse.json({
      success: true,
      data: { suggestions: uniqueSuggestions },
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({
      success: true,
      data: { suggestions: [] },
    });
  }
}
