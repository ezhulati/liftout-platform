import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TeamVisibility } from '@prisma/client';

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

// Helper to check if requesting user can view team based on visibility
async function canViewTeam(
  team: { visibility: TeamVisibility; isAnonymous: boolean; createdBy: string },
  viewerId: string,
  viewerType: string
): Promise<{ canView: boolean; showAnonymous: boolean }> {
  // Team creator/members can always view their own team
  const isMember = await prisma.teamMember.findFirst({
    where: { teamId: team.createdBy, userId: viewerId, status: 'active' },
  });

  if (team.createdBy === viewerId || isMember) {
    return { canView: true, showAnonymous: false };
  }

  switch (team.visibility) {
    case 'public':
      return { canView: true, showAnonymous: team.isAnonymous };

    case 'private':
      // Only visible to team members (already checked above)
      return { canView: false, showAnonymous: false };

    case 'anonymous':
      // Visible but with anonymized info
      if (viewerType === 'company') {
        // Check if company is verified
        const company = await prisma.company.findFirst({
          where: {
            users: { some: { userId: viewerId } },
            verificationStatus: 'verified',
          },
        });
        return { canView: !!company, showAnonymous: true };
      }
      return { canView: false, showAnonymous: false };

    default:
      return { canView: true, showAnonymous: false };
  }
}

// GET - Retrieve team by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
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
                    bio: true,
                    yearsExperience: true,
                  },
                },
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Transform to expected format
    const transformedTeam = {
      id: team.id,
      name: team.name,
      description: team.description || '',
      industry: team.industry || '',
      specialization: team.specialization || '',
      size: team.size,
      location: team.location || '',
      remoteStatus: team.remoteStatus,
      availabilityStatus: team.availabilityStatus,
      yearsWorkingTogether: team.yearsWorkingTogether ? Number(team.yearsWorkingTogether) : 0,
      teamCulture: team.teamCulture || '',
      workingStyle: team.workingStyle || '',
      communicationStyle: team.communicationStyle || '',
      notableAchievements: team.notableAchievements || '',
      portfolioUrl: team.portfolioUrl || '',
      caseStudies: team.caseStudies || [],
      performanceMetrics: team.performanceMetrics || {},
      clientTestimonials: team.clientTestimonials || [],
      awardsRecognition: team.awardsRecognition || [],
      visibility: team.visibility,
      isAnonymous: team.isAnonymous,
      metadata: team.metadata || {},
      salaryExpectationMin: team.salaryExpectationMin,
      salaryExpectationMax: team.salaryExpectationMax,
      salaryCurrency: team.salaryCurrency,
      equityExpectation: team.equityExpectation,
      benefitsRequirements: team.benefitsRequirements || [],
      availabilityDate: team.availabilityDate,
      verificationStatus: team.verificationStatus,
      verifiedAt: team.verifiedAt,
      createdBy: team.createdBy,
      creator: team.creator ? {
        id: team.creator.id,
        name: `${team.creator.firstName} ${team.creator.lastName}`.trim(),
        email: team.creator.email,
      } : null,
      members: team.members.map(member => ({
        id: member.id,
        userId: member.userId,
        role: member.role || '',
        specialization: member.specialization || '',
        seniorityLevel: member.seniorityLevel,
        isAdmin: member.isAdmin,
        isLead: member.isLead,
        keySkills: member.keySkills || [],
        status: member.status,
        joinedAt: member.joinedAt,
        user: member.user ? {
          id: member.user.id,
          name: `${member.user.firstName} ${member.user.lastName}`.trim(),
          email: member.user.email,
          photoUrl: member.user.profile?.profilePhotoUrl || '',
          title: member.user.profile?.title || '',
          bio: member.user.profile?.bio || '',
          yearsExperience: member.user.profile?.yearsExperience || 0,
        } : null,
      })),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };

    return NextResponse.json(transformedTeam);
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve team' },
      { status: 500 }
    );
  }
}

