import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EntityType } from '@prisma/client';

// GET /api/applications/eoi/team/[teamId] - Get EOIs received by team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { teamId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a member of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get team members to find EOIs sent to any team member
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true },
    });

    const userIds = teamMembers.map((tm) => tm.userId);

    const eois = await prisma.expressionOfInterest.findMany({
      where: {
        toId: { in: userIds },
        toType: EntityType.team,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform for frontend
    const transformedEOIs = eois.map((eoi) => ({
      id: eoi.id,
      fromType: eoi.fromType,
      fromId: eoi.fromId,
      sender: {
        id: eoi.sender.id,
        name: `${eoi.sender.firstName || ''} ${eoi.sender.lastName || ''}`.trim() || eoi.sender.email,
        email: eoi.sender.email,
      },
      message: eoi.message,
      interestLevel: eoi.interestLevel,
      specificRole: eoi.specificRole,
      timeline: eoi.timeline,
      status: eoi.status,
      createdAt: eoi.createdAt.toISOString(),
      respondedAt: eoi.respondedAt?.toISOString(),
      expiresAt: eoi.expiresAt?.toISOString(),
    }));

    return NextResponse.json({
      interests: transformedEOIs,
      total: transformedEOIs.length,
    });
  } catch (error) {
    console.error('Error fetching team EOIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expressions of interest', details: String(error) },
      { status: 500 }
    );
  }
}
