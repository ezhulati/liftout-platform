import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// PATCH - Update interview details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduledAt, format, duration, location, notes, status } = body;

    const application = await prisma.teamApplication.findUnique({
      where: { id: params.id },
      include: {
        opportunity: { select: { companyId: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Check permissions
    const isCompanyOwner = application.opportunity.companyId === session.user.id;
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!isCompanyOwner && !teamMembership) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (scheduledAt) updateData.interviewScheduledAt = new Date(scheduledAt);
    if (format) updateData.interviewFormat = format;
    if (duration) updateData.interviewDuration = duration;
    if (location !== undefined) updateData.interviewLocation = location;
    if (notes !== undefined) updateData.interviewNotes = notes;
    if (status) updateData.status = status;

    const updated = await prisma.teamApplication.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

// DELETE - Cancel interview
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.teamApplication.findUnique({
      where: { id: params.id },
      include: {
        opportunity: { select: { companyId: true, title: true } },
        team: { select: { name: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Check permissions
    const isCompanyOwner = application.opportunity.companyId === session.user.id;
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!isCompanyOwner && !teamMembership) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Clear interview details but keep application
    const updated = await prisma.teamApplication.update({
      where: { id: params.id },
      data: {
        interviewScheduledAt: null,
        interviewFormat: null,
        interviewDuration: null,
        interviewLocation: null,
        interviewNotes: null,
        status: 'in_review',
      },
    });

    // Notify other party
    const notifications = [];
    if (isCompanyOwner) {
      // Notify team members
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: application.teamId, status: 'active' },
        select: { userId: true },
      });
      for (const member of teamMembers) {
        notifications.push({
          userId: member.userId,
          type: 'interview_cancelled',
          title: 'Interview Cancelled',
          message: `The interview for ${application.opportunity.title} has been cancelled`,
          data: { applicationId: params.id },
        });
      }
    } else {
      notifications.push({
        userId: application.opportunity.companyId,
        type: 'interview_cancelled',
        title: 'Interview Cancelled',
        message: `${application.team.name} has cancelled the interview`,
        data: { applicationId: params.id },
      });
    }

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    return NextResponse.json({ error: 'Failed to cancel interview' }, { status: 500 });
  }
}
