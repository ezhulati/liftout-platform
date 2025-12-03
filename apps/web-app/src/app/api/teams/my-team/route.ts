import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user's team membership
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      include: {
        team: {
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
                    profile: {
                      select: {
                        profilePhotoUrl: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
            _count: {
              select: {
                applications: true,
                members: true,
              },
            },
          },
        },
      },
    });

    if (!teamMember) {
      return NextResponse.json({ team: null });
    }

    const team = teamMember.team;
    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        industry: team.industry,
        location: team.location,
        size: team.size,
        yearsWorkingTogether: team.yearsWorkingTogether,
        verificationStatus: team.verificationStatus,
        availabilityStatus: team.availabilityStatus,
        members: team.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          role: m.role,
          isAdmin: m.isAdmin,
          user: {
            id: m.user.id,
            firstName: m.user.firstName,
            lastName: m.user.lastName,
            email: m.user.email,
            profilePhotoUrl: m.user.profile?.profilePhotoUrl,
            title: m.user.profile?.title,
          },
        })),
        applicationCount: team._count.applications,
        memberCount: team._count.members,
        createdAt: team.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
