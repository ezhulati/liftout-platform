import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/applications/opportunity/[opportunityId] - Get applications for an opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ opportunityId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { opportunityId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has access to this opportunity (company user)
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { companyId: true },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (session.user.userType === 'company') {
      const companyUser = await prisma.companyUser.findFirst({
        where: {
          userId: session.user.id,
          companyId: opportunity.companyId,
        },
      });

      if (!companyUser) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Get applications for this opportunity
    const applications = await prisma.teamApplication.findMany({
      where: { opportunityId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
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
      team: {
        id: app.team.id,
        name: app.team.name,
        size: app.team.members.length,
        members: app.team.members.map((m) => ({
          id: m.user.id,
          name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || m.user.email,
          role: m.role,
        })),
      },
      opportunityId: app.opportunityId,
      status: app.status,
      coverLetter: app.coverLetter,
      teamFitExplanation: app.teamFitExplanation,
      questionsForCompany: app.questionsForCompany,
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
      interview: app.interviewScheduledAt
        ? {
            scheduledAt: app.interviewScheduledAt.toISOString(),
            format: app.interviewFormat,
            duration: app.interviewDuration,
            location: app.interviewLocation,
            meetingLink: app.interviewMeetingLink,
            notes: app.interviewNotes,
          }
        : null,
      offer: app.offerMadeAt ? app.offerDetails : null,
      recruiterNotes: app.recruiterNotes,
    }));

    return NextResponse.json({
      applications: transformedApplications,
      total: transformedApplications.length,
    });
  } catch (error) {
    console.error('Error fetching opportunity applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity applications', details: String(error) },
      { status: 500 }
    );
  }
}
