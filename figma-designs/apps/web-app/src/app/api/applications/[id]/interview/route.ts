import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { sendInterviewScheduledEmail } from '@/lib/email';

// POST /api/applications/[id]/interview - Schedule an interview
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { interviewDate, notes, format, duration, location, meetingLink, participants } = body;

    if (!interviewDate) {
      return NextResponse.json(
        { error: 'Interview date is required' },
        { status: 400 }
      );
    }

    // Find the application
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: { companyId: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Verify user has permission (company user for this opportunity)
    if (session.user.userType === 'company') {
      const companyUser = await prisma.companyUser.findFirst({
        where: {
          userId: session.user.id,
          companyId: application.opportunity.companyId,
        },
      });

      if (!companyUser) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Update the application with interview details
    // Using 'interviewing' status (valid enum: submitted, reviewing, interviewing, accepted, rejected)
    const updated = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: ApplicationStatus.interviewing,
        interviewScheduledAt: new Date(interviewDate),
        interviewFormat: format || 'video',
        interviewDuration: duration || 60,
        interviewLocation: location,
        interviewMeetingLink: meetingLink,
        interviewParticipants: participants || [],
        interviewNotes: notes,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            members: {
              where: { status: 'active' },
              include: {
                user: {
                  select: { email: true },
                },
              },
            },
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Send email notification to team members
    const teamEmails = updated.team.members
      .map((m) => m.user.email)
      .filter((email): email is string => !!email);

    if (teamEmails.length > 0) {
      const interviewDateTime = new Date(interviewDate);
      try {
        await sendInterviewScheduledEmail({
          to: teamEmails,
          teamName: updated.team.name,
          opportunityTitle: updated.opportunity.title,
          companyName: updated.opportunity.company?.name || 'Company',
          scheduledDate: interviewDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          scheduledTime: interviewDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short',
          }),
          duration: duration ? `${duration} minutes` : '1 hour',
          format: format || 'video',
          meetingLink: meetingLink,
          location: location,
          notes: notes,
          applicationUrl: `${process.env.NEXTAUTH_URL || 'https://liftout.com'}/app/applications/${updated.id}`,
        });
      } catch (emailError) {
        console.error('Failed to send interview scheduled email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      application: {
        id: updated.id,
        status: updated.status,
        teamId: updated.teamId,
        teamName: updated.team.name,
        opportunityId: updated.opportunityId,
        opportunityTitle: updated.opportunity.title,
        interview: {
          scheduledAt: updated.interviewScheduledAt?.toISOString(),
          format: updated.interviewFormat,
          duration: updated.interviewDuration,
          location: updated.interviewLocation,
          meetingLink: updated.interviewMeetingLink,
          participants: updated.interviewParticipants,
          notes: updated.interviewNotes,
        },
      },
      message: 'Interview scheduled successfully',
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Failed to schedule interview', details: String(error) },
      { status: 500 }
    );
  }
}
