import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Export applications as CSV or JSON
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Get user's teams
    const userTeams = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      select: { teamId: true },
    });

    const teamIds = userTeams.map((t) => t.teamId);

    if (teamIds.length === 0) {
      if (format === 'csv') {
        return new NextResponse('No applications found', {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="applications.csv"',
          },
        });
      }
      return NextResponse.json({ applications: [], total: 0 });
    }

    const applications = await prisma.teamApplication.findMany({
      where: {
        teamId: { in: teamIds },
      },
      include: {
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
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const exportData = applications.map((app) => ({
      id: app.id,
      team: app.team.name,
      opportunity: app.opportunity.title,
      company: app.opportunity.company.name,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString() || '',
      interviewScheduledAt: app.interviewScheduledAt?.toISOString() || '',
      offerMadeAt: app.offerMadeAt?.toISOString() || '',
      finalDecisionAt: app.finalDecisionAt?.toISOString() || '',
    }));

    if (format === 'csv') {
      const headers = [
        'ID',
        'Team',
        'Opportunity',
        'Company',
        'Status',
        'Applied At',
        'Reviewed At',
        'Interview Scheduled',
        'Offer Made',
        'Final Decision',
      ];

      const rows = exportData.map((app) => [
        app.id,
        `"${app.team}"`,
        `"${app.opportunity}"`,
        `"${app.company}"`,
        app.status,
        app.appliedAt,
        app.reviewedAt,
        app.interviewScheduledAt,
        app.offerMadeAt,
        app.finalDecisionAt,
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="applications_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      applications: exportData,
      total: exportData.length,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Export applications error:', error);
    return NextResponse.json(
      { error: 'Failed to export applications' },
      { status: 500 }
    );
  }
}
