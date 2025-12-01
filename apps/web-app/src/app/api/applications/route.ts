import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/applications - List applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    const where: any = {};

    if (teamId) {
      where.teamId = teamId;
    }

    if (opportunityId) {
      where.opportunityId = opportunityId;
    }

    if (status) {
      where.status = status;
    }

    // If no filters, show user's applications based on their type
    if (!teamId && !opportunityId) {
      if (session.user.userType === 'company') {
        const companyUser = await prisma.companyUser.findFirst({
          where: { userId: session.user.id },
        });
        if (companyUser) {
          where.opportunity = { companyId: companyUser.companyId };
        }
      } else {
        const teamMember = await prisma.teamMember.findFirst({
          where: { userId: session.user.id },
        });
        if (teamMember) {
          where.teamId = teamMember.teamId;
        }
      }
    }

    const applications = await prisma.teamApplication.findMany({
      where,
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

    const transformedApplications = applications.map((app) => ({
      id: app.id,
      teamId: app.teamId,
      opportunityId: app.opportunityId,
      team: app.team,
      opportunity: {
        id: app.opportunity.id,
        title: app.opportunity.title,
        company: app.opportunity.company,
      },
      status: app.status,
      coverLetter: app.coverLetter,
      submittedAt: app.appliedAt.toISOString(),
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
      interviewScheduledAt: app.interviewScheduledAt?.toISOString(),
      interviewNotes: app.interviewNotes,
    }));

    return NextResponse.json({ data: transformedApplications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit a new application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, opportunityId, coverLetter, teamFitExplanation, questionsForCompany } = body;

    // Verify opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Get team ID if not provided
    let actualTeamId = teamId;
    if (!actualTeamId) {
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: session.user.id },
      });
      if (teamMember) {
        actualTeamId = teamMember.teamId;
      }
    }

    if (!actualTeamId) {
      return NextResponse.json(
        { error: 'You must be part of a team to apply' },
        { status: 400 }
      );
    }

    // Check for existing application
    const existing = await prisma.teamApplication.findFirst({
      where: { teamId: actualTeamId, opportunityId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Your team has already applied to this opportunity' },
        { status: 400 }
      );
    }

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
        team: { select: { id: true, name: true } },
        opportunity: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
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
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application', details: String(error) },
      { status: 500 }
    );
  }
}
