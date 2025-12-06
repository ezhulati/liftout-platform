import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const profileUpdateSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  companyName: z.string().optional(),
  position: z.string().optional(),
  industry: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  title: z.string().optional(),
  yearsExperience: z.number().optional(),
  availabilityStatus: z.enum(['available', 'open_to_opportunities', 'not_available']).optional(),
  remotePreference: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  salaryExpectationMin: z.number().optional(),
  salaryExpectationMax: z.number().optional(),
  willingToRelocate: z.boolean().optional(),
  profilePhotoUrl: z.string().nullable().optional(),
  // Extended fields for onboarding
  skills: z.array(z.any()).optional(),
  certifications: z.array(z.string()).optional(),
  achievements: z.string().optional(),
  searchPreferences: z.object({
    companySizes: z.array(z.string()).optional(),
    industries: z.array(z.string()).optional(),
    priorities: z.array(z.string()).optional(),
    dealbreakers: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
  }).optional(),
  // Profile sections stored as JSON
  workExperience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  portfolio: z.array(z.any()).optional(),
}).partial();

// GET - Retrieve user profile
export async function GET() {
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
      include: {
        profile: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform to expected format
    const profile = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      // Profile data
      phone: (user.metadata as any)?.phone || '',
      location: user.profile?.location || '',
      companyName: user.profile?.currentEmployer || '',
      position: user.profile?.currentTitle || user.profile?.title || '',
      title: user.profile?.title || '',
      industry: (user.metadata as any)?.industry || '',
      bio: user.profile?.bio || '',
      website: user.profile?.portfolioUrl || '',
      linkedin: user.profile?.linkedinUrl || '',
      github: user.profile?.githubUrl || '',
      profilePhotoUrl: user.profile?.profilePhotoUrl || '',
      yearsExperience: user.profile?.yearsExperience || null,
      availabilityStatus: user.profile?.availabilityStatus || 'open_to_opportunities',
      remotePreference: user.profile?.remotePreference || 'hybrid',
      salaryExpectationMin: user.profile?.salaryExpectationMin || null,
      salaryExpectationMax: user.profile?.salaryExpectationMax || null,
      willingToRelocate: user.profile?.willingToRelocate || false,
      // Extended profile data
      skills: user.skills?.map((s) => ({
        id: s.id,
        name: s.skill.name,
        proficiencyLevel: s.proficiencyLevel,
        yearsExperience: s.yearsExperience,
      })) || [],
      workExperience: ((user.profile as any)?.workExperience as any[]) || [],
      education: ((user.profile as any)?.education as any[]) || [],
      portfolio: ((user.profile as any)?.portfolio as any[]) || [],
      achievements: user.profile?.achievements || '',
      certifications: user.profile?.certifications || [],
      searchPreferences: user.profile?.searchPreferences || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Demo user handling - simulate success without database changes
    if (isDemoUser(session.user.email)) {
      console.log('[Demo] Profile update simulated for demo user');
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
      });
    }

    const body = await request.json();

    // Validate input
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build user update data
    const userUpdateData: any = {
      updatedAt: new Date(),
    };

    // Handle name - split into firstName/lastName if provided as single name
    if (updates.name) {
      const nameParts = updates.name.trim().split(' ');
      userUpdateData.firstName = nameParts[0] || currentUser.firstName;
      userUpdateData.lastName = nameParts.slice(1).join(' ') || currentUser.lastName;
    }
    if (updates.firstName) userUpdateData.firstName = updates.firstName;
    if (updates.lastName) userUpdateData.lastName = updates.lastName;

    // Store phone and industry in metadata
    if (updates.phone !== undefined || updates.industry !== undefined) {
      userUpdateData.metadata = {
        ...(currentUser.metadata as object || {}),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.industry !== undefined && { industry: updates.industry }),
      };
    }

    // Build profile update data
    const profileUpdateData: any = {};

    if (updates.location !== undefined) profileUpdateData.location = updates.location;
    if (updates.bio !== undefined) profileUpdateData.bio = updates.bio;
    if (updates.companyName !== undefined) profileUpdateData.currentEmployer = updates.companyName;
    if (updates.position !== undefined) {
      profileUpdateData.currentTitle = updates.position;
      profileUpdateData.title = updates.position;
    }
    if (updates.title !== undefined) profileUpdateData.title = updates.title;
    if (updates.website !== undefined) profileUpdateData.portfolioUrl = updates.website;
    if (updates.linkedin !== undefined) profileUpdateData.linkedinUrl = updates.linkedin;
    if (updates.yearsExperience !== undefined) profileUpdateData.yearsExperience = updates.yearsExperience;
    if (updates.availabilityStatus !== undefined) profileUpdateData.availabilityStatus = updates.availabilityStatus;
    if (updates.remotePreference !== undefined) profileUpdateData.remotePreference = updates.remotePreference;
    if (updates.salaryExpectationMin !== undefined) profileUpdateData.salaryExpectationMin = updates.salaryExpectationMin;
    if (updates.salaryExpectationMax !== undefined) profileUpdateData.salaryExpectationMax = updates.salaryExpectationMax;
    if (updates.willingToRelocate !== undefined) profileUpdateData.willingToRelocate = updates.willingToRelocate;
    // Skills are stored in a separate table (UserSkill), handled below
    // Update skillsSummary on profile for backwards compatibility
    if (updates.skills !== undefined) {
      profileUpdateData.skillsSummary = Array.isArray(updates.skills)
        ? updates.skills.map((s: any) => typeof s === 'string' ? s : s.name).join(', ')
        : '';
    }
    if (updates.certifications !== undefined) profileUpdateData.certifications = updates.certifications;
    if (updates.achievements !== undefined) profileUpdateData.achievements = updates.achievements;
    if (updates.searchPreferences !== undefined) profileUpdateData.searchPreferences = updates.searchPreferences;
    if (updates.profilePhotoUrl !== undefined) profileUpdateData.profilePhotoUrl = updates.profilePhotoUrl;
    // Profile sections stored as JSON
    if (updates.workExperience !== undefined) profileUpdateData.workExperience = updates.workExperience;
    if (updates.education !== undefined) profileUpdateData.education = updates.education;
    if (updates.portfolio !== undefined) profileUpdateData.portfolio = updates.portfolio;

    // Update user and profile in transaction
    await prisma.$transaction(async (tx) => {
      // Update user
      if (Object.keys(userUpdateData).length > 1) { // More than just updatedAt
        await tx.user.update({
          where: { id: session.user.id },
          data: userUpdateData,
        });
      }

      // Update or create profile
      if (Object.keys(profileUpdateData).length > 0) {
        if (currentUser.profile) {
          await tx.individualProfile.update({
            where: { userId: session.user.id },
            data: profileUpdateData,
          });
        } else {
          await tx.individualProfile.create({
            data: {
              userId: session.user.id,
              ...profileUpdateData,
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
