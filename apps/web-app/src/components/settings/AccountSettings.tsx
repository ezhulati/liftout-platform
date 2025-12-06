'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';

// Helper to check if user is a demo user
const isDemoUserEmail = (email: string) =>
  email === 'demo@example.com' || email === 'company@example.com';
import {
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { DeleteCompanyModal } from '@/components/company/DeleteCompanyModal';
import { InviteCompanyMember } from '@/components/company/InviteCompanyMember';
import { toast } from 'react-hot-toast';
import { ButtonGroup, TextLink, FormField } from '@/components/ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmButtonClass?: string;
  isDestructive?: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmButtonClass = "bg-error hover:bg-error-dark",
  isDestructive = true
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-900/75 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-surface rounded-lg max-w-md w-full shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center">
            {isDestructive ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-error mr-3" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 text-info mr-3" />
            )}
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        </div>
        <div className="px-6 py-4 bg-bg-alt rounded-b-lg">
          <ButtonGroup>
            <button
              onClick={onConfirm}
              className={`btn-primary min-h-12 ${isDestructive ? confirmButtonClass : ''}`}
            >
              {confirmText}
            </button>
            <TextLink onClick={onClose}>
              Cancel
            </TextLink>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  userEmail: string;
}

function DeleteAccountModal({ isOpen, onClose, onConfirm, userEmail }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = password.length >= 6 && confirmEmail === userEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsDeleting(true);
    try {
      await onConfirm(password);
    } catch {
      // Error handled in parent
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-900/75 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-surface rounded-lg max-w-md w-full shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-error mr-3" />
              <h3 className="text-lg font-bold text-text-primary">Delete account</h3>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div className="mt-4 space-y-4">
              <FormField label="Type your email to confirm" name="confirm-email" required>
                <input
                  type="email"
                  id="confirm-email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={userEmail}
                  className="input-field"
                  required
                />
              </FormField>

              <FormField label="Enter your password" name="delete-password" required>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="delete-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormField>
            </div>
          </div>

          <div className="px-6 py-4 bg-bg-alt rounded-b-lg">
            <ButtonGroup>
              <button
                type="submit"
                disabled={!isValid || isDeleting}
                className="btn-danger min-h-12"
              >
                {isDeleting ? 'Deleting...' : 'Delete forever'}
              </button>
              <TextLink onClick={handleClose}>
                Cancel
              </TextLink>
            </ButtonGroup>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AccountSettings() {
  const { data: session } = useSession();
  const { user } = useAuth();
  const { settings, updateAccountSettings, exportSettings, importSettings, resetSettings } = useSettings();

  // Use session data as fallback
  const sessionUser = session?.user as any;
  const displayEmail = user?.email || sessionUser?.email || '';

  // Check if this is a demo user
  const isDemoUser = isDemoUserEmail(displayEmail);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Check if user is a company user
  const isCompanyUser = user?.type === 'company' || (sessionUser as any)?.userType === 'company';

  // State for company info (fetched for company users)
  const [companyInfo, setCompanyInfo] = useState<{ id: string; name: string } | null>(null);

  // Fetch company info for company users
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!isCompanyUser) return;

      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          // Dashboard stats for company users includes company info
          if (data.company) {
            setCompanyInfo({
              id: data.company.id,
              name: data.company.name || user?.companyName || 'Your Company',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };

    fetchCompanyInfo();
  }, [isCompanyUser, user?.companyName]);

  // Company info from state or fallback
  const companyId = companyInfo?.id;
  const companyName = companyInfo?.name || user?.companyName || 'Your Company';

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate API call for full data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, just export settings
      const settingsData = exportSettings();
      const blob = new Blob([settingsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liftout-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Settings exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        await importSettings(text);
      } catch (error) {
        toast.error('Failed to import settings');
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const handleDeactivateAccount = async () => {
    try {
      // For demo users, just simulate success and sign out
      if (isDemoUser) {
        toast.success('Account deactivated successfully (demo mode)');
        setShowDeactivateModal(false);
        await signOut({ callbackUrl: '/' });
        return;
      }

      const response = await fetch('/api/user/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'deactivated' }),
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate account');
      }

      toast.success('Account deactivated successfully');
      setShowDeactivateModal(false);
      // Sign out the user
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      toast.error('Failed to deactivate account');
    }
  };

  const handleDeleteAccount = async (password: string) => {
    // For demo users, just simulate success and sign out
    if (isDemoUser) {
      toast.success('Account deleted successfully (demo mode)');
      setShowDeleteModal(false);
      // Clear localStorage demo data
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('demo@example.com') || key.includes('company@example.com')) {
            localStorage.removeItem(key);
          }
        });
      }
      await signOut({ callbackUrl: '/' });
      return;
    }

    if (!user) {
      toast.error('You must be logged in to delete your account');
      return;
    }

    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          confirmEmail: displayEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      setShowDeleteModal(false);

      // Sign out from NextAuth
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Account deletion error:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete account. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const handleResetSettings = async () => {
    try {
      await resetSettings();
      setShowResetModal(false);
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  const handleMarketingConsentToggle = async () => {
    try {
      await updateAccountSettings({ 
        marketingConsent: !settings.account.marketingConsent 
      });
    } catch (error) {
      toast.error('Failed to update marketing preferences');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Account management</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account preferences, data, and account status.
        </p>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <UserIcon className="h-5 w-5 text-text-tertiary mr-2" />
            Account information
          </h4>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold text-text-tertiary flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-text-primary flex items-center">
                {displayEmail}
                {user?.verified ? (
                  <CheckCircleIcon className="h-4 w-4 text-success ml-2" title="Verified" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-error ml-2" title="Not verified" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-text-tertiary flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-text-primary flex items-center">
                {user?.phone || 'Not provided'}
                {settings.account.phoneVerified ? (
                  <CheckCircleIcon className="h-4 w-4 text-success ml-2" title="Verified" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-error ml-2" title="Not verified" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-text-tertiary flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Member since
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {settings.account.memberSince.toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-text-tertiary flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Last login
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {settings.account.lastLogin
                  ? settings.account.lastLogin.toLocaleDateString()
                  : 'Never'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-text-tertiary">Account status</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                  settings.account.accountStatus === 'active'
                    ? 'bg-success-light text-success-dark'
                    : settings.account.accountStatus === 'pending'
                    ? 'bg-gold-100 text-gold-800'
                    : 'bg-error-light text-error-dark'
                }`}>
                  {settings.account.accountStatus}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-text-tertiary">Profile completion</dt>
              <dd className="mt-1 text-sm text-text-primary">
                {settings.account.profileCompletion}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-text-tertiary mr-2" />
            Data management
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg min-h-20">
            <div className="mr-4">
              <h5 className="text-base font-bold text-text-primary">Export account data</h5>
              <p className="text-base text-text-secondary">
                Download a copy of your account data including profile, applications, and messages.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className={`btn-outline flex items-center min-h-12 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-tertiary mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export data
                </>
              )}
            </button>
          </div>

          {/* Import Settings */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg min-h-20">
            <div className="mr-4">
              <h5 className="text-base font-bold text-text-primary">Import settings</h5>
              <p className="text-base text-text-secondary">
                Import your settings from a previously exported file.
              </p>
            </div>
            <button
              onClick={handleImportSettings}
              disabled={isImporting}
              className={`btn-outline flex items-center min-h-12 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-tertiary mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                  Import settings
                </>
              )}
            </button>
          </div>

          {/* Reset Settings */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg min-h-20">
            <div className="mr-4">
              <h5 className="text-base font-bold text-text-primary">Reset settings</h5>
              <p className="text-base text-text-secondary">
                Reset all settings to their default values. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center px-4 py-3 text-base font-bold text-error-dark bg-error-light border border-error rounded-lg hover:bg-error/20 transition-colors duration-fast min-h-12"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Reset settings
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-bold text-text-primary">Privacy preferences</h4>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between min-h-16">
            <div className="mr-4">
              <h5 className="text-base font-bold text-text-primary">Marketing communications</h5>
              <p className="text-base text-text-secondary">
                Receive emails about new features, product updates, and industry insights.
              </p>
            </div>
            <button
              onClick={handleMarketingConsentToggle}
              className={`${
                settings.account.marketingConsent ? 'bg-navy' : 'bg-bg-alt'
              } relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy min-h-12 min-w-14 items-center`}
            >
              <span
                className={`${
                  settings.account.marketingConsent ? 'translate-x-6' : 'translate-x-0'
                } pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow transform ring-0 transition duration-base`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Company Management - Only for company users */}
      {isCompanyUser && companyId && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h4 className="text-base font-bold text-text-primary flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-text-tertiary mr-2" />
              Company management
            </h4>
          </div>
          <div className="px-6 py-4 space-y-4">
            {/* Invite Team Member */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg min-h-20">
              <div className="mr-4">
                <h5 className="text-base font-bold text-text-primary">Invite team member</h5>
                <p className="text-base text-text-secondary">
                  Invite colleagues to join your company on Liftout and collaborate on hiring teams.
                </p>
              </div>
              <button
                onClick={() => setShowInviteMemberModal(true)}
                className="btn-primary flex items-center min-h-12"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Invite member
              </button>
            </div>

            {/* Delete Company */}
            <div className="flex items-center justify-between p-4 border border-error/30 rounded-lg min-h-20 bg-error-light/30">
              <div className="mr-4">
                <h5 className="text-base font-bold text-error-dark">Delete company</h5>
                <p className="text-base text-text-secondary">
                  Permanently delete your company profile and all associated opportunities. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteCompanyModal(true)}
                className="btn-outline text-error border-error hover:bg-error/10 flex items-center min-h-12"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="space-y-4">
        {/* Deactivate Account */}
        <div className="card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between min-h-20">
              <div className="mr-4">
                <h4 className="text-base font-bold text-text-primary flex items-center">
                  <PauseIcon className="h-5 w-5 text-gold mr-2" />
                  Deactivate account
                </h4>
                <p className="text-base text-text-secondary mt-1">
                  Temporarily deactivate your account. You can reactivate it at any time by signing in.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="bg-gold text-white px-4 py-3 rounded-lg text-base font-bold hover:bg-gold-700 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold min-h-12"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-error-light border border-error rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between min-h-20">
              <div className="mr-4">
                <h4 className="text-base font-bold text-error-dark flex items-center">
                  <TrashIcon className="h-5 w-5 text-error mr-2" />
                  Delete account
                </h4>
                <p className="text-base text-error-dark/80 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger min-h-12"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateAccount}
        title="Deactivate account"
        description="Are you sure you want to deactivate your account? You can reactivate it anytime by signing in."
        confirmText="Deactivate"
        confirmButtonClass="bg-gold hover:bg-gold-700"
        isDestructive={false}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        userEmail={displayEmail}
      />

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Reset settings"
        description="This will reset all your settings to their default values. This action cannot be undone."
        confirmText="Reset settings"
      />

      {/* Company Modals - Only rendered for company users */}
      {isCompanyUser && companyId && (
        <>
          <DeleteCompanyModal
            isOpen={showDeleteCompanyModal}
            onClose={() => setShowDeleteCompanyModal(false)}
            companyId={companyId}
            companyName={companyName}
          />
          <InviteCompanyMember
            isOpen={showInviteMemberModal}
            onClose={() => setShowInviteMemberModal(false)}
            companyId={companyId}
            companyName={companyName}
          />
        </>
      )}
    </div>
  );
}