import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// POST /api/teams/join - Join a team using an invite code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Normalize the invite code (remove dashes, uppercase)
    const normalizedCode = inviteCode.replace(/-/g, '').toUpperCase();

    // Demo user handling - simulate success
    if (isDemoUser(session.user.email)) {
      console.log('[Demo] Team join simulated for demo user with code:', normalizedCode);
      return NextResponse.json({
        success: true,
        message: 'Successfully joined the team!',
        team: {
          id: 'demo-team',
          name: 'Demo Team',
        },
      });
    }

    // Look up the team by invite code
    // Teams store invite codes in their metadata JSON field
    const team = await prisma.team.findFirst({
      where: {
        deletedAt: null,
        OR: [
          {
            metadata: {
              path: ['inviteCode'],
              equals: normalizedCode,
            },
          },
          // Also check the raw code format
          {
            metadata: {
              path: ['inviteCode'],
              equals: inviteCode.toUpperCase(),
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        metadata: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Invalid invite code. Please check and try again.' },
        { status: 404 }
      );
    }

    // Check if user is already a member (active or pending)
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: team.id,
        userId: session.user.id,
        status: { in: ['active', 'pending'] },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this team.' },
        { status: 400 }
      );
    }

    // Add user to the team
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.user.id,
        role: 'member',
        status: 'active',
        joinedAt: new Date(),
      },
    });

    // Update team member count if tracked
    await prisma.team.update({
      where: { id: team.id },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the team!',
      team: {
        id: team.id,
        name: team.name,
      },
    });
  } catch (error) {
    console.error('Team join error:', error);
    return NextResponse.json(
      { error: 'Failed to join team. Please try again.' },
      { status: 500 }
    );
  }
}
