import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

const settingsSchema = z.object({
  notifications: z.object({
    email: z.object({
      newOpportunities: z.boolean().optional(),
      teamInterest: z.boolean().optional(),
      applicationUpdates: z.boolean().optional(),
      messages: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
      marketingEmails: z.boolean().optional(),
    }).optional(),
    push: z.object({
      newOpportunities: z.boolean().optional(),
      teamInterest: z.boolean().optional(),
      applicationUpdates: z.boolean().optional(),
      messages: z.boolean().optional(),
      browserNotifications: z.boolean().optional(),
    }).optional(),
    inApp: z.object({
      newOpportunities: z.boolean().optional(),
      teamInterest: z.boolean().optional(),
      applicationUpdates: z.boolean().optional(),
      messages: z.boolean().optional(),
      systemAnnouncements: z.boolean().optional(),
    }).optional(),
  }).optional(),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'selective', 'private']).optional(),
    showCurrentCompany: z.boolean().optional(),
    allowDiscovery: z.boolean().optional(),
    shareAnalytics: z.boolean().optional(),
    showContactInfo: z.boolean().optional(),
    allowDirectContact: z.boolean().optional(),
    showSalaryExpectations: z.boolean().optional(),
    shareWithRecruiters: z.boolean().optional(),
  }).optional(),
  security: z.object({
    twoFactorEnabled: z.boolean().optional(),
    passwordLastChanged: z.string().nullable().optional(),
    loginAlerts: z.boolean().optional(),
    securityQuestions: z.boolean().optional(),
  }).optional(),
  theme: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    compactMode: z.boolean().optional(),
    emailDigestFrequency: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
    language: z.string().optional(),
    timezone: z.string().optional(),
    dateFormat: z.enum(['US', 'EU', 'ISO']).optional(),
    currency: z.string().optional(),
  }).optional(),
  account: z.object({
    marketingConsent: z.boolean().optional(),
    dataProcessingConsent: z.boolean().optional(),
    accountStatus: z.enum(['active', 'pending', 'suspended', 'deactivated']).optional(),
  }).optional(),
}).partial();

