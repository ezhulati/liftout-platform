import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { sendApplicationStatusEmail } from '@/lib/email';

// PATCH /api/applications/[id]/status - Update application status
export async function PATCH(
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
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Find the application with full details for email
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        opportunity: {
          select: {
            companyId: true,
            title: true,
            company: {
              select: { name: true },
            },
          },
        },
        team: {
          select: {
            name: true,
            createdBy: true,
            members: {
              where: { isLead: true },
              include: {
                user: {
                  select: { email: true, firstName: true },
                },
              },
            },
          },
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

    // Map status string to enum
    // Enum values: submitted, reviewing, interviewing, accepted, rejected
    const statusMap: Record<string, ApplicationStatus> = {
      submitted: ApplicationStatus.submitted,
      under_review: ApplicationStatus.reviewing,
      reviewing: ApplicationStatus.reviewing,
      shortlisted: ApplicationStatus.reviewing,
      interview_scheduled: ApplicationStatus.interviewing,
      interviewing: ApplicationStatus.interviewing,
      interview_completed: ApplicationStatus.interviewing,
      offer_extended: ApplicationStatus.accepted,
      offer_accepted: ApplicationStatus.accepted,
      accepted: ApplicationStatus.accepted,
      offer_declined: ApplicationStatus.rejected,
      rejected: ApplicationStatus.rejected,
      withdrawn: ApplicationStatus.rejected,
    };

    const newStatus = statusMap[status] || ApplicationStatus.submitted;

    // Update the application
    const updated = await prisma.teamApplication.update({
      where: { id },
      data: {
        status: newStatus,
        recruiterNotes: notes || undefined,
        reviewedAt: new Date(),
      },
    });

    // Send email notification to team lead
    const teamLead = application.team.members[0]?.user;
    if (teamLead?.email) {
      // Map status to email status type
      const emailStatusMap: Record<string, 'submitted' | 'reviewing' | 'interviewing' | 'accepted' | 'rejected'> = {
        submitted: 'submitted',
        reviewing: 'reviewing',
        interviewing: 'interviewing',
        accepted: 'accepted',
        rejected: 'rejected',
      };

      const emailStatus = emailStatusMap[newStatus] || 'reviewing';

      sendApplicationStatusEmail({
        to: teamLead.email,
        recipientName: teamLead.firstName || 'Team Lead',
        teamName: application.team.name,
        opportunityTitle: application.opportunity.title,
        companyName: application.opportunity.company?.name || 'Company',
        status: emailStatus,
        message: notes,
        applicationId: id,
      }).catch((err) => {
        console.error('Failed to send application status email:', err);
      });
    }

    return NextResponse.json({
      application: {
        id: updated.id,
        status: updated.status,
        notes: updated.recruiterNotes,
        updatedAt: updated.reviewedAt?.toISOString(),
      },
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status', details: String(error) },
      { status: 500 }
    );
  }
}
