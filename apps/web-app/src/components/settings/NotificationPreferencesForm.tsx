'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`${
        enabled ? 'bg-navy' : 'bg-bg-alt'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy min-h-12 min-w-14 items-center`}
      disabled={disabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-0'
        } pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow transform ring-0 transition duration-base`}
      />
    </button>
  );
}

interface NotificationPreferences {
  newMessages: boolean;
  applicationUpdates: boolean;
  teamInvites: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export function NotificationPreferencesForm() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newMessages: true,
    applicationUpdates: true,
    teamInvites: true,
    marketingEmails: false,
    weeklyDigest: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.preferences) {
            setPreferences(data.preferences);
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        toast.error('Failed to load notification preferences');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Auto-save preferences when they change
  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    // Optimistically update UI
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // Save to backend
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Preference saved', {
          duration: 2000,
          icon: '✓',
        });
      }
    } catch (error) {
      console.error('Failed to save preference:', error);
      // Revert optimistic update on error
      setPreferences(preferences);
      toast.error('Failed to save preference');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: 'newMessages' as const,
      title: 'New messages',
      description: 'Get notified when you receive new messages from companies or team members',
      icon: EnvelopeIcon,
    },
    {
      key: 'applicationUpdates' as const,
      title: 'Application updates',
      description: 'Status updates on your liftout applications and interview schedules',
      icon: BellIcon,
    },
    {
      key: 'teamInvites' as const,
      title: 'Team invites',
      description: 'Notifications when you are invited to join a team or when team members respond',
      icon: BellIcon,
    },
    {
      key: 'marketingEmails' as const,
      title: 'Marketing emails',
      description: 'Information about new features, platform updates, and industry insights',
      icon: EnvelopeIcon,
    },
    {
      key: 'weeklyDigest' as const,
      title: 'Weekly digest',
      description: 'Weekly summary of platform activity, new opportunities, and team updates',
      icon: EnvelopeIcon,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bg-alt rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-bg-alt rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-bg-alt rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-bg-alt rounded w-2/3"></div>
                </div>
                <div className="w-14 h-8 bg-bg-alt rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Notification preferences</h3>
        <p className="mt-1 text-sm font-normal text-text-secondary leading-relaxed">
          Choose how you want to be notified about liftout activities and platform updates.
        </p>
      </div>

      {/* Saving indicator */}
      {isSaving && (
        <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
          <div className="flex gap-3 items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-navy animate-pulse" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-navy-900">
              Saving...
            </p>
          </div>
        </div>
      )}

      {/* Notification Options */}
      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.key}
              className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast min-h-20"
            >
              <div className="flex items-start gap-3 flex-1 mr-4">
                <div className="flex-shrink-0 mt-1">
                  <Icon className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-text-primary">{option.title}</p>
                  <p className="text-sm font-normal text-text-secondary">{option.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences[option.key]}
                onChange={(value) => updatePreference(option.key, value)}
                disabled={isSaving}
              />
            </div>
          );
        })}
      </div>

      {/* Information callout */}
      <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <BellIcon className="h-5 w-5 text-navy" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-900">
              About notifications
            </h3>
            <p className="mt-1 text-sm font-normal text-navy-700 leading-relaxed">
              Preferences are automatically saved when you toggle them. Critical account security notifications will always be sent regardless of your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
