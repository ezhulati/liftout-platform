'use client';

import { useSettings } from '@/contexts/SettingsContext';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { NotificationSettings as NotificationSettingsType } from '@/types/settings';
import { PushNotificationSettings } from './PushNotificationSettings';

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

export function NotificationSettings() {
  const { settings, updateNotificationSettings, isLoading } = useSettings();

  const handleEmailToggle = (key: keyof NotificationSettingsType['email'], value: boolean) => {
    updateNotificationSettings({
      email: { ...settings.notifications.email, [key]: value }
    });
  };

  const handlePushToggle = (key: keyof NotificationSettingsType['push'], value: boolean) => {
    updateNotificationSettings({
      push: { ...settings.notifications.push, [key]: value }
    });
  };

  const handleInAppToggle = (key: keyof NotificationSettingsType['inApp'], value: boolean) => {
    updateNotificationSettings({
      inApp: { ...settings.notifications.inApp, [key]: value }
    });
  };

  const emailNotifications = [
    {
      key: 'newOpportunities' as const,
      title: 'New Liftout Opportunities',
      description: 'Get notified when relevant liftout opportunities are posted that match your profile',
    },
    {
      key: 'teamInterest' as const,
      title: 'Team Interest & Applications',
      description: 'Notifications about companies showing interest in your team or team applications',
    },
    {
      key: 'applicationUpdates' as const,
      title: 'Application Updates',
      description: 'Status updates on your liftout applications and interview schedules',
    },
    {
      key: 'messages' as const,
      title: 'Direct Messages',
      description: 'Direct messages from companies, recruiters, or team members',
    },
    {
      key: 'weeklyDigest' as const,
      title: 'Weekly Digest',
      description: 'Weekly summary of platform activity, new opportunities, and team updates',
    },
    {
      key: 'marketingEmails' as const,
      title: 'Marketing & Product Updates',
      description: 'Information about new features, platform updates, and industry insights',
    },
  ];

  const pushNotifications = [
    {
      key: 'newOpportunities' as const,
      title: 'New Opportunities',
      description: 'Instant alerts for high-priority liftout opportunities',
    },
    {
      key: 'teamInterest' as const,
      title: 'Team Interest',
      description: 'Push notifications when companies express interest in your team',
    },
    {
      key: 'applicationUpdates' as const,
      title: 'Application Updates',
      description: 'Important updates on your applications and interviews',
    },
    {
      key: 'messages' as const,
      title: 'Messages',
      description: 'Push notifications for urgent messages',
    },
    {
      key: 'browserNotifications' as const,
      title: 'Browser Notifications',
      description: 'Allow browser notifications when the app is open',
    },
  ];

  const inAppNotifications = [
    {
      key: 'newOpportunities' as const,
      title: 'New Opportunities',
      description: 'Show in-app notifications for new liftout opportunities',
    },
    {
      key: 'teamInterest' as const,
      title: 'Team Interest',
      description: 'In-app notifications for team interest and applications',
    },
    {
      key: 'applicationUpdates' as const,
      title: 'Application Updates',
      description: 'In-app updates on application status and next steps',
    },
    {
      key: 'messages' as const,
      title: 'Messages',
      description: 'In-app notifications for new messages',
    },
    {
      key: 'systemAnnouncements' as const,
      title: 'System Announcements',
      description: 'Important platform announcements and maintenance notices',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-bg-alt rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-bg-alt rounded w-2/3 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6">
              <div className="h-5 bg-bg-alt rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="h-4 bg-bg-alt rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-bg-alt rounded w-2/3"></div>
                    </div>
                    <div className="w-11 h-6 bg-bg-alt rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Browser Push Notifications */}
      <PushNotificationSettings />

      {/* Header - Practical UI: bold headings, regular body */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Notification preferences</h3>
        <p className="mt-1 text-sm font-normal text-text-secondary leading-relaxed">
          Choose how you want to be notified about liftout activities and platform updates.
        </p>
      </div>

      {/* Quick Actions - Practical UI: bold section headings */}
      <div className="bg-bg-alt rounded-xl p-4">
        <h4 className="text-sm font-bold text-text-primary mb-3">Quick actions</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => updateNotificationSettings({
              email: Object.keys(settings.notifications.email).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {} as any),
              push: Object.keys(settings.notifications.push).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {} as any),
              inApp: Object.keys(settings.notifications.inApp).reduce((acc, key) => ({
                ...acc,
                [key]: true
              }), {} as any),
            })}
            className="inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-success-dark bg-success-light hover:bg-success-light/80 min-h-12"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Enable all
          </button>
          <button
            onClick={() => updateNotificationSettings({
              email: Object.keys(settings.notifications.email).reduce((acc, key) => ({
                ...acc,
                [key]: false
              }), {} as any),
              push: Object.keys(settings.notifications.push).reduce((acc, key) => ({
                ...acc,
                [key]: false
              }), {} as any),
              inApp: Object.keys(settings.notifications.inApp).reduce((acc, key) => ({
                ...acc,
                [key]: false
              }), {} as any),
            })}
            className="inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-error-dark bg-error-light hover:bg-error-light/80 min-h-12"
          >
            <XCircleIcon className="h-5 w-5 mr-2" />
            Disable all
          </button>
        </div>
      </div>

      {/* Email Notifications - Practical UI: bold headings, regular descriptions */}
      <div className="space-y-4">
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-text-tertiary mr-2" aria-hidden="true" />
          <h4 className="text-base font-bold text-text-primary">Email notifications</h4>
        </div>
        <div className="space-y-4">
          {emailNotifications.map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast min-h-20">
              <div className="flex-1 mr-4">
                <p className="text-base font-bold text-text-primary">{notification.title}</p>
                <p className="text-sm font-normal text-text-secondary">{notification.description}</p>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.email[notification.key]}
                onChange={(value) => handleEmailToggle(notification.key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications - Practical UI: bold headings, regular descriptions */}
      <div className="space-y-4">
        <div className="flex items-center">
          <DevicePhoneMobileIcon className="h-5 w-5 text-text-tertiary mr-2" aria-hidden="true" />
          <h4 className="text-base font-bold text-text-primary">Push notifications</h4>
        </div>
        <div className="space-y-4">
          {pushNotifications.map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast min-h-20">
              <div className="flex-1 mr-4">
                <p className="text-base font-bold text-text-primary">{notification.title}</p>
                <p className="text-sm font-normal text-text-secondary">{notification.description}</p>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.push[notification.key]}
                onChange={(value) => handlePushToggle(notification.key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* In-App Notifications - Practical UI: bold headings, regular descriptions */}
      <div className="space-y-4">
        <div className="flex items-center">
          <BellIcon className="h-5 w-5 text-text-tertiary mr-2" aria-hidden="true" />
          <h4 className="text-base font-bold text-text-primary">In-app notifications</h4>
        </div>
        <div className="space-y-4">
          {inAppNotifications.map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast min-h-20">
              <div className="flex-1 mr-4">
                <p className="text-base font-bold text-text-primary">{notification.title}</p>
                <p className="text-sm font-normal text-text-secondary">{notification.description}</p>
              </div>
              <ToggleSwitch
                enabled={settings.notifications.inApp[notification.key]}
                onChange={(value) => handleInAppToggle(notification.key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Information - Practical UI: info callout */}
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
              You can adjust these settings at any time. Critical account security notifications will always be sent regardless of your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}