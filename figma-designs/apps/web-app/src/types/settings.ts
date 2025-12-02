export interface NotificationSettings {
  email: {
    newOpportunities: boolean;
    teamInterest: boolean;
    applicationUpdates: boolean;
    messages: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
  };
  push: {
    newOpportunities: boolean;
    teamInterest: boolean;
    applicationUpdates: boolean;
    messages: boolean;
    browserNotifications: boolean;
  };
  inApp: {
    newOpportunities: boolean;
    teamInterest: boolean;
    applicationUpdates: boolean;
    messages: boolean;
    systemAnnouncements: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'selective' | 'private';
  showCurrentCompany: boolean;
  allowDiscovery: boolean;
  shareAnalytics: boolean;
  showContactInfo: boolean;
  allowDirectContact: boolean;
  showSalaryExpectations: boolean;
  shareWithRecruiters: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: Date | null;
  activeSessions: SessionInfo[];
  loginAlerts: boolean;
  securityQuestions: boolean;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: Date;
  current: boolean;
}

export interface ThemeSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  language: string;
  timezone: string;
  dateFormat: 'US' | 'EU' | 'ISO';
  currency: string;
}

export interface AccountSettings {
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
  profileCompletion: number;
  accountStatus: 'active' | 'pending' | 'suspended' | 'deactivated';
  memberSince: Date;
  lastLogin: Date | null;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  theme: ThemeSettings;
  account: AccountSettings;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email: {
    newOpportunities: true,
    teamInterest: true,
    applicationUpdates: true,
    messages: true,
    weeklyDigest: true,
    marketingEmails: false,
  },
  push: {
    newOpportunities: false,
    teamInterest: true,
    applicationUpdates: true,
    messages: true,
    browserNotifications: false,
  },
  inApp: {
    newOpportunities: true,
    teamInterest: true,
    applicationUpdates: true,
    messages: true,
    systemAnnouncements: true,
  },
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'selective',
  showCurrentCompany: true,
  allowDiscovery: true,
  shareAnalytics: false,
  showContactInfo: false,
  allowDirectContact: true,
  showSalaryExpectations: false,
  shareWithRecruiters: true,
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  passwordLastChanged: null,
  activeSessions: [],
  loginAlerts: true,
  securityQuestions: false,
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  theme: 'light',
  compactMode: false,
  emailDigestFrequency: 'weekly',
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'US',
  currency: 'USD',
};

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  marketingConsent: false,
  dataProcessingConsent: true,
  profileCompletion: 0,
  accountStatus: 'active',
  memberSince: new Date(),
  lastLogin: null,
  emailVerified: false,
  phoneVerified: false,
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  privacy: DEFAULT_PRIVACY_SETTINGS,
  security: DEFAULT_SECURITY_SETTINGS,
  theme: DEFAULT_THEME_SETTINGS,
  account: DEFAULT_ACCOUNT_SETTINGS,
};