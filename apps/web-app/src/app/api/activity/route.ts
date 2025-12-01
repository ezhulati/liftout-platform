import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// GET - Get activity feed for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // 'all', 'team', 'application', 'interview', 'message'

    // Get user's teams
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId: session.user.id, status: 'active' },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map(m => m.teamId);

    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: Date;
      metadata: Record<string, unknown>;
    }> = [];

    // Fetch different activity types based on filter
    if (!type || type === 'all' || type === 'application') {
      // Team applications
      const applications = await prisma.teamApplication.findMany({
        where: {
          OR: [
            { teamId: { in: teamIds } },
            { opportunity: { companyId: session.user.id } },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: {
          team: { select: { name: true } },
          opportunity: { select: { title: true } },
        },
      });

      applications.forEach(app => {
        activities.push({
          id: `application-${app.id}`,
          type: 'application',
          title: `Application ${app.status}`,
          description: `${app.team.name} applied for ${app.opportunity.title}`,
          timestamp: app.updatedAt,
          metadata: {
            applicationId: app.id,
            teamId: app.teamId,
            teamName: app.team.name,
            opportunityTitle: app.opportunity.title,
            status: app.status,
          },
        });
      });
    }

    if (!type || type === 'all' || type === 'interview') {
      // Scheduled interviews
      const interviews = await prisma.teamApplication.findMany({
        where: {
          interviewScheduledAt: { not: null },
          OR: [
            { teamId: { in: teamIds } },
            { opportunity: { companyId: session.user.id } },
          ],
        },
        orderBy: { interviewScheduledAt: 'desc' },
        take: limit,
        include: {
          team: { select: { name: true } },
          opportunity: { select: { title: true } },
        },
      });

      interviews.forEach(interview => {
        activities.push({
          id: `interview-${interview.id}`,
          type: 'interview',
          title: 'Interview Scheduled',
          description: `Interview with ${interview.team.name} for ${interview.opportunity.title}`,
          timestamp: interview.interviewScheduledAt!,
          metadata: {
            applicationId: interview.id,
            teamName: interview.team.name,
            opportunityTitle: interview.opportunity.title,
            format: interview.interviewFormat,
            scheduledAt: interview.interviewScheduledAt,
          },
        });
      });
    }

    if (!type || type === 'all' || type === 'message') {
      // Recent messages in conversations
      const conversations = await prisma.conversationParticipant.findMany({
        where: { userId: session.user.id },
        select: { conversationId: true },
      });
      const conversationIds = conversations.map(c => c.conversationId);

      const messages = await prisma.message.findMany({
        where: {
          conversationId: { in: conversationIds },
          senderId: { not: session.user.id },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          conversation: { select: { subject: true } },
          sender: { select: { name: true } },
        },
      });

      messages.forEach(msg => {
        activities.push({
          id: `message-${msg.id}`,
          type: 'message',
          title: 'New Message',
          description: msg.sender
            ? `${msg.sender.name}: ${msg.content.slice(0, 100)}${msg.content.length > 100 ? '...' : ''}`
            : `System message in ${msg.conversation.subject}`,
          timestamp: msg.createdAt,
          metadata: {
            messageId: msg.id,
            conversationId: msg.conversationId,
            subject: msg.conversation.subject,
            senderName: msg.sender?.name,
          },
        });
      });
    }

    if (!type || type === 'all' || type === 'eoi') {
      // Expressions of Interest
      const eois = await prisma.expressionOfInterest.findMany({
        where: {
          OR: [
            { fromId: session.user.id },
            { toType: 'team', toId: { in: teamIds } },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      });

      eois.forEach(eoi => {
        activities.push({
          id: `eoi-${eoi.id}`,
          type: 'eoi',
          title: eoi.status === 'pending' ? 'Expression of Interest' : `EOI ${eoi.status}`,
          description: eoi.fromId === session.user.id
            ? `Your EOI is ${eoi.status}`
            : `Received a new expression of interest`,
          timestamp: eoi.updatedAt,
          metadata: {
            eoiId: eoi.id,
            status: eoi.status,
            interestLevel: eoi.interestLevel,
          },
        });
      });
    }

    // Sort by timestamp and apply pagination
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const paginatedActivities = activities.slice(offset, offset + limit);

    return NextResponse.json({
      activities: paginatedActivities,
      total: activities.length,
      hasMore: offset + limit < activities.length,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
