import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, AdminUser } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Default settings with their initial values
const DEFAULT_SETTINGS = {
  requireEmailVerification: { value: true, category: 'verification', description: 'Require email verification for new users' },
  autoApproveTeams: { value: false, category: 'verification', description: 'Auto-approve team verification requests' },
  autoApproveCompanies: { value: false, category: 'verification', description: 'Auto-approve company verification requests' },
  moderationEnabled: { value: true, category: 'moderation', description: 'Enable content moderation and flagging' },
  emailNotifications: { value: true, category: 'notifications', description: 'Send email alerts for critical events' },
  slackNotifications: { value: false, category: 'notifications', description: 'Send notifications to Slack' },
  maintenanceMode: { value: false, category: 'platform', description: 'Put platform in maintenance mode' },
};

// GET - Fetch all admin settings
export const GET = withAdminAccess(async () => {
  try {
    // Fetch all settings from database
    const dbSettings = await prisma.adminSetting.findMany();

    // Build settings object with defaults
    const settings: Record<string, boolean> = {};

    for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
      const dbSetting = dbSettings.find((s) => s.key === key);
      settings[key] = dbSetting ? (dbSetting.value as boolean) : config.value;
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
});

// POST - Update admin settings
export const POST = withAdminAccess(async (req: NextRequest, admin: AdminUser) => {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Update each setting
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      if (key in DEFAULT_SETTINGS) {
        const defaultConfig = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
        updates.push(
          prisma.adminSetting.upsert({
            where: { key },
            create: {
              key,
              value: value as boolean,
              category: defaultConfig.category,
              description: defaultConfig.description,
              updatedBy: admin.id,
            },
            update: {
              value: value as boolean,
              updatedBy: admin.id,
            },
          })
        );
      }
    }

    await Promise.all(updates);

    // Log the settings update
    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        actorType: 'admin',
        action: 'settings.update',
        actionCategory: 'settings',
        resourceType: 'admin_settings',
        newValues: settings,
      },
    });

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
});
