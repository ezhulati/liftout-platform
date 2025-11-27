'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
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
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { ButtonGroup, TextLink } from '@/components/ui';

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
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        </div>
        <div className="px-6 py-4 bg-bg-alt rounded-b-lg">
          <ButtonGroup>
            <button
              onClick={onConfirm}
              className={`btn-primary ${isDestructive ? confirmButtonClass : ''}`}
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

export function AccountSettings() {
  const { user } = useAuth();
  const { settings, updateAccountSettings, exportSettings, importSettings, resetSettings } = useSettings();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
      await updateAccountSettings({ accountStatus: 'deactivated' });
      toast.success('Account deactivated successfully');
      setShowDeactivateModal(false);
      // In a real app, this might redirect to a deactivation confirmation page
    } catch (error) {
      toast.error('Failed to deactivate account');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call your API to delete the account
      toast.success('Account deletion initiated. You will receive a confirmation email.');
      setShowDeleteModal(false);
      await signOut();
    } catch (error) {
      toast.error('Failed to delete account');
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
        <h3 className="text-lg font-medium text-text-primary">Account management</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account preferences, data, and account status.
        </p>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-medium text-text-primary flex items-center">
            <UserIcon className="h-5 w-5 text-text-tertiary mr-2" />
            Account information
          </h4>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-text-tertiary flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-text-primary flex items-center">
                {user?.email}
                {user?.verified ? (
                  <CheckCircleIcon className="h-4 w-4 text-success ml-2" title="Verified" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-error ml-2" title="Not verified" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary flex items-center">
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
              <dt className="text-sm font-medium text-text-tertiary flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Member since
              </dt>
              <dd className="mt-1 text-sm text-text-primary">
                {settings.account.memberSince.toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary flex items-center">
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
              <dt className="text-sm font-medium text-text-tertiary">Account status</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
              <dt className="text-sm font-medium text-text-tertiary">Profile completion</dt>
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
          <h4 className="text-base font-medium text-text-primary flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-text-tertiary mr-2" />
            Data management
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-text-primary">Export account data</h5>
              <p className="text-sm text-text-secondary">
                Download a copy of your account data including profile, applications, and messages.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className={`btn-outline flex items-center ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-tertiary mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export data
                </>
              )}
            </button>
          </div>

          {/* Import Settings */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-text-primary">Import settings</h5>
              <p className="text-sm text-text-secondary">
                Import your settings from a previously exported file.
              </p>
            </div>
            <button
              onClick={handleImportSettings}
              disabled={isImporting}
              className={`btn-outline flex items-center ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-tertiary mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Import settings
                </>
              )}
            </button>
          </div>

          {/* Reset Settings */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-text-primary">Reset settings</h5>
              <p className="text-sm text-text-secondary">
                Reset all settings to their default values. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-error-dark bg-error-light border border-error rounded-md hover:bg-error/20 transition-colors duration-fast"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Reset settings
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-medium text-text-primary">Privacy preferences</h4>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-text-primary">Marketing communications</h5>
              <p className="text-sm text-text-secondary">
                Receive emails about new features, product updates, and industry insights.
              </p>
            </div>
            <button
              onClick={handleMarketingConsentToggle}
              className={`${
                settings.account.marketingConsent ? 'bg-navy' : 'bg-bg-alt'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy`}
            >
              <span
                className={`${
                  settings.account.marketingConsent ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-base`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-4">
        {/* Deactivate Account */}
        <div className="card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-text-primary flex items-center">
                  <PauseIcon className="h-5 w-5 text-gold mr-2" />
                  Deactivate account
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  Temporarily deactivate your account. You can reactivate it at any time by signing in.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="bg-gold text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gold-700 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-error-light border border-error rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-error-dark flex items-center">
                  <TrashIcon className="h-5 w-5 text-error mr-2" />
                  Delete account
                </h4>
                <p className="text-sm text-error-dark/80 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger"
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account"
        description="This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete forever"
      />

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Reset settings"
        description="This will reset all your settings to their default values. This action cannot be undone."
        confirmText="Reset settings"
      />
    </div>
  );
}