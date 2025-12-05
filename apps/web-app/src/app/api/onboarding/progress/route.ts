import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Returns onboarding status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        profileCompleted: true,
        userType: true,
        profile: {
          select: {
            title: true,
            location: true,
            bio: true,
            yearsExperience: true,
          },
        },
        // Check if user is already a member of a team
        teamMemberships: {
          where: { status: 'active' },
          select: { id: true },
          take: 1,
        },
        // Check if user is already a member of a company
        companyMemberships: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Auto-complete onboarding for invited users who already have memberships
    // This handles users who joined via invite link
    const hasTeamMembership = user.teamMemberships && user.teamMemberships.length > 0;
    const hasCompanyMembership = user.companyMemberships && user.companyMemberships.length > 0;
    const isInvitedUser = (user.userType === 'individual' && hasTeamMembership) ||
                          (user.userType === 'company' && hasCompanyMembership);

    // If user joined via invite and onboarding not yet marked complete, mark it now
    if (isInvitedUser && !user.profileCompleted) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileCompleted: true },
      });
      // Return completed status
      return NextResponse.json({
        isCompleted: true,
        skippedAt: null,
        profileCompleteness: 50, // Partial completion for invited users
        nextSteps: ['Complete your profile for better visibility'],
        invitedUser: true,
      });
    }

    // Check UserPreferences for skippedAt
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    const metadata = preferences?.privacySettings as Record<string, unknown> || {};
    const onboardingSkippedAt = metadata.onboardingSkippedAt as string | null;

    // Calculate profile completeness
    const profile = user.profile;
    let completedFields = 0;
    const totalFields = 4; // title, location, bio, yearsExperience

    if (profile?.title) completedFields++;
    if (profile?.location) completedFields++;
    if (profile?.bio) completedFields++;
    if (profile?.yearsExperience) completedFields++;

    const profileCompleteness = Math.round((completedFields / totalFields) * 100);

    // Determine next steps
    const nextSteps: string[] = [];
    if (!profile?.title) nextSteps.push('Add your professional title');
    if (!profile?.location) nextSteps.push('Add your location');
    if (!profile?.bio) nextSteps.push('Write a short bio');
    if (!profile?.yearsExperience) nextSteps.push('Add years of experience');

    return NextResponse.json({
      isCompleted: user.profileCompleted,
      skippedAt: onboardingSkippedAt,
      profileCompleteness,
      nextSteps,
    });
  } catch (error) {
    console.error('Get onboarding progress error:', error);
    return NextResponse.json(
      { error: 'Failed to get onboarding progress' },
      { status: 500 }
    );
  }
}

// PUT - Updates onboarding status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body; // 'complete' | 'skip'

    if (action === 'complete') {
      // Mark profile as completed
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileCompleted: true },
      });

      return NextResponse.json({
        success: true,
        isCompleted: true,
        message: 'Onboarding completed successfully',
      });
    } else if (action === 'skip') {
      // Mark profile as completed AND store skip timestamp
      // This prevents the redirect loop while still tracking that user skipped
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileCompleted: true },
      });

      // Store skip timestamp in UserPreferences for tracking
      const existingPrefs = await prisma.userPreferences.findUnique({
        where: { userId: session.user.id },
      });

      if (existingPrefs) {
        const currentSettings = existingPrefs.privacySettings as Record<string, unknown> || {};
        await prisma.userPreferences.update({
          where: { userId: session.user.id },
          data: {
            privacySettings: {
              ...currentSettings,
              onboardingSkippedAt: new Date().toISOString(),
            },
          },
        });
      } else {
        await prisma.userPreferences.create({
          data: {
            userId: session.user.id,
            privacySettings: {
              onboardingSkippedAt: new Date().toISOString(),
            },
          },
        });
      }

      return NextResponse.json({
        success: true,
        isCompleted: true,
        skippedAt: new Date().toISOString(),
        message: 'Onboarding skipped. You can complete your profile later.',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "complete" or "skip"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Update onboarding progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding progress' },
      { status: 500 }
    );
  }
}
