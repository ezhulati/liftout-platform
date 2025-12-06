import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Export teams list to CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Only company users can export team lists
    if (session.user.userType !== 'company') {
      return NextResponse.json(
        { error: 'Only company users can export teams' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const source = searchParams.get('source') || 'saved'; // 'saved' or 'search'
    const teamIds = searchParams.get('teamIds')?.split(',') || [];

    let teams;

    if (source === 'saved') {
      // Export saved teams
      const savedItems = await prisma.savedItem.findMany({
        where: {
          userId: session.user.id,
          itemType: 'team',
        },
        select: { itemId: true },
      });

      const savedTeamIds = savedItems.map((item) => item.itemId);

      teams = await prisma.team.findMany({
        where: {
          id: { in: savedTeamIds },
        },
        include: {
          members: {
            where: { status: 'active' },
            select: {
              role: true,
              seniorityLevel: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profile: {
                    select: { yearsExperience: true },
                  },
                },
              },
            },
          },
        },
      });
    } else if (teamIds.length > 0) {
      // Export specific teams from search results
      teams = await prisma.team.findMany({
        where: {
          id: { in: teamIds },
          postingStatus: 'posted',
        },
        include: {
          members: {
            where: { status: 'active' },
            select: {
              role: true,
              seniorityLevel: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profile: {
                    select: { yearsExperience: true },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'No teams specified for export' },
        { status: 400 }
      );
    }

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'No teams found to export' },
        { status: 404 }
      );
    }

    if (format === 'json') {
      // JSON export
      const exportData = teams.map((team) => ({
        id: team.id,
        name: team.name,
        industry: team.industry,
        specialization: team.specialization,
        location: team.location,
        size: team.size,
        memberCount: team.members.length,
        yearsWorkingTogether: team.yearsWorkingTogether ? Number(team.yearsWorkingTogether) : 0,
        remoteStatus: team.remoteStatus,
        availabilityStatus: team.availabilityStatus,
        availabilityDate: team.availabilityDate?.toISOString() || null,
        verificationStatus: team.verificationStatus,
        salaryExpectationMin: team.salaryExpectationMin,
        salaryExpectationMax: team.salaryExpectationMax,
        salaryCurrency: team.salaryCurrency,
        members: team.members.map((m) => ({
          name: m.user ? `${m.user.firstName} ${m.user.lastName}`.trim() : 'Unknown',
          role: m.role,
          seniority: m.seniorityLevel,
          yearsExperience: m.user?.profile?.yearsExperience || 0,
        })),
      }));

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="teams-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // CSV export (default)
    const headers = [
      'Team ID',
      'Team Name',
      'Industry',
      'Specialization',
      'Location',
      'Team Size',
      'Member Count',
      'Years Working Together',
      'Remote Status',
      'Availability',
      'Available From',
      'Verification Status',
      'Salary Min',
      'Salary Max',
      'Currency',
    ];

    const rows = teams.map((team) => [
      team.id,
      escapeCsvField(team.name),
      escapeCsvField(team.industry || ''),
      escapeCsvField(team.specialization || ''),
      escapeCsvField(team.location || ''),
      team.size,
      team.members.length,
      team.yearsWorkingTogether ? Number(team.yearsWorkingTogether) : 0,
      team.remoteStatus,
      team.availabilityStatus,
      team.availabilityDate?.toISOString().split('T')[0] || '',
      team.verificationStatus,
      team.salaryExpectationMin || '',
      team.salaryExpectationMax || '',
      team.salaryCurrency || 'USD',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="teams-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export teams error:', error);
    return NextResponse.json(
      { error: 'Failed to export teams' },
      { status: 500 }
    );
  }
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
