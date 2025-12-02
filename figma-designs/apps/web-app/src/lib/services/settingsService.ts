import {
  UserSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  ThemeSettings,
  AccountSettings,
  DEFAULT_USER_SETTINGS,
} from '@/types/settings';

// Helper to check if this is a demo user
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-');
};

export class SettingsService {
  private readonly DEMO_STORAGE_KEY = 'demo_user_settings';

  /**
   * Get demo user settings from localStorage
   */
  private getDemoSettings(userId: string): UserSettings | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`${this.DEMO_STORAGE_KEY}_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return {
          ...parsed,
          security: {
            ...parsed.security,
            passwordLastChanged: parsed.security?.passwordLastChanged
              ? new Date(parsed.security.passwordLastChanged)
              : null,
            activeSessions: (parsed.security?.activeSessions || []).map((s: { lastActive: string | Date; [key: string]: unknown }) => ({
              ...s,
              lastActive: new Date(s.lastActive),
            })),
          },
          account: {
            ...parsed.account,
            memberSince: new Date(parsed.account?.memberSince || Date.now()),
            lastLogin: parsed.account?.lastLogin ? new Date(parsed.account.lastLogin) : null,
          },
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Save demo user settings to localStorage
   */
  private saveDemoSettings(userId: string, settings: UserSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${this.DEMO_STORAGE_KEY}_${userId}`, JSON.stringify(settings));
      console.log('[Demo] Saved settings to localStorage');
    } catch (error) {
      console.error('[Demo] Error saving settings to localStorage:', error);
    }
  }

  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const demoSettings = this.getDemoSettings(userId);
      if (demoSettings) {
        console.log('[Demo] Retrieved settings from localStorage');
        return demoSettings;
      }
      // Return default settings for demo users
      console.log('[Demo] Returning default settings');
      return { ...DEFAULT_USER_SETTINGS };
    }

    try {
      const response = await fetch('/api/user/settings');

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get user settings');
      }

      const result = await response.json();
      const data = result.settings || result.data;

      if (!data) return null;

      // Convert date strings back to Date objects
      return this.convertDatesToObjects(data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  /**
   * Create or update user settings
   */
  async saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      this.saveDemoSettings(userId, settings);
      console.log('[Demo] Saved user settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save user settings');
      }
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    userId: string,
    notifications: Partial<NotificationSettings>
  ): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const currentSettings = this.getDemoSettings(userId) || { ...DEFAULT_USER_SETTINGS };
      const updatedSettings: UserSettings = {
        ...currentSettings,
        notifications: {
          ...currentSettings.notifications,
          ...notifications,
          email: {
            ...currentSettings.notifications.email,
            ...notifications.email,
          },
          push: {
            ...currentSettings.notifications.push,
            ...notifications.push,
          },
          inApp: {
            ...currentSettings.notifications.inApp,
            ...notifications.inApp,
          },
        },
      };
      this.saveDemoSettings(userId, updatedSettings);
      console.log('[Demo] Updated notification settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(
    userId: string,
    privacy: Partial<PrivacySettings>
  ): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const currentSettings = this.getDemoSettings(userId) || { ...DEFAULT_USER_SETTINGS };
      const updatedSettings: UserSettings = {
        ...currentSettings,
        privacy: {
          ...currentSettings.privacy,
          ...privacy,
        },
      };
      this.saveDemoSettings(userId, updatedSettings);
      console.log('[Demo] Updated privacy settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy }),
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(
    userId: string,
    security: Partial<SecuritySettings>
  ): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const currentSettings = this.getDemoSettings(userId) || { ...DEFAULT_USER_SETTINGS };
      const updatedSettings: UserSettings = {
        ...currentSettings,
        security: {
          ...currentSettings.security,
          ...security,
        },
      };
      this.saveDemoSettings(userId, updatedSettings);
      console.log('[Demo] Updated security settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ security }),
      });

      if (!response.ok) {
        throw new Error('Failed to update security settings');
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }

  /**
   * Update theme settings
   */
  async updateThemeSettings(
    userId: string,
    theme: Partial<ThemeSettings>
  ): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const currentSettings = this.getDemoSettings(userId) || { ...DEFAULT_USER_SETTINGS };
      const updatedSettings: UserSettings = {
        ...currentSettings,
        theme: {
          ...currentSettings.theme,
          ...theme,
        },
      };
      this.saveDemoSettings(userId, updatedSettings);
      console.log('[Demo] Updated theme settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error('Failed to update theme settings');
      }
    } catch (error) {
      console.error('Error updating theme settings:', error);
      throw error;
    }
  }

  /**
   * Update account settings
   */
  async updateAccountSettings(
    userId: string,
    account: Partial<AccountSettings>
  ): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      const currentSettings = this.getDemoSettings(userId) || { ...DEFAULT_USER_SETTINGS };
      const updatedSettings: UserSettings = {
        ...currentSettings,
        account: {
          ...currentSettings.account,
          ...account,
        },
      };
      this.saveDemoSettings(userId, updatedSettings);
      console.log('[Demo] Updated account settings');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      if (!response.ok) {
        throw new Error('Failed to update account settings');
      }
    } catch (error) {
      console.error('Error updating account settings:', error);
      throw error;
    }
  }

  /**
   * Delete user settings (for account deletion)
   */
  async deleteUserSettings(userId: string): Promise<void> {
    // Demo user handling
    if (isDemoEntity(userId)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${this.DEMO_STORAGE_KEY}_${userId}`);
        console.log('[Demo] Deleted user settings from localStorage');
      }
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user settings');
      }
    } catch (error) {
      console.error('Error deleting user settings:', error);
      throw error;
    }
  }

  /**
   * Initialize default settings for a new user
   */
  async initializeUserSettings(
    userId: string,
    initialData?: Partial<UserSettings>
  ): Promise<UserSettings> {
    const settings: UserSettings = {
      ...DEFAULT_USER_SETTINGS,
      ...initialData,
      account: {
        ...DEFAULT_USER_SETTINGS.account,
        ...initialData?.account,
        memberSince: new Date(),
      },
    };

    // Demo user handling - saveUserSettings already handles demo users
    await this.saveUserSettings(userId, settings);
    console.log(isDemoEntity(userId) ? '[Demo] Initialized user settings' : 'Initialized user settings');
    return settings;
  }

  /**
   * Convert date strings to Date objects
   */
  private convertDatesToObjects(settings: UserSettings): UserSettings {
    return {
      ...settings,
      security: {
        ...settings.security,
        passwordLastChanged: settings.security.passwordLastChanged
          ? this.toDate(settings.security.passwordLastChanged)
          : null,
        activeSessions: settings.security.activeSessions.map((session) => ({
          ...session,
          lastActive: this.toDate(session.lastActive),
        })),
      },
      account: {
        ...settings.account,
        memberSince: this.toDate(settings.account.memberSince),
        lastLogin: settings.account.lastLogin
          ? this.toDate(settings.account.lastLogin)
          : null,
      },
    };
  }

  /**
   * Convert various date formats to Date object
   */
  private toDate(value: unknown): Date {
    if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    return new Date(value as string | number);
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