// GET - Retrieve user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user preferences
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Get user for additional info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastActive: true,
        twoFactorEnabled: true,
        timezone: true,
        locale: true,
      },
    });

    // If no preferences exist, create defaults
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          timezone: user?.timezone || 'America/New_York',
          language: user?.locale?.split('-')[0] || 'en',
        },
      });
    }

    // Transform to the expected format
    const settings = {
      notifications: {
        email: {
          newOpportunities: (preferences.emailNotifications as any)?.team_invites ?? true,
          teamInterest: (preferences.emailNotifications as any)?.company_interest ?? true,
          applicationUpdates: (preferences.emailNotifications as any)?.application_updates ?? true,
          messages: (preferences.emailNotifications as any)?.messages ?? true,
          weeklyDigest: (preferences.emailNotifications as any)?.weekly_digest ?? true,
          marketingEmails: (preferences.marketingPreferences as any)?.product_updates ?? false,
        },
        push: {
          newOpportunities: (preferences.pushNotifications as any)?.team_invites ?? false,
          teamInterest: (preferences.pushNotifications as any)?.company_interest ?? true,
          applicationUpdates: (preferences.pushNotifications as any)?.application_updates ?? true,
          messages: (preferences.pushNotifications as any)?.messages ?? true,
          browserNotifications: (preferences.pushNotifications as any)?.browser ?? false,
        },
        inApp: {
          newOpportunities: true,
          teamInterest: true,
          applicationUpdates: true,
          messages: true,
          systemAnnouncements: true,
        },
      },
      privacy: {
        profileVisibility: (preferences.privacySettings as any)?.profile_visibility || 'selective',
        showCurrentCompany: (preferences.privacySettings as any)?.show_current_company ?? true,
        allowDiscovery: (preferences.privacySettings as any)?.allow_discovery ?? true,
        shareAnalytics: (preferences.privacySettings as any)?.share_analytics ?? false,
        showContactInfo: (preferences.privacySettings as any)?.show_contact_info ?? false,
        allowDirectContact: (preferences.privacySettings as any)?.allow_direct_contact ?? true,
        showSalaryExpectations: (preferences.privacySettings as any)?.show_salary ?? false,
        shareWithRecruiters: (preferences.privacySettings as any)?.share_with_recruiters ?? true,
      },
      security: {
        twoFactorEnabled: user?.twoFactorEnabled || false,
        passwordLastChanged: null,
        activeSessions: [],
        loginAlerts: true,
        securityQuestions: false,
      },
      theme: {
        theme: (preferences.searchPreferences as any)?.theme || 'light',
        compactMode: (preferences.searchPreferences as any)?.compactMode || false,
        emailDigestFrequency: (preferences.searchPreferences as any)?.emailDigestFrequency || 'weekly',
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'America/New_York',
        dateFormat: preferences.dateFormat === 'DD/MM/YYYY' ? 'EU' : preferences.dateFormat === 'YYYY-MM-DD' ? 'ISO' : 'US',
        currency: preferences.currency || 'USD',
      },
      account: {
        marketingConsent: (preferences.marketingPreferences as any)?.product_updates ?? false,
        dataProcessingConsent: true,
        profileCompletion: 50, // Calculate this properly later
        accountStatus: 'active' as const,
        memberSince: user?.createdAt?.toISOString() || new Date().toISOString(),
        lastLogin: user?.lastActive?.toISOString() || null,
        emailVerified: user?.emailVerified || false,
        phoneVerified: user?.phoneVerified || false,
      },
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
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
      console.log('[Demo] Settings update simulated for demo user');
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
      });
    }

    const body = await request.json();

    // Validate input
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Get existing preferences
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    // Build update data
    const updateData: any = {};

    if (updates.notifications?.email) {
      updateData.emailNotifications = {
        ...(preferences?.emailNotifications as object || {}),
        team_invites: updates.notifications.email.newOpportunities,
        company_interest: updates.notifications.email.teamInterest,
        application_updates: updates.notifications.email.applicationUpdates,
        messages: updates.notifications.email.messages,
        weekly_digest: updates.notifications.email.weeklyDigest,
      };
    }

    if (updates.notifications?.push) {
      updateData.pushNotifications = {
        ...(preferences?.pushNotifications as object || {}),
        team_invites: updates.notifications.push.newOpportunities,
        company_interest: updates.notifications.push.teamInterest,
        application_updates: updates.notifications.push.applicationUpdates,
        messages: updates.notifications.push.messages,
        browser: updates.notifications.push.browserNotifications,
      };
    }

    if (updates.privacy) {
      updateData.privacySettings = {
        ...(preferences?.privacySettings as object || {}),
        profile_visibility: updates.privacy.profileVisibility,
        show_current_company: updates.privacy.showCurrentCompany,
        allow_discovery: updates.privacy.allowDiscovery,
        share_analytics: updates.privacy.shareAnalytics,
        show_contact_info: updates.privacy.showContactInfo,
        allow_direct_contact: updates.privacy.allowDirectContact,
        show_salary: updates.privacy.showSalaryExpectations,
        share_with_recruiters: updates.privacy.shareWithRecruiters,
      };
    }

    if (updates.theme) {
      if (updates.theme.language) updateData.language = updates.theme.language;
      if (updates.theme.timezone) updateData.timezone = updates.theme.timezone;
      if (updates.theme.currency) updateData.currency = updates.theme.currency;
      if (updates.theme.dateFormat) {
        updateData.dateFormat = updates.theme.dateFormat === 'EU' ? 'DD/MM/YYYY' :
                                 updates.theme.dateFormat === 'ISO' ? 'YYYY-MM-DD' : 'MM/DD/YYYY';
      }
      // Store theme, compactMode, emailDigestFrequency in searchPreferences JSON
      if (updates.theme.theme || updates.theme.compactMode !== undefined || updates.theme.emailDigestFrequency) {
        updateData.searchPreferences = {
          ...(preferences?.searchPreferences as object || {}),
          theme: updates.theme.theme,
          compactMode: updates.theme.compactMode,
          emailDigestFrequency: updates.theme.emailDigestFrequency,
        };
      }
    }

    if (updates.account?.marketingConsent !== undefined) {
      updateData.marketingPreferences = {
        ...(preferences?.marketingPreferences as object || {}),
        product_updates: updates.account.marketingConsent,
      };
    }

    // Upsert preferences
    await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...updateData,
      },
      update: updateData,
    });

    // Update 2FA if changed
    if (updates.security?.twoFactorEnabled !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorEnabled: updates.security.twoFactorEnabled },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
