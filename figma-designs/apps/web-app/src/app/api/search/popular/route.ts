import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpportunityStatus } from '@prisma/client';

// GET /api/search/popular - Get popular/trending searches
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get popular industries from active opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: OpportunityStatus.active,
        visibility: 'public',
      },
      select: {
        industry: true,
        location: true,
      },
      take: 50,
    });

    // Extract unique industries
    const industries = [...new Set(opportunities.map((o) => o.industry).filter(Boolean))] as string[];
    const locations = [...new Set(opportunities.map((o) => o.location).filter(Boolean))].slice(0, 4);

    // Build popular searches list
    const popular = [
      ...industries.slice(0, 4),
      ...locations,
    ];

    // Fallback if no data
    if (popular.length === 0) {
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
            'AI/ML',
          ],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { popular },
    });
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return NextResponse.json({
      success: true,
      data: {
        popular: [
          'Software Engineering',
          'Data Science',
          'Product Management',
          'Design',
        ],
      },
    });
  }
}
