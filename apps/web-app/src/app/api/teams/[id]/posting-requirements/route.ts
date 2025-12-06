import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get team posting requirements and whether they're met
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const teamId = params.id;

    // Get team with all related data needed to check requirements
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { status: 'active' },
          include: {
            user: {
              include: {
                profile: {
                  select: {
                    bio: true,
                    title: true,
                    yearsExperience: true,
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const requirements = [];

    // Requirement 1: At least 2 active members
    const activeMemberCount = team.members.length;
    requirements.push({
      id: 'min_members',
      label: 'At least 2 team members',
      description: 'Your team needs at least 2 members who have accepted their invitations.',
      met: activeMemberCount >= 2,
      current: activeMemberCount,
      required: 2,
      details: `${activeMemberCount} active member(s)`,
      priority: 1,
    });

    // Requirement 2: All members have complete profiles
    const membersWithIncompleteProfiles = team.members.filter((m) => {
      const user = m.user;
      const profile = user.profile;
      // Check for basic profile completeness
      const hasName = user.firstName && user.lastName;
      const hasBio = profile?.bio && profile.bio.length >= 10;
      return !hasName || !hasBio;
    });

    requirements.push({
      id: 'complete_profiles',
      label: 'All members have complete profiles',
      description: 'Each team member should have a name and bio (at least 10 characters).',
      met: membersWithIncompleteProfiles.length === 0,
      current: team.members.length - membersWithIncompleteProfiles.length,
      required: team.members.length,
      details:
        membersWithIncompleteProfiles.length > 0
          ? `${membersWithIncompleteProfiles.length} member(s) need to complete their profile`
          : 'All profiles complete',
      incompleteMembers: membersWithIncompleteProfiles.map((m) => ({
        id: m.userId,
        name: `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() || 'Unnamed',
        email: m.user.email,
      })),
      priority: 2,
    });

    // Requirement 3: Team has description (at least 20 chars)
    const hasDescription = team.description && team.description.length >= 20;
    requirements.push({
      id: 'team_description',
      label: 'Team has a description',
      description: 'Describe your team in at least 20 characters.',
      met: hasDescription,
      current: team.description?.length || 0,
      required: 20,
      details: hasDescription
        ? 'Description provided'
        : 'Add a team description (20+ characters)',
      priority: 3,
    });

    // Requirement 4: Team has industry set
    const hasIndustry = !!team.industry;
    requirements.push({
      id: 'team_industry',
      label: 'Team industry specified',
      description: 'Select the industry your team operates in.',
      met: hasIndustry,
      details: team.industry || 'No industry set',
      priority: 4,
    });

    // Requirement 5: Team has at least one lead
    const hasLead = team.members.some((m) => m.isLead);
    requirements.push({
      id: 'has_lead',
      label: 'Team has a designated lead',
      description: 'One team member must be designated as the team lead.',
      met: hasLead,
      details: hasLead ? 'Team lead assigned' : 'No team lead',
      priority: 5,
    });

    // Calculate overall readiness
    const metCount = requirements.filter((r) => r.met).length;
    const totalCount = requirements.length;
    const canPost = requirements.every((r) => r.met);
    const progressPercent = Math.round((metCount / totalCount) * 100);

    // Get current posting status
    const postingStatus = team.postingStatus;

    return NextResponse.json({
      teamId: team.id,
      teamName: team.name,
      postingStatus,
      canPost,
      progress: {
        met: metCount,
        total: totalCount,
        percent: progressPercent,
      },
      requirements: requirements.sort((a, b) => a.priority - b.priority),
      nextStep: canPost
        ? 'Your team is ready to post!'
        : requirements.find((r) => !r.met)?.label || 'Complete all requirements',
    });
  } catch (error) {
    console.error('Get posting requirements error:', error);
    return NextResponse.json(
      { error: 'Failed to get posting requirements' },
      { status: 500 }
    );
  }
}
