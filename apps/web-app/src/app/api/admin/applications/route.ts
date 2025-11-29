import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = withAdminAccess(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.teamApplication.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.teamApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications: applications.map((app) => ({
        id: app.id,
        status: app.status,
        createdAt: app.appliedAt.toISOString(),
        team: app.team,
        opportunity: app.opportunity,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
});
