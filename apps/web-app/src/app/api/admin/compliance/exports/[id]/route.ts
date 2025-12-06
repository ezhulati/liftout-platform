import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Download GDPR export data for a specific request
export const GET = withAdminAccess(async (
  req: NextRequest,
  admin: any,
  params?: Record<string, string>
) => {
  try {
    const requestId = params?.id;

    // Find the GDPR request
    const gdprRequest = await prisma.gDPRRequest.findUnique({
      where: { id: requestId },
    });

    if (!gdprRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (gdprRequest.requestType !== 'export') {
      return NextResponse.json({ error: 'This is not an export request' }, { status: 400 });
    }

    if (gdprRequest.status !== 'completed') {
      return NextResponse.json({ error: 'Export not yet completed' }, { status: 400 });
    }

    // Check if export has expired
    if (gdprRequest.exportExpiresAt && new Date() > gdprRequest.exportExpiresAt) {
      return NextResponse.json({ error: 'Export has expired' }, { status: 410 });
    }

    // Fetch all user data
    const userId = gdprRequest.userId;

    const [user, profile, teams, applications, messages, notifications, savedItems] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          emailVerified: true,
          phoneVerified: true,
          createdAt: true,
          updatedAt: true,
          lastActive: true,
          timezone: true,
          locale: true,
        },
      }),
      prisma.individualProfile.findUnique({
        where: { userId },
      }),
      prisma.teamMember.findMany({
        where: { userId },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              description: true,
              industry: true,
              location: true,
            },
          },
        },
      }),
      prisma.teamApplication.findMany({
        where: {
          team: {
            members: { some: { userId } },
          },
        },
        include: {
          opportunity: {
            select: {
              id: true,
              title: true,
              company: {
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
      prisma.message.findMany({
        where: { senderId: userId },
        select: {
          id: true,
          content: true,
          messageType: true,
          sentAt: true,
        },
        orderBy: { sentAt: 'desc' },
        take: 1000, // Limit to recent 1000 messages
      }),
      prisma.notification.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedItem.findMany({
        where: { userId },
      }),
    ]);

    // Compile the export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      requestId: gdprRequest.id,
      requestedAt: gdprRequest.createdAt.toISOString(),
      user: {
        ...user,
        createdAt: user?.createdAt?.toISOString(),
        updatedAt: user?.updatedAt?.toISOString(),
        lastActive: user?.lastActive?.toISOString(),
      },
      profile: profile ? {
        ...profile,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      } : null,
      teams: teams.map(tm => ({
        membershipId: tm.id,
        role: tm.role,
        isAdmin: tm.isAdmin,
        isLead: tm.isLead,
        joinedAt: tm.joinedAt.toISOString(),
        team: tm.team,
      })),
      applications: applications.map(app => ({
        id: app.id,
        status: app.status,
        coverLetter: app.coverLetter,
        appliedAt: app.appliedAt.toISOString(),
        opportunity: app.opportunity,
      })),
      messages: messages.map(msg => ({
        ...msg,
        sentAt: msg.sentAt.toISOString(),
      })),
      notifications: notifications.map(n => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
      savedItems: savedItems.map(si => ({
        ...si,
        createdAt: si.createdAt.toISOString(),
        updatedAt: si.updatedAt.toISOString(),
      })),
    };

    // Return as JSON download
    const jsonString = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="gdpr-export-${userId}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('GDPR export download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
});
