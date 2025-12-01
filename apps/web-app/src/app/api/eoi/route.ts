import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// Helper to check if user is a demo user
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// Demo EOI data for demo users
const DEMO_EOIS = {
  // For team users (demo@example.com) - received EOIs from companies
  teamReceived: [
    {
      id: 'demo-eoi-1',
      fromType: 'company',
      fromId: 'demo-company-1',
      toType: 'team',
      toId: 'demo-team-1',
      status: 'pending',
      message: 'We were impressed by your team\'s fintech expertise and would love to discuss our analytics platform opportunity.',
      interestLevel: 'high',
      specificRole: 'Lead Analytics Division',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      from: { name: 'NextGen Financial', type: 'company' },
      to: { name: 'TechFlow Analytics', type: 'team' },
    },
    {
      id: 'demo-eoi-2',
      fromType: 'company',
      fromId: 'demo-company-2',
      toType: 'team',
      toId: 'demo-team-1',
      status: 'accepted',
      message: 'Your team\'s experience in healthcare AI aligns perfectly with our growth plans.',
      interestLevel: 'medium',
      specificRole: 'Healthcare AI Team Lead',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      from: { name: 'MedTech Innovations', type: 'company' },
      to: { name: 'TechFlow Analytics', type: 'team' },
    },
  ],
  // For company users (company@example.com) - sent EOIs to teams
  companySent: [
    {
      id: 'demo-eoi-3',
      fromType: 'company',
      fromId: 'demo-company-user',
      toType: 'team',
      toId: 'demo-team-2',
      status: 'pending',
      message: 'Your team\'s cloud infrastructure expertise would be valuable for our expansion.',
      interestLevel: 'high',
      specificRole: 'Platform Engineering Lead',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      from: { name: 'Your Company', type: 'company' },
      to: { name: 'CloudScale Architects', type: 'team' },
    },
    {
      id: 'demo-eoi-4',
      fromType: 'company',
      fromId: 'demo-company-user',
      toType: 'team',
      toId: 'demo-team-3',
      status: 'declined',
      message: 'Interested in your data science capabilities.',
      interestLevel: 'medium',
      specificRole: 'Data Science Team',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      from: { name: 'Your Company', type: 'company' },
      to: { name: 'DataFlow Insights', type: 'team' },
    },
  ],
};

// GET - List EOIs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isCompanyUser = session.user.userType === 'company';

    // Return demo data for demo users
    if (isDemoUser(session.user.email)) {
      if (isCompanyUser) {
        return NextResponse.json({
          sent: DEMO_EOIS.companySent,
          received: [],
        });
      } else {
        return NextResponse.json({
          sent: [],
          received: DEMO_EOIS.teamReceived,
        });
      }
    }

    // Get team memberships for received EOIs
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId: session.user.id, status: 'active' },
      select: { teamId: true },
    });
    const teamIds = teamMemberships.map(m => m.teamId);

    // Fetch both sent and received EOIs
    const [sentEois, receivedEois] = await Promise.all([
      prisma.expressionOfInterest.findMany({
        where: { fromId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      teamIds.length > 0
        ? prisma.expressionOfInterest.findMany({
            where: {
              toType: 'team',
              toId: { in: teamIds },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
          })
        : [],
    ]);

    // Return in the format expected by the component
    return NextResponse.json({
      sent: sentEois,
      received: receivedEois,
    });
  } catch (error) {
    console.error('Error fetching EOIs:', error);
    return NextResponse.json({ error: 'Failed to fetch EOIs' }, { status: 500 });
  }
}

// POST - Create a new EOI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toType, toId, message, interestLevel, specificRole, timeline, budgetRange } = body;

    if (!toType || !toId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing EOI
    const existing = await prisma.expressionOfInterest.findFirst({
      where: {
        fromId: session.user.id,
        toType,
        toId,
        status: 'pending',
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'You already have a pending EOI for this team' }, { status: 400 });
    }

    // Check if the team is in anonymous mode
    let shouldBeAnonymous = false;
    if (toType === 'team') {
      const team = await prisma.team.findUnique({
        where: { id: toId },
        select: { visibility: true, isAnonymous: true },
      });
      if (team?.visibility === 'anonymous' || team?.isAnonymous) {
        shouldBeAnonymous = true;
      }
    }

    // Create the EOI
    const eoi = await prisma.expressionOfInterest.create({
      data: {
        fromType: session.user.userType === 'company' ? 'company' : 'team',
        fromId: session.user.id,
        toType,
        toId,
        message,
        interestLevel: interestLevel || 'medium',
        specificRole,
        timeline,
        budgetRange,
        status: 'pending',
        metadata: { isAnonymous: shouldBeAnonymous },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Create notification for the recipient
    // Find team members to notify
    if (toType === 'team') {
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: toId, status: 'active', isAdmin: true },
        select: { userId: true },
      });

      // Create notifications for team admins
      await prisma.notification.createMany({
        data: teamMembers.map(member => ({
          userId: member.userId,
          type: 'company_interest',
          title: 'New Expression of Interest',
          message: `A company has expressed interest in your team${specificRole ? ` for a ${specificRole} role` : ''}`,
          data: { eoiId: eoi.id, teamId: toId },
          actionUrl: `/app/eoi/${eoi.id}`,
        })),
      });
    }

    return NextResponse.json(eoi, { status: 201 });
  } catch (error) {
    console.error('Error creating EOI:', error);
    return NextResponse.json({ error: 'Failed to create EOI' }, { status: 500 });
  }
}
