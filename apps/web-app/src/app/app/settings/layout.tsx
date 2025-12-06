'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  SwatchIcon,
  Cog6ToothIcon,
  CircleStackIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon, description: 'Your personal information' },
  { id: 'notifications', name: 'Notifications', icon: BellIcon, description: 'Email and push preferences' },
  { id: 'privacy', name: 'Privacy', icon: EyeIcon, description: 'Visibility and data settings' },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon, description: 'Password and login' },
  { id: 'theme', name: 'Appearance', icon: SwatchIcon, description: 'Theme and display' },
  { id: 'data', name: 'Data', icon: CircleStackIcon, description: 'Export and delete your data' },
  { id: 'billing', name: 'Billing', icon: CreditCardIcon, description: 'Subscription and payments' },
  { id: 'account', name: 'Account', icon: Cog6ToothIcon, description: 'Plan and account actions' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Extract current tab from pathname
  const currentTab = pathname.split('/').pop() || 'profile';
  const isSettingsRoot = pathname === '/app/settings';
  const activeTab = isSettingsRoot ? 'profile' : currentTab;

  // Show loading only while session is loading
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-elevated rounded w-48 mb-2"></div>
          <div className="h-4 bg-bg-elevated rounded w-72 mb-8"></div>
          <div className="flex gap-8">
            <div className="w-56 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-14 bg-bg-elevated rounded"></div>
              ))}
            </div>
            <div className="flex-1">
              <div className="h-96 bg-bg-elevated rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check for session
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card text-center py-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <Cog6ToothIcon className="h-7 w-7 text-text-tertiary" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Sign in required</h2>
          <p className="text-base text-text-secondary leading-relaxed">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(`/app/settings/${tab.id}`)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 min-h-12 transition-colors duration-fast ${
                    isActive
                      ? 'bg-navy-50 text-navy'
                      : 'text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-navy' : 'text-text-tertiary'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block text-base font-bold">{tab.name}</span>
                    <span className={`block text-sm ${isActive ? 'text-navy-600' : 'text-text-tertiary'}`}>
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
