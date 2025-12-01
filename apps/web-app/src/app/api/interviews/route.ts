import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// GET - List interviews for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'upcoming', 'past', 'all'

    // Get team memberships for the user
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId: session.user.id, status: 'active' },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map(m => m.teamId);

    // Build the where clause
    const where: Record<string, unknown> = {
      interviewScheduledAt: { not: null },
      OR: [
        // Applications where user's team is the applicant
        { teamId: { in: teamIds } },
        // Applications to opportunities owned by user's company
        { opportunity: { companyId: session.user.id } },
      ],
    };

    if (status === 'upcoming') {
      where.interviewScheduledAt = { gte: new Date() };
    } else if (status === 'past') {
      where.interviewScheduledAt = { lt: new Date() };
    }

    const interviews = await prisma.teamApplication.findMany({
      where,
      orderBy: { interviewScheduledAt: 'asc' },
      include: {
        team: {
          select: { id: true, name: true },
        },
        opportunity: {
          select: { id: true, title: true, companyId: true },
        },
      },
      take: 50,
    });

    // Transform to interview format
    const formattedInterviews = interviews.map(app => ({
      id: app.id,
      teamId: app.teamId,
      teamName: app.team.name,
      opportunityId: app.opportunityId,
      opportunityTitle: app.opportunity.title,
      scheduledAt: app.interviewScheduledAt,
      format: app.interviewFormat || 'video',
      duration: app.interviewDuration || 60,
      location: app.interviewLocation,
      notes: app.interviewNotes,
      status: app.status,
    }));

    return NextResponse.json(formattedInterviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST - Schedule an interview
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, scheduledAt, format, duration, location, notes } = body;

    if (!applicationId || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the application exists and user has permission
    const application = await prisma.teamApplication.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: { select: { companyId: true, title: true } },
        team: { select: { name: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if user is company owner or team member
    const isCompanyOwner = application.opportunity.companyId === session.user.id;
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: application.teamId,
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!isCompanyOwner && !teamMembership) {
      return NextResponse.json({ error: 'Not authorized to schedule this interview' }, { status: 403 });
    }

    // Update the application with interview details
    const updatedApplication = await prisma.teamApplication.update({
      where: { id: applicationId },
      data: {
        interviewScheduledAt: new Date(scheduledAt),
        interviewFormat: format || 'video',
        interviewDuration: duration || 60,
        interviewLocation: location,
        interviewNotes: notes,
        status: 'interviewing',
      },
    });

    // Create notifications for both parties
    const notifications = [];

    // Notify team members
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: application.teamId, status: 'active' },
      select: { userId: true },
    });

    for (const member of teamMembers) {
      if (member.userId !== session.user.id) {
        notifications.push({
          userId: member.userId,
          type: 'interview_scheduled',
          title: 'Interview Scheduled',
          message: `An interview has been scheduled for ${application.opportunity.title}`,
          data: { applicationId, scheduledAt },
          actionUrl: `/app/interviews`,
        });
      }
    }

    // Notify company (if team scheduled it)
    if (!isCompanyOwner) {
      notifications.push({
        userId: application.opportunity.companyId,
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: `${application.team.name} has confirmed an interview`,
        data: { applicationId, scheduledAt },
        actionUrl: `/app/interviews`,
      });
    }

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }

    return NextResponse.json(updatedApplication, { status: 201 });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json({ error: 'Failed to schedule interview' }, { status: 500 });
  }
}
