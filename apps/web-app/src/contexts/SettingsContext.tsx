'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  UserSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  ThemeSettings,
  AccountSettings,
  DEFAULT_USER_SETTINGS,
} from '@/types/settings';
import { toast } from 'react-hot-toast';

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => Promise<void>;
  updateAccountSettings: (settings: Partial<AccountSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load user settings from API
  const loadUserSettings = useCallback(async () => {
    if (!user) {
      setSettings(DEFAULT_USER_SETTINGS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/settings');

      if (response.ok) {
        const data = await response.json();
        // Convert date strings back to Date objects
        const loadedSettings: UserSettings = {
          ...DEFAULT_USER_SETTINGS,
          ...data,
          security: {
            ...DEFAULT_USER_SETTINGS.security,
            ...data.security,
            passwordLastChanged: data.security?.passwordLastChanged
              ? new Date(data.security.passwordLastChanged)
              : null,
          },
          account: {
            ...DEFAULT_USER_SETTINGS.account,
            ...data.account,
            memberSince: data.account?.memberSince
              ? new Date(data.account.memberSince)
              : new Date(),
            lastLogin: data.account?.lastLogin
              ? new Date(data.account.lastLogin)
              : null,
          },
        };
        setSettings(loadedSettings);
        // Save to localStorage as backup
        localStorage.setItem(`settings_${user.id}`, JSON.stringify(loadedSettings));
      } else {
        // Fall back to localStorage
        const storedSettings = localStorage.getItem(`settings_${user.id}`);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          setSettings({
            ...DEFAULT_USER_SETTINGS,
            ...parsed,
            security: {
              ...DEFAULT_USER_SETTINGS.security,
              ...parsed.security,
              passwordLastChanged: parsed.security?.passwordLastChanged
                ? new Date(parsed.security.passwordLastChanged)
                : null,
            },
            account: {
              ...DEFAULT_USER_SETTINGS.account,
              ...parsed.account,
              memberSince: parsed.account?.memberSince
                ? new Date(parsed.account.memberSince)
                : new Date(),
              lastLogin: parsed.account?.lastLogin
                ? new Date(parsed.account.lastLogin)
                : null,
            },
          });
        } else {
          setSettings(DEFAULT_USER_SETTINGS);
        }
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
      // Fall back to localStorage if API fails
      try {
        const storedSettings = localStorage.getItem(`settings_${user.id}`);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          setSettings({
            ...DEFAULT_USER_SETTINGS,
            ...parsed,
          });
        } else {
          setSettings(DEFAULT_USER_SETTINGS);
        }
      } catch {
        setSettings(DEFAULT_USER_SETTINGS);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load settings when user changes
  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  // Save settings to API
  const saveSettings = async (newSettings: UserSettings) => {
    if (!user) return;

    // Optimistic update
    setSettings(newSettings);
    // Save to localStorage as backup
    localStorage.setItem(`settings_${user.id}`, JSON.stringify(newSettings));

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings to API:', error);
      // Settings are already saved to localStorage as backup
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (notificationUpdates: Partial<NotificationSettings>) => {
    try {
      const newSettings = {
        ...settings,
        notifications: {
          ...settings.notifications,
          ...notificationUpdates,
          email: { ...settings.notifications.email, ...notificationUpdates.email },
          push: { ...settings.notifications.push, ...notificationUpdates.push },
          inApp: { ...settings.notifications.inApp, ...notificationUpdates.inApp },
        },
      };

      await saveSettings(newSettings);
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update notification settings');
      throw error;
    }
  };

  // Update privacy settings
  const updatePrivacySettings = async (privacyUpdates: Partial<PrivacySettings>) => {
    try {
      const newSettings = {
        ...settings,
        privacy: { ...settings.privacy, ...privacyUpdates },
      };

      await saveSettings(newSettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
      throw error;
    }
  };

  // Update security settings
  const updateSecuritySettings = async (securityUpdates: Partial<SecuritySettings>) => {
    try {
      const newSettings = {
        ...settings,
        security: { ...settings.security, ...securityUpdates },
      };

      await saveSettings(newSettings);
      toast.success('Security settings updated');
    } catch (error) {
      toast.error('Failed to update security settings');
      throw error;
    }
  };

  // Update theme settings
  const updateThemeSettings = async (themeUpdates: Partial<ThemeSettings>) => {
    try {
      const newSettings = {
        ...settings,
        theme: { ...settings.theme, ...themeUpdates },
      };

      await saveSettings(newSettings);
      toast.success('Theme settings updated');

      // Apply theme changes immediately
      if (themeUpdates.theme) {
        applyTheme(themeUpdates.theme);
      }
    } catch (error) {
      toast.error('Failed to update theme settings');
      throw error;
    }
  };

  // Update account settings
  const updateAccountSettings = async (accountUpdates: Partial<AccountSettings>) => {
    try {
      const newSettings = {
        ...settings,
        account: { ...settings.account, ...accountUpdates },
      };

      await saveSettings(newSettings);
      toast.success('Account settings updated');
    } catch (error) {
      toast.error('Failed to update account settings');
      throw error;
    }
  };

  // Reset all settings to defaults
  const resetSettings = async () => {
    try {
      await saveSettings(DEFAULT_USER_SETTINGS);
      toast.success('Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings');
      throw error;
    }
  };

  // Export settings as JSON
  const exportSettings = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  // Import settings from JSON
  const importSettings = async (settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson);

      // Validate the structure
      if (!importedSettings.notifications || !importedSettings.privacy) {
        throw new Error('Invalid settings format');
      }

      const newSettings = {
        ...DEFAULT_USER_SETTINGS,
        ...importedSettings,
        account: {
          ...settings.account, // Keep current account info
          ...importedSettings.account,
          memberSince: settings.account.memberSince, // Don't overwrite join date
        },
      };

      await saveSettings(newSettings);
      toast.success('Settings imported successfully');
    } catch (error) {
      console.error('Failed to import settings:', error);
      toast.error('Failed to import settings. Please check the format.');
      throw error;
    }
  };

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  // Apply theme on load
  useEffect(() => {
    if (!isLoading) {
      applyTheme(settings.theme.theme);
    }
  }, [settings.theme.theme, isLoading]);

  const value: SettingsContextType = {
    settings,
    isLoading,
    updateNotificationSettings,
    updatePrivacySettings,
    updateSecuritySettings,
    updateThemeSettings,
    updateAccountSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
