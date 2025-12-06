import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isVerifiedCompanyUser, isCompanyBlocked } from '@/lib/visibility';

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

    // Check company verification - must be verified to export anonymous teams
    const verification = await isVerifiedCompanyUser(session.user.id);
    const viewerCompanyId = verification.companyId;

    // Determine which visibility modes user can access
    const visibilityFilter: ('public' | 'anonymous')[] = verification.isVerified
      ? ['public', 'anonymous']
      : ['public'];

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
          visibility: { in: visibilityFilter },
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
          visibility: { in: visibilityFilter },
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

    // Filter out teams that have blocked the viewer's company
    if (viewerCompanyId) {
      teams = teams.filter(team => !isCompanyBlocked(team, viewerCompanyId));
    }

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'No teams found to export' },
        { status: 404 }
      );
    }

    if (format === 'json') {
      // JSON export - anonymize anonymous teams
      const exportData = teams.map((team) => {
        const isAnonymous = team.visibility === 'anonymous' || team.isAnonymous;
        return {
          id: team.id,
          name: isAnonymous ? `Anonymous Team #${team.id.slice(-6).toUpperCase()}` : team.name,
          industry: team.industry,
          specialization: team.specialization,
          location: isAnonymous ? generalizeLocation(team.location) : team.location,
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
          isAnonymous,
          // Anonymize member names for anonymous teams
          members: team.members.map((m, index) => ({
            name: isAnonymous
              ? `Team Member ${index + 1}`
              : (m.user ? `${m.user.firstName} ${m.user.lastName}`.trim() : 'Unknown'),
            role: m.role,
            seniority: m.seniorityLevel,
            yearsExperience: m.user?.profile?.yearsExperience || 0,
          })),
        };
      });

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="teams-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // CSV export (default) - anonymize anonymous teams
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
      'Anonymous',
    ];

    const rows = teams.map((team) => {
      const isAnonymous = team.visibility === 'anonymous' || team.isAnonymous;
      return [
        team.id,
        escapeCsvField(isAnonymous ? `Anonymous Team #${team.id.slice(-6).toUpperCase()}` : team.name),
        escapeCsvField(team.industry || ''),
        escapeCsvField(team.specialization || ''),
        escapeCsvField(isAnonymous ? (generalizeLocation(team.location) || '') : (team.location || '')),
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
        isAnonymous ? 'Yes' : 'No',
      ];
    });

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

// Generalize location for anonymous teams
function generalizeLocation(location: string | null): string | null {
  if (!location) return null;

  const locationLower = location.toLowerCase();
  const usRegions: Record<string, string> = {
    'new york': 'Northeast US',
    'los angeles': 'West Coast US',
    'san francisco': 'West Coast US',
    'chicago': 'Midwest US',
    'boston': 'Northeast US',
    'seattle': 'West Coast US',
    'austin': 'Southwest US',
    'denver': 'Mountain West US',
    'miami': 'Southeast US',
    'atlanta': 'Southeast US',
    'dallas': 'Southwest US',
    'houston': 'Southwest US',
  };

  for (const [city, region] of Object.entries(usRegions)) {
    if (locationLower.includes(city)) {
      return region;
    }
  }

  if (locationLower.includes('london') || locationLower.includes('uk')) {
    return 'United Kingdom';
  }

  if (locationLower.includes('remote')) {
    return 'Remote';
  }

  return location;
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
