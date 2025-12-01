import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@liftout/database';

// GET - List EOIs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const direction = searchParams.get('direction') || 'sent'; // 'sent' or 'received'
    const status = searchParams.get('status'); // 'pending', 'accepted', 'declined'

    const where: Record<string, unknown> = {};

    if (direction === 'sent') {
      where.fromId = session.user.id;
    } else {
      // For received EOIs, find teams where user is a member
      const teamMemberships = await prisma.teamMember.findMany({
        where: { userId: session.user.id, status: 'active' },
        select: { teamId: true },
      });
      const teamIds = teamMemberships.map(m => m.teamId);
      where.toType = 'team';
      where.toId = { in: teamIds };
    }

    if (status) {
      where.status = status;
    }

    const eois = await prisma.expressionOfInterest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(eois);
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
