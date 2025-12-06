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

// Notification preferences schema
const notificationPreferencesSchema = z.object({
  newMessages: z.boolean().optional(),
  applicationUpdates: z.boolean().optional(),
  teamInvites: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
}).partial();

// GET - Retrieve user notification preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user with metadata
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        metadata: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract notification preferences from metadata or return defaults
    const metadata = user.metadata as any;
    const notificationPreferences = metadata?.notificationPreferences || {
      newMessages: true,
      applicationUpdates: true,
      teamInvites: true,
      marketingEmails: false,
      weeklyDigest: true,
    };

    return NextResponse.json({
      success: true,
      preferences: notificationPreferences,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve preferences' },
      { status: 500 }
    );
  }
}

// PATCH - Update user notification preferences
export async function PATCH(request: Request) {
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
      console.log('[Demo] Preferences update simulated for demo user');
      const body = await request.json();
      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: body,
      });
    }

    const body = await request.json();

    // Validate input
    const validationResult = notificationPreferencesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Get current user metadata
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentMetadata = (currentUser.metadata as any) || {};
    const currentPreferences = currentMetadata.notificationPreferences || {
      newMessages: true,
      applicationUpdates: true,
      teamInvites: true,
      marketingEmails: false,
      weeklyDigest: true,
    };

    // Merge updates with existing preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...updates,
    };

    // Update user metadata
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        metadata: {
          ...currentMetadata,
          notificationPreferences: updatedPreferences,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
