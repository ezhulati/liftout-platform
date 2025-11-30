import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
