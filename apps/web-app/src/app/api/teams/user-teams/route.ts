import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export const dynamic = 'force-dynamic';

// GET /api/teams/user-teams - Get all teams for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Handle demo users
    if (userEmail === DEMO_ACCOUNTS.individual.email) {
      return NextResponse.json({
        success: true,
        data: [{
          id: DEMO_ACCOUNTS.individual.team.id,
          name: DEMO_ACCOUNTS.individual.team.name,
          size: DEMO_ACCOUNTS.individual.team.size,
          industry: ['Financial Services', 'Technology'],
        }]
      });
    }

    // Get teams where user is creator or member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { createdBy: userId },
          {
            members: {
              some: {
                userId: userId,
                status: 'active',
              },
            },
          },
        ],
      },
      include: {
        members: {
          where: { status: 'active' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to expected format
    const transformedTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      size: team._count.members || team.size,
      industry: team.industry ? [team.industry] : [],
      specialization: team.specialization,
      location: team.location,
      remoteStatus: team.remoteStatus,
      members: team.members.map(m => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        name: m.user ? `${m.user.firstName} ${m.user.lastName}`.trim() : '',
      })),
    }));

    return NextResponse.json({
      success: true,
      data: transformedTeams,
    });
  } catch (error) {
    console.error('Error fetching user teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user teams' },
      { status: 500 }
    );
  }
}