// PATCH - Update team (including visibility/privacy settings)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify user is team admin/lead
    const canEdit = await isTeamAdmin(params.id, session.user.id);
    if (!canEdit) {
      // Also check if user is team creator
      const team = await prisma.team.findUnique({
        where: { id: params.id },
        select: { createdBy: true },
      });

      if (!team || team.createdBy !== session.user.id) {
        return NextResponse.json(
          { error: 'Not authorized to update this team' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      name,
      description,
      visibility,
      isAnonymous,
      hideCurrentEmployer,
      allowDiscovery,
      industry,
      location,
      specialization,
      teamCulture,
      workingStyle,
      communicationStyle,
      notableAchievements,
      portfolioUrl,
      availabilityStatus,
      remoteStatus,
      salaryExpectationMin,
      salaryExpectationMax,
      salaryCurrency,
      equityExpectation,
      benefitsRequirements,
      availabilityDate,
    } = body;

    // Build update data
    const updateData: any = {};

    // Basic info
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (industry !== undefined) updateData.industry = industry;
    if (location !== undefined) updateData.location = location;
    if (specialization !== undefined) updateData.specialization = specialization;

    // Privacy/Visibility settings
    if (visibility !== undefined) {
      if (!['public', 'private', 'anonymous'].includes(visibility)) {
        return NextResponse.json(
          { error: 'Invalid visibility value. Must be public, private, or anonymous' },
          { status: 400 }
        );
      }
      updateData.visibility = visibility as TeamVisibility;
    }
    if (isAnonymous !== undefined) updateData.isAnonymous = isAnonymous;

    // Store additional privacy settings in metadata JSON field
    if (hideCurrentEmployer !== undefined || allowDiscovery !== undefined) {
      const currentTeam = await prisma.team.findUnique({
        where: { id: params.id },
        select: { metadata: true },
      });

      const currentMetadata = (currentTeam?.metadata as Record<string, unknown>) || {};
      const currentSettings = (currentMetadata.visibilitySettings as Record<string, unknown>) || {};
      updateData.metadata = {
        ...currentMetadata,
        visibilitySettings: {
          ...currentSettings,
          ...(hideCurrentEmployer !== undefined && { hideCurrentEmployer }),
          ...(allowDiscovery !== undefined && { allowDiscovery }),
        },
      };
    }

    // Culture/work style
    if (teamCulture !== undefined) updateData.teamCulture = teamCulture;
    if (workingStyle !== undefined) updateData.workingStyle = workingStyle;
    if (communicationStyle !== undefined) updateData.communicationStyle = communicationStyle;
    if (notableAchievements !== undefined) updateData.notableAchievements = notableAchievements;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;

    // Availability
    if (availabilityStatus !== undefined) updateData.availabilityStatus = availabilityStatus;
    if (remoteStatus !== undefined) updateData.remoteStatus = remoteStatus;
    if (availabilityDate !== undefined) updateData.availabilityDate = new Date(availabilityDate);

    // Compensation
    if (salaryExpectationMin !== undefined) updateData.salaryExpectationMin = salaryExpectationMin;
    if (salaryExpectationMax !== undefined) updateData.salaryExpectationMax = salaryExpectationMax;
    if (salaryCurrency !== undefined) updateData.salaryCurrency = salaryCurrency;
    if (equityExpectation !== undefined) updateData.equityExpectation = equityExpectation;
    if (benefitsRequirements !== undefined) updateData.benefitsRequirements = benefitsRequirements;

    // Update team
    const updatedTeam = await prisma.team.update({
      where: { id: params.id },
      data: updateData,
      include: {
        members: {
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
      },
    });

    // Extract visibilitySettings from metadata
    const metadata = updatedTeam.metadata as Record<string, unknown> | null;
    const visibilitySettings = metadata?.visibilitySettings || {};

    return NextResponse.json({
      success: true,
      team: {
        id: updatedTeam.id,
        name: updatedTeam.name,
        description: updatedTeam.description,
        visibility: updatedTeam.visibility,
        isAnonymous: updatedTeam.isAnonymous,
        visibilitySettings,
        availabilityStatus: updatedTeam.availabilityStatus,
        updatedAt: updatedTeam.updatedAt,
      },
      message: 'Team updated successfully',
    });
  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}
