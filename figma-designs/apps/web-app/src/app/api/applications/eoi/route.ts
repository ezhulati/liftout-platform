import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/applications/eoi - Get expressions of interest
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received';

    let applications;

    if (session.user.userType === 'company') {
      // Company users see applications for their opportunities
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
      });

      if (!companyUser) {
        return NextResponse.json({ applications: [] });
      }

      applications = await prisma.teamApplication.findMany({
        where: {
          opportunity: {
            companyId: companyUser.companyId,
          },
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              description: true,
              size: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      });
    } else {
      // Team users see their own applications
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: session.user.id },
      });

      if (!teamMember) {
        return NextResponse.json({ applications: [] });
      }

      applications = await prisma.teamApplication.findMany({
        where: {
          teamId: teamMember.teamId,
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          opportunity: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      });
    }

    // Transform for frontend
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      teamId: app.teamId,
      opportunityId: app.opportunityId,
      team: app.team,
      opportunity: {
        ...app.opportunity,
        company: (app.opportunity as any).company?.name || 'Unknown Company',
      },
      status: app.status,
      coverLetter: app.coverLetter,
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
    }));

    return NextResponse.json({ applications: transformedApplications });
  } catch (error) {
    console.error('Error fetching expressions of interest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expressions of interest', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/applications/eoi - Create expression of interest
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId, teamId, coverLetter, teamFitExplanation, questionsForCompany } = body;

    // Verify the opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Get or verify team
    let actualTeamId = teamId;
    if (!actualTeamId) {
      // Try to get user's team
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: session.user.id },
      });
      if (teamMember) {
        actualTeamId = teamMember.teamId;
      }
    }

    if (!actualTeamId) {
      return NextResponse.json(
        { error: 'You must be part of a team to express interest' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.teamApplication.findFirst({
      where: {
        teamId: actualTeamId,
        opportunityId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Your team has already expressed interest in this opportunity' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.teamApplication.create({
      data: {
        teamId: actualTeamId,
        opportunityId,
        coverLetter: coverLetter || null,
        teamFitExplanation: teamFitExplanation || null,
        questionsForCompany: questionsForCompany || null,
        appliedBy: session.user.id,
        status: 'submitted',
      },
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
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        teamId: application.teamId,
        opportunityId: application.opportunityId,
        team: application.team,
        opportunity: application.opportunity,
        status: application.status,
        appliedAt: application.appliedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating expression of interest:', error);
    return NextResponse.json(
      { error: 'Failed to create expression of interest', details: String(error) },
      { status: 500 }
    );
  }
}
