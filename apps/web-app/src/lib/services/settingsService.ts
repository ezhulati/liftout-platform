import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  UserSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  ThemeSettings,
  AccountSettings,
  DEFAULT_USER_SETTINGS,
} from '@/types/settings';

const SETTINGS_COLLECTION = 'userSettings';

export class SettingsService {
  /**
   * Get user settings from Firestore
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore timestamps back to Date objects
        return this.convertTimestampsToDate(data as UserSettings);
      }

      return null;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  /**
   * Create or update user settings
   */
  async saveUserSettings(userId: string, settings: UserSettings): Promise<void> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      await setDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp(),
      });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentSettings = docSnap.data() as UserSettings;
        await updateDoc(docRef, {
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
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create settings if they don't exist
        await this.saveUserSettings(userId, {
          ...DEFAULT_USER_SETTINGS,
          notifications: {
            ...DEFAULT_USER_SETTINGS.notifications,
            ...notifications,
          },
        });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentSettings = docSnap.data() as UserSettings;
        await updateDoc(docRef, {
          privacy: {
            ...currentSettings.privacy,
            ...privacy,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        await this.saveUserSettings(userId, {
          ...DEFAULT_USER_SETTINGS,
          privacy: {
            ...DEFAULT_USER_SETTINGS.privacy,
            ...privacy,
          },
        });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentSettings = docSnap.data() as UserSettings;
        await updateDoc(docRef, {
          security: {
            ...currentSettings.security,
            ...security,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        await this.saveUserSettings(userId, {
          ...DEFAULT_USER_SETTINGS,
          security: {
            ...DEFAULT_USER_SETTINGS.security,
            ...security,
          },
        });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentSettings = docSnap.data() as UserSettings;
        await updateDoc(docRef, {
          theme: {
            ...currentSettings.theme,
            ...theme,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        await this.saveUserSettings(userId, {
          ...DEFAULT_USER_SETTINGS,
          theme: {
            ...DEFAULT_USER_SETTINGS.theme,
            ...theme,
          },
        });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentSettings = docSnap.data() as UserSettings;
        await updateDoc(docRef, {
          account: {
            ...currentSettings.account,
            ...account,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        await this.saveUserSettings(userId, {
          ...DEFAULT_USER_SETTINGS,
          account: {
            ...DEFAULT_USER_SETTINGS.account,
            ...account,
          },
        });
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
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, userId);
      await deleteDoc(docRef);
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

    await this.saveUserSettings(userId, settings);
    return settings;
  }

  /**
   * Convert Firestore timestamps to Date objects
   */
  private convertTimestampsToDate(settings: UserSettings): UserSettings {
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
   * Convert Firestore timestamp or date to Date object
   */
  private toDate(value: any): Date {
    if (value?.toDate) {
      return value.toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    return new Date(value);
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
