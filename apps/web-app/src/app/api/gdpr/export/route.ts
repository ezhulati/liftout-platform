import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/gdpr/export - Request data export
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const format = body.format || 'json';

    // Collect all user data
    const userId = session.user.id;

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: {
          include: { skill: true }
        },
        notifications: {
          take: 100,
          orderBy: { createdAt: 'desc' }
        },
        subscriptions: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch team memberships
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            industry: true,
            createdAt: true,
          }
        }
      }
    });

    // Fetch applications
    const applications = await prisma.teamApplication.findMany({
      where: { appliedBy: userId },
      include: {
        team: {
          select: { id: true, name: true }
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: { select: { name: true } }
          }
        }
      }
    });

    // Fetch expressions of interest
    const expressionsOfInterest = await prisma.expressionOfInterest.findMany({
      where: { fromId: userId }
    });

    // Fetch conversations
    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            messages: {
              where: { senderId: userId },
              select: {
                content: true,
                sentAt: true,
                readAt: true,
              }
            }
          }
        }
      }
    });

    // Fetch saved items
    const savedItems = await prisma.savedItem.findMany({
      where: { userId }
    });

    // Fetch profile views (made by user)
    const profileViews = await prisma.profileView.findMany({
      where: { viewerId: userId },
      select: {
        viewedType: true,
        viewedAt: true,
      }
    });

    // Compile all data
    const exportData = {
      exportedAt: new Date().toISOString(),
      format,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        timezone: user.timezone,
        locale: user.locale,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        profile: user.profile,
        skills: user.skills.map(s => ({
          name: s.skill.name,
          category: s.skill.category,
          level: s.proficiencyLevel,
          yearsExperience: s.yearsExperience,
        })),
      },
      preferences: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
      teamMemberships: teamMemberships.map(m => ({
        teamId: m.team.id,
        teamName: m.team.name,
        role: m.role,
        joinedAt: m.joinedAt,
        status: m.status,
      })),
      applications: applications.map(a => ({
        id: a.id,
        teamName: a.team.name,
        opportunityTitle: a.opportunity.title,
        companyName: a.opportunity.company.name,
        status: a.status,
        appliedAt: a.appliedAt,
        coverLetter: a.coverLetter,
        proposedCompensation: a.proposedCompensation,
      })),
      expressionsOfInterest: expressionsOfInterest.map(e => ({
        id: e.id,
        type: e.fromType,
        status: e.status,
        message: e.message,
        createdAt: e.createdAt,
      })),
      messages: conversations.flatMap(c =>
        c.conversation.messages.map(m => ({
          conversationId: c.conversationId,
          content: m.content,
          sentAt: m.sentAt,
          readAt: m.readAt,
        }))
      ),
      savedItems: savedItems.map(s => ({
        itemType: s.itemType,
        itemId: s.itemId,
        savedAt: s.createdAt,
      })),
      activityHistory: profileViews.map(v => ({
        type: 'profile_view',
        viewedType: v.viewedType,
        timestamp: v.viewedAt,
      })),
      notifications: user.notifications.map(n => ({
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    };

    // Generate response based on format
    if (format === 'csv') {
      // For CSV, we'll create a simplified flat structure
      const csvData = convertToCSV(exportData);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="liftout-data-export-${userId}.csv"`,
        },
      });
    }

    // Default: JSON format
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="liftout-data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: Record<string, unknown>): string {
  const lines: string[] = [];

  // User Info Section
  lines.push('=== USER INFORMATION ===');
  lines.push('Field,Value');
  const user = data.user as Record<string, unknown>;
  Object.entries(user).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      lines.push(`"${key}","${String(value).replace(/"/g, '""')}"`);
    }
  });
  lines.push('');

  // Team Memberships Section
  lines.push('=== TEAM MEMBERSHIPS ===');
  lines.push('Team Name,Role,Joined At,Status');
  const memberships = data.teamMemberships as Array<Record<string, unknown>>;
  memberships?.forEach(m => {
    lines.push(`"${m.teamName}","${m.role}","${m.joinedAt}","${m.status}"`);
  });
  lines.push('');

  // Applications Section
  lines.push('=== APPLICATIONS ===');
  lines.push('Opportunity,Company,Team,Status,Applied At');
  const applications = data.applications as Array<Record<string, unknown>>;
  applications?.forEach(a => {
    lines.push(`"${a.opportunityTitle}","${a.companyName}","${a.teamName}","${a.status}","${a.appliedAt}"`);
  });
  lines.push('');

  // Messages Section
  lines.push('=== MESSAGES ===');
  lines.push('Conversation ID,Content,Sent At');
  const messages = data.messages as Array<Record<string, unknown>>;
  messages?.forEach(m => {
    const content = String(m.content || '').replace(/"/g, '""').slice(0, 200);
    lines.push(`"${m.conversationId}","${content}","${m.sentAt}"`);
  });

  return lines.join('\n');
}
