'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  EyeIcon,
  KeyIcon,
  SwatchIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';

export default function SettingsPage() {
  const { user } = useAuth();
  const { isLoading } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: EyeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'theme', name: 'Theme & UI', icon: SwatchIcon },
    { id: 'account', name: 'Account', icon: Cog6ToothIcon },
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-text-tertiary">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-elevated rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-bg-elevated rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-bg-elevated rounded"></div>
              ))}
            </div>
            <div className="col-span-9">
              <div className="h-64 bg-bg-elevated rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-navy-50 border-navy text-navy'
                    : 'border-transparent text-text-primary hover:bg-bg-elevated'
                } group border-l-4 px-3 py-2.5 flex items-center text-sm font-medium w-full min-h-[44px] transition-colors duration-fast`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-navy' : 'text-text-tertiary'
                  } flex-shrink-0 -ml-1 mr-3 h-5 w-5`}
                  aria-hidden="true"
                />
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'theme' && <ThemeSettings />}
          {activeTab === 'account' && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}

