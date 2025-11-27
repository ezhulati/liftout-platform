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
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField
        label="Current password"
        name="current-password"
        required
      >
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="current-password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            required
            className="input-field pr-12"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
            aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
          >
            {showPasswords.current ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </FormField>

      <FormField
        label="New password"
        name="new-password"
        required
        hint="Must be at least 8 characters with a mix of letters, numbers, and symbols"
      >
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="new-password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            required
            minLength={8}
            className="input-field pr-12"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
          >
            {showPasswords.new ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </FormField>

      <FormField
        label="Confirm new password"
        name="confirm-password"
        required
      >
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirm-password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            required
            className="input-field pr-12"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
          >
            {showPasswords.confirm ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </FormField>

      <ButtonGroup>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
        <TextLink onClick={onCancel}>
          Cancel
        </TextLink>
      </ButtonGroup>
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
          <div className="h-6 bg-bg-alt rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-bg-alt rounded w-2/3 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 mb-4">
              <div className="h-5 bg-bg-alt rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-bg-alt rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-bg-alt rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-medium text-text-primary">Security settings</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account security and authentication preferences.
        </p>
      </div>

      {/* Security Overview */}
      <div className="card p-6">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-8 w-8 text-success mr-3" />
          <div>
            <h4 className="text-lg font-medium text-text-primary">Security status</h4>
            <p className="text-sm text-text-secondary">Your account security is good</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-success mr-2" />
            <span className="text-sm text-text-secondary">Strong password</span>
          </div>
          <div className="flex items-center">
            {settings.security.twoFactorEnabled ? (
              <CheckCircleIcon className="h-5 w-5 text-success mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-gold mr-2" />
            )}
            <span className="text-sm text-text-secondary">
              Two-factor auth {settings.security.twoFactorEnabled ? 'enabled' : 'disabled'}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-success mr-2" />
            <span className="text-sm text-text-secondary">Account verified</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeyIcon className="h-5 w-5 text-text-tertiary mr-2" />
              <h4 className="text-base font-medium text-text-primary">Password</h4>
            </div>
            <div className="text-sm text-text-tertiary">
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
              <p className="text-sm text-text-secondary mb-4">
                Update your password to keep your account secure. Choose a strong password that you don't use elsewhere.
              </p>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-primary"
              >
                Change password
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
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 text-text-tertiary mr-2" />
            <h4 className="text-base font-medium text-text-primary">Two-factor authentication</h4>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary font-medium">
                {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-text-secondary">
                {settings.security.twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              className={settings.security.twoFactorEnabled ? 'btn-danger' : 'btn-primary'}
            >
              {settings.security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ComputerDesktopIcon className="h-5 w-5 text-text-tertiary mr-2" />
              <h4 className="text-base font-medium text-text-primary">Active sessions</h4>
            </div>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="text-sm text-navy hover:text-navy-700 transition-colors duration-fast"
            >
              {showSessions ? 'Hide' : 'View'} sessions
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-text-secondary mb-4">
            Manage your active sessions across different devices and browsers.
          </p>

          {showSessions && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-primary">
                  {mockSessions.length} active sessions
                </span>
                <button
                  onClick={handleEndAllSessions}
                  className="text-sm text-error hover:text-error-dark transition-colors duration-fast"
                >
                  End all other sessions
                </button>
              </div>

              <div className="space-y-3">
                {mockSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {session.device.includes('iPhone') || session.device.includes('Android') ? (
                          <DevicePhoneMobileIcon className="h-6 w-6 text-text-tertiary" />
                        ) : (
                          <ComputerDesktopIcon className="h-6 w-6 text-text-tertiary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-text-primary">{session.device}</p>
                          {session.current && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-light text-success-dark">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-text-tertiary">
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
                        className="text-error hover:text-error-dark transition-colors duration-fast p-2 touch-target"
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
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-navy" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-navy-800">
              Security best practices
            </h3>
            <div className="mt-2 text-sm text-navy-700">
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