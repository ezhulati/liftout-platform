import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/applications/team/[teamId] - Get applications for a team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { teamId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a member of this team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get applications for this team
    const applications = await prisma.teamApplication.findMany({
      where: { teamId },
      include: {
        opportunity: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Transform for frontend
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      teamId: app.teamId,
      opportunityId: app.opportunityId,
      opportunity: {
        id: app.opportunity.id,
        title: app.opportunity.title,
        company: app.opportunity.company.name,
        companyLogo: app.opportunity.company.logoUrl,
        location: app.opportunity.location,
      },
      status: app.status,
      coverLetter: app.coverLetter,
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
      interview: app.interviewScheduledAt
        ? {
            scheduledAt: app.interviewScheduledAt.toISOString(),
            format: app.interviewFormat,
            location: app.interviewLocation,
            meetingLink: app.interviewMeetingLink,
          }
        : null,
      offer: app.offerMadeAt ? app.offerDetails : null,
    }));

    return NextResponse.json({
      applications: transformedApplications,
      total: transformedApplications.length,
    });
  } catch (error) {
    console.error('Error fetching team applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team applications', details: String(error) },
      { status: 500 }
    );
  }
}
