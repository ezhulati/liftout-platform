'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { SectionCard, SettingToggle, LoadingSpinner } from '@/components/admin/shared';

// ============================================
// TYPES & CONFIGURATION
// ============================================

interface Settings {
  requireEmailVerification: boolean;
  autoApproveTeams: boolean;
  autoApproveCompanies: boolean;
  moderationEnabled: boolean;
  emailNotifications: boolean;
  slackNotifications: boolean;
  maintenanceMode: boolean;
}

interface SettingConfig {
  key: keyof Settings;
  title: string;
  description: string;
  dangerous?: boolean;
}

interface SettingsSectionConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
  settings: SettingConfig[];
}

const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  {
    title: 'Verification Settings',
    icon: Cog6ToothIcon,
    iconColorClass: 'text-gray-400',
    settings: [
      {
        key: 'requireEmailVerification',
        title: 'Require Email Verification',
        description: 'Users must verify their email before accessing the platform',
      },
      {
        key: 'autoApproveTeams',
        title: 'Auto-Approve Teams',
        description: 'Automatically approve team verification requests',
      },
      {
        key: 'autoApproveCompanies',
        title: 'Auto-Approve Companies',
        description: 'Automatically approve company verification requests',
      },
    ],
  },
  {
    title: 'Moderation Settings',
    icon: KeyIcon,
    iconColorClass: 'text-gray-400',
    settings: [
      {
        key: 'moderationEnabled',
        title: 'Content Moderation',
        description: 'Enable automated content moderation and flagging',
      },
    ],
  },
  {
    title: 'Notification Settings',
    icon: BellIcon,
    iconColorClass: 'text-gray-400',
    settings: [
      {
        key: 'emailNotifications',
        title: 'Email Notifications',
        description: 'Receive email alerts for critical admin events',
      },
      {
        key: 'slackNotifications',
        title: 'Slack Notifications',
        description: 'Send notifications to a Slack channel',
      },
    ],
  },
  {
    title: 'Platform Settings',
    icon: GlobeAltIcon,
    iconColorClass: 'text-gray-400',
    settings: [
      {
        key: 'maintenanceMode',
        title: 'Maintenance Mode',
        description: 'Put the platform in maintenance mode (users will see a maintenance page)',
        dangerous: true,
      },
    ],
  },
];

const DEFAULT_SETTINGS: Settings = {
  requireEmailVerification: true,
  autoApproveTeams: false,
  autoApproveCompanies: false,
  moderationEnabled: true,
  emailNotifications: true,
  slackNotifications: false,
  maintenanceMode: false,
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      const fetchedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
      setSettings(fetchedSettings);
      setOriginalSettings(fetchedSettings);
    } catch (err) {
      console.error('Settings fetch error:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(originalSettings));
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setOriginalSettings(settings);
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Settings save error:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

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
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
            hasChanges && !saving
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              {!hasChanges && <CheckCircleIcon className="h-4 w-4" />}
              {hasChanges ? 'Save Changes' : 'Saved'}
            </>
          )}
        </button>
      </div>

      {/* Account info */}
      <SectionCard title="Admin Account" icon={ShieldCheckIcon} iconColorClass="text-red-500">
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <p className="text-green-400 flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              Active
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Settings sections - rendered from config */}
      {SETTINGS_SECTIONS.map((section) => (
        <SectionCard
          key={section.title}
          title={section.title}
          icon={section.icon}
          iconColorClass={section.iconColorClass}
        >
          <div className="space-y-4">
            {section.settings.map((setting) => (
              <SettingToggle
                key={setting.key}
                title={setting.title}
                description={setting.description}
                enabled={settings[setting.key]}
                onToggle={() => handleToggle(setting.key)}
                dangerous={setting.dangerous}
              />
            ))}
          </div>
        </SectionCard>
      ))}

      {/* Unsaved changes warning */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-400 text-sm flex items-center gap-2">
          <span>You have unsaved changes</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="ml-2 px-3 py-1 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Now'}
          </button>
        </div>
      )}
    </div>
  );
}
