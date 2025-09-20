'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  EyeIcon,
  KeyIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: EyeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'account', name: 'Account', icon: KeyIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
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
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-900 hover:bg-gray-50'
                } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
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
          {activeTab === 'account' && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    title: '',
    company: '',
    location: '',
    bio: '',
    linkedin: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          This information will be displayed on your profile and may be visible to other users.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Current Company
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="company"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      newOpportunities: true,
      teamInterest: true,
      messages: true,
      weeklyDigest: false,
    },
    push: {
      newOpportunities: false,
      teamInterest: true,
      messages: true,
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to be notified about activity on the platform.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium text-gray-900 flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            Email Notifications
          </h4>
          <div className="mt-4 space-y-4">
            {Object.entries(notifications.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {key === 'newOpportunities' && 'New Liftout Opportunities'}
                    {key === 'teamInterest' && 'Team Interest & Applications'}
                    {key === 'messages' && 'Direct Messages'}
                    {key === 'weeklyDigest' && 'Weekly Digest'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'newOpportunities' && 'Get notified when relevant opportunities are posted'}
                    {key === 'teamInterest' && 'Notifications about team applications and interest'}
                    {key === 'messages' && 'Direct messages from companies or team members'}
                    {key === 'weeklyDigest' && 'Weekly summary of platform activity'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({
                    ...prev,
                    email: { ...prev.email, [key]: !value }
                  }))}
                  className={`${
                    value ? 'bg-primary-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  <span
                    className={`${
                      value ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'selective',
    showCompany: true,
    allowDiscovery: true,
    shareAnalytics: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Control who can see your information and how it's used.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
            Profile Visibility
          </label>
          <div className="mt-1">
            <select
              id="visibility"
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="public">Public - Visible to all users</option>
              <option value="selective">Selective - Only to verified companies</option>
              <option value="private">Private - Only to direct connections</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'showCompany', label: 'Show Current Company', desc: 'Display your current employer on your profile' },
            { key: 'allowDiscovery', label: 'Allow Discovery', desc: 'Let companies find your team through search and matching' },
            { key: 'shareAnalytics', label: 'Share Usage Analytics', desc: 'Help improve the platform by sharing anonymous usage data' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`${
                  privacy[item.key as keyof typeof privacy] ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                <span
                  className={`${
                    privacy[item.key as keyof typeof privacy] ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and authentication preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900">Change Password</h4>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update your password to keep your account secure.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Add an extra layer of security to your account.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-primary-600 border border-transparent rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900">Active Sessions</h4>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage your active sessions across different devices.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and data.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900">Export Account Data</h4>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Download a copy of your account data including profile, applications, and messages.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Request Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900">Deactivate Account</h4>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Temporarily deactivate your account. You can reactivate it at any time.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-yellow-600 border border-transparent rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}