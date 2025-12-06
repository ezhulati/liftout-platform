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
                        yearsExperience: true,
                      },
                    },
                    skills: {
                      include: {
                        skill: true,
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

    // Fetch pending invitations (members with status 'pending')
    const pendingInvitations = await prisma.teamMember.findMany({
      where: {
        teamId: team.id,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        industry: team.industry,
        location: team.location,
        size: team.size,
        yearsWorkingTogether: team.yearsWorkingTogether,
        availabilityStatus: team.availabilityStatus,
        visibility: team.visibility,
        createdBy: team.createdBy,
        members: team.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          name: `${m.user.firstName} ${m.user.lastName}`.trim() || 'Team Member',
          role: m.role || 'Member',
          experience: m.user.profile?.yearsExperience || 0,
          avatar: m.user.profile?.profilePhotoUrl || null,
          isLead: m.isAdmin,
          skills: m.user.skills?.map((s) => s.skill.name) || []
        })),
        invitations: pendingInvitations.map((inv) => ({
          id: inv.id,
          email: inv.user?.email || 'Unknown',
          role: inv.role || undefined,
          status: 'pending' as const,
          createdAt: inv.invitedAt?.toISOString() || inv.createdAt.toISOString(),
          expiresAt: inv.invitationExpiresAt?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })),
        applicationCount: team._count.applications,
        memberCount: team._count.members,
        createdAt: team.createdAt.toISOString(),
      },
      currentUserRole: teamMember.isAdmin ? 'lead' : 'member',
      isOwner: team.createdBy === session.user.id,
    });
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
