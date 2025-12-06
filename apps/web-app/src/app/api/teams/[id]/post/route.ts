import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to check if user is team admin/lead
async function isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'active',
      OR: [{ isAdmin: true }, { isLead: true }],
    },
  });
  return !!member;
}

// Helper to check posting requirements
async function checkPostingRequirements(teamId: string): Promise<{
  canPost: boolean;
  requirements: {
    id: string;
    label: string;
    met: boolean;
    details?: string;
  }[];
}> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        where: { status: 'active' },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    return { canPost: false, requirements: [] };
  }

  const requirements = [];

  // Requirement 1: At least 2 active members
  const activeMemberCount = team.members.length;
  requirements.push({
    id: 'min_members',
    label: 'At least 2 team members',
    met: activeMemberCount >= 2,
    details: `${activeMemberCount} active member(s)`,
  });

  // Requirement 2: All members have complete profiles
  const incompleteProfiles = team.members.filter((m) => {
    const profile = m.user.profile;
    return !profile || !profile.bio || !m.user.firstName || !m.user.lastName;
  });
  requirements.push({
    id: 'complete_profiles',
    label: 'All members have complete profiles',
    met: incompleteProfiles.length === 0,
    details:
      incompleteProfiles.length > 0
        ? `${incompleteProfiles.length} member(s) need to complete their profile`
        : 'All profiles complete',
  });

  // Requirement 3: Team has description
  requirements.push({
    id: 'team_description',
    label: 'Team has a description',
    met: !!team.description && team.description.length >= 20,
    details: team.description ? 'Description provided' : 'No description',
  });

  // Requirement 4: Team has industry set
  requirements.push({
    id: 'team_industry',
    label: 'Team industry specified',
    met: !!team.industry,
    details: team.industry || 'No industry set',
  });

  // Requirement 5: Team has at least one lead
  const hasLead = team.members.some((m) => m.isLead);
  requirements.push({
    id: 'has_lead',
    label: 'Team has a designated lead',
    met: hasLead,
    details: hasLead ? 'Team lead assigned' : 'No team lead',
  });

  const canPost = requirements.every((r) => r.met);

  return { canPost, requirements };
}

// POST - Post team (make visible to companies)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;

    // Verify user is team admin/lead
    const canPost = await isTeamAdmin(teamId, userId);
    if (!canPost) {
      // Also check if user is team creator
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { createdBy: true },
      });

      if (!team || team.createdBy !== userId) {
        return NextResponse.json(
          { error: 'Not authorized to post this team' },
          { status: 403 }
        );
      }
    }

    // Check posting requirements
    const { canPost: meetsRequirements, requirements } =
      await checkPostingRequirements(teamId);

    if (!meetsRequirements) {
      const unmetRequirements = requirements.filter((r) => !r.met);
      return NextResponse.json(
        {
          error: 'Team does not meet posting requirements',
          requirements,
          unmetRequirements,
        },
        { status: 400 }
      );
    }

    // Get current team status
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { postingStatus: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.postingStatus === 'posted') {
      return NextResponse.json(
        { error: 'Team is already posted' },
        { status: 400 }
      );
    }

    // Update team posting status
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        postingStatus: 'posted',
        postedAt: new Date(),
        unpostedAt: null,
        // Also set availability to available if not already set
        availabilityStatus: 'available',
      },
      select: {
        id: true,
        name: true,
        postingStatus: true,
        postedAt: true,
        availabilityStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team posted successfully. Your team is now visible to companies.',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Post team error:', error);
    return NextResponse.json(
      { error: 'Failed to post team' },
      { status: 500 }
    );
  }
}
