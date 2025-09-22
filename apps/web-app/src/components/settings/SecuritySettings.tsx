'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function PasswordChangeForm({ onCancel, onSuccess }: PasswordChangeFormProps) {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would call your API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Password updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="current-password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            required
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          >
            {showPasswords.current ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="new-password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            required
            minLength={8}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          >
            {showPasswords.new ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters with a mix of letters, numbers, and symbols
        </p>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirm-password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            required
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          >
            {showPasswords.confirm ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}

export function SecuritySettings() {
  const { user } = useAuth();
  const { settings, updateSecuritySettings, isLoading } = useSettings();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  // Mock session data - in a real app, this would come from your API
  const mockSessions = [
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'New York, NY',
      lastActive: new Date(),
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'New York, NY',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: false,
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Edge 120.0',
      location: 'Boston, MA',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      current: false,
    },
  ];

  const handleTwoFactorToggle = async () => {
    try {
      if (settings.security.twoFactorEnabled) {
        // Disable 2FA
        await updateSecuritySettings({ twoFactorEnabled: false });
        toast.success('Two-factor authentication disabled');
      } else {
        // Enable 2FA - in a real app, this would show a QR code setup flow
        toast.success('Two-factor authentication setup would begin here');
        // For demo purposes, just enable it
        await updateSecuritySettings({ twoFactorEnabled: true });
      }
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      // In a real app, this would call your API to end the session
      toast.success('Session ended successfully');
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const handleEndAllSessions = async () => {
    try {
      // In a real app, this would call your API to end all other sessions
      toast.success('All other sessions ended successfully');
    } catch (error) {
      toast.error('Failed to end sessions');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6 mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and authentication preferences.
        </p>
      </div>

      {/* Security Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <h4 className="text-lg font-medium text-gray-900">Security Status</h4>
            <p className="text-sm text-gray-500">Your account security is good</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Strong password</span>
          </div>
          <div className="flex items-center">
            {settings.security.twoFactorEnabled ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            )}
            <span className="text-sm text-gray-700">
              Two-factor auth {settings.security.twoFactorEnabled ? 'enabled' : 'disabled'}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Account verified</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-base font-medium text-gray-900">Password</h4>
            </div>
            <div className="text-sm text-gray-500">
              Last changed: {settings.security.passwordLastChanged 
                ? new Date(settings.security.passwordLastChanged).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          {!showPasswordForm ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Update your password to keep your account secure. Choose a strong password that you don't use elsewhere.
              </p>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            </div>
          ) : (
            <PasswordChangeForm
              onCancel={() => setShowPasswordForm(false)}
              onSuccess={() => {
                setShowPasswordForm(false);
                updateSecuritySettings({ passwordLastChanged: new Date() });
              }}
            />
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 font-medium">
                {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-gray-500">
                {settings.security.twoFactorEnabled 
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                settings.security.twoFactorEnabled
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {settings.security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-base font-medium text-gray-900">Active Sessions</h4>
            </div>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {showSessions ? 'Hide' : 'View'} Sessions
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-4">
            Manage your active sessions across different devices and browsers.
          </p>
          
          {showSessions && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  {mockSessions.length} active sessions
                </span>
                <button
                  onClick={handleEndAllSessions}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  End all other sessions
                </button>
              </div>
              
              <div className="space-y-3">
                {mockSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {session.device.includes('iPhone') || session.device.includes('Android') ? (
                          <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ComputerDesktopIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{session.device}</p>
                          {session.current && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{session.browser}</span>
                          <span className="mx-2">•</span>
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{session.location}</span>
                          <span className="mx-2">•</span>
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>
                            {session.current 
                              ? 'Active now' 
                              : `${Math.floor((Date.now() - session.lastActive.getTime()) / (1000 * 60 * 60))}h ago`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="text-red-600 hover:text-red-500 p-1"
                        title="End session"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Security Best Practices
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Use a unique, strong password for your Liftout account</li>
                <li>Enable two-factor authentication for extra security</li>
                <li>Review your active sessions regularly</li>
                <li>Log out from public or shared computers</li>
                <li>Keep your contact information up to date</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}