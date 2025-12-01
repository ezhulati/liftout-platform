import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

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
