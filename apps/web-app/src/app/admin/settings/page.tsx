'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    requireEmailVerification: true,
    autoApproveTeams: false,
    autoApproveCompanies: false,
    moderationEnabled: true,
    emailNotifications: true,
    slackNotifications: false,
    maintenanceMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    // In production, save to API
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
          <p className="mt-1 text-sm text-gray-400">
            Configure platform settings and admin preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          {saved ? (
            <>
              <CheckCircleIcon className="h-4 w-4" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-red-500" />
          Admin Account
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <p className="text-white">{session?.user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <p className="text-white">
              {session?.user?.firstName} {session?.user?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <p className="text-white">Super Admin</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">2FA Status</label>
            <p className="text-green-400 flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              Enabled
            </p>
          </div>
        </div>
      </div>

      {/* Verification settings */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
          Verification Settings
        </h2>
        <div className="space-y-4">
          <SettingToggle
            title="Require Email Verification"
            description="Users must verify their email before accessing the platform"
            enabled={settings.requireEmailVerification}
            onToggle={() => handleToggle('requireEmailVerification')}
          />
          <SettingToggle
            title="Auto-Approve Teams"
            description="Automatically approve team verification requests"
            enabled={settings.autoApproveTeams}
            onToggle={() => handleToggle('autoApproveTeams')}
          />
          <SettingToggle
            title="Auto-Approve Companies"
            description="Automatically approve company verification requests"
            enabled={settings.autoApproveCompanies}
            onToggle={() => handleToggle('autoApproveCompanies')}
          />
        </div>
      </div>

      {/* Moderation settings */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-gray-400" />
          Moderation Settings
        </h2>
        <div className="space-y-4">
          <SettingToggle
            title="Content Moderation"
            description="Enable automated content moderation and flagging"
            enabled={settings.moderationEnabled}
            onToggle={() => handleToggle('moderationEnabled')}
          />
        </div>
      </div>

      {/* Notification settings */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-gray-400" />
          Notification Settings
        </h2>
        <div className="space-y-4">
          <SettingToggle
            title="Email Notifications"
            description="Receive email alerts for critical admin events"
            enabled={settings.emailNotifications}
            onToggle={() => handleToggle('emailNotifications')}
          />
          <SettingToggle
            title="Slack Notifications"
            description="Send notifications to a Slack channel"
            enabled={settings.slackNotifications}
            onToggle={() => handleToggle('slackNotifications')}
          />
        </div>
      </div>

      {/* Platform settings */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          Platform Settings
        </h2>
        <div className="space-y-4">
          <SettingToggle
            title="Maintenance Mode"
            description="Put the platform in maintenance mode (users will see a maintenance page)"
            enabled={settings.maintenanceMode}
            onToggle={() => handleToggle('maintenanceMode')}
            dangerous
          />
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onToggle,
  dangerous = false,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  dangerous?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={`text-sm font-medium ${dangerous ? 'text-red-400' : 'text-white'}`}>
          {title}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? (dangerous ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
