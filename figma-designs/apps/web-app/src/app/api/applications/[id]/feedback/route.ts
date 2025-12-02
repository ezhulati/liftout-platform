import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { feedback, rating, decision } = body;

    // Find the application and verify access
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          include: {
            company: {
              include: {
                users: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Verify user is a company user for this opportunity
    if (application.opportunity.company.users.length === 0) {
      return NextResponse.json({ error: 'Not authorized to add feedback' }, { status: 403 });
    }

    // Update the application with feedback
    // Store feedback in recruiterNotes field (feedbackRating stored in interviewFeedback JSON)
    const updateData: Record<string, unknown> = {
      recruiterNotes: feedback,
      reviewedAt: new Date(),
    };

    if (rating) {
      updateData.interviewFeedback = { rating };
    }

    // Update status based on decision
    if (decision === 'accept') {
      updateData.status = 'accepted';
    } else if (decision === 'reject') {
      updateData.status = 'rejected';
    } else if (decision === 'interview') {
      updateData.status = 'interviewing';
    }

    const updated = await prisma.teamApplication.update({
      where: { id },
      data: updateData,
    });

    // Create notification for the team
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: application.teamId, status: 'active' },
      select: { userId: true },
    });

    await prisma.notification.createMany({
      data: teamMembers.map((member) => ({
        userId: member.userId,
        type: 'application_update' as const,
        title: 'Application Update',
        message: `Your application has been reviewed${decision ? ` - ${decision}` : ''}`,
        data: { applicationId: id },
        actionUrl: `/app/applications/${id}`,
      })),
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback added successfully',
      application: {
        id: updated.id,
        status: updated.status,
        feedback: updated.recruiterNotes,
      },
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    return NextResponse.json(
      { error: 'Failed to add feedback' },
      { status: 500 }
    );
  }
}
