'use client';

import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
import { 
  Cog6ToothIcon,
  DocumentArrowDownIcon,
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
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  isDestructive = true 
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4">
          <div className="flex items-center">
            {isDestructive ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
            )}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
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
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences, data, and account status.
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-base font-medium text-gray-900 flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            Account Information
          </h4>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                {user?.email}
                {user?.verified ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" title="Verified" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 ml-2" title="Not verified" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                {user?.phone || 'Not provided'}
                {settings.account.phoneVerified ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" title="Verified" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 ml-2" title="Not verified" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Member Since
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings.account.memberSince.toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Last Login
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings.account.lastLogin 
                  ? settings.account.lastLogin.toLocaleDateString()
                  : 'Never'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  settings.account.accountStatus === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : settings.account.accountStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {settings.account.accountStatus}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Profile Completion</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings.account.profileCompletion}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-base font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
            Data Management
          </h4>
        </div>
        <div className="px-6 py-4 space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Export Account Data</h5>
              <p className="text-sm text-gray-500">
                Download a copy of your account data including profile, applications, and messages.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md border ${
                isExporting 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </button>
          </div>

          {/* Import Settings */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Import Settings</h5>
              <p className="text-sm text-gray-500">
                Import your settings from a previously exported file.
              </p>
            </div>
            <button
              onClick={handleImportSettings}
              disabled={isImporting}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md border ${
                isImporting 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Import Settings
                </>
              )}
            </button>
          </div>

          {/* Reset Settings */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Reset Settings</h5>
              <p className="text-sm text-gray-500">
                Reset all settings to their default values. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-base font-medium text-gray-900">Privacy Preferences</h4>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Marketing Communications</h5>
              <p className="text-sm text-gray-500">
                Receive emails about new features, product updates, and industry insights.
              </p>
            </div>
            <button
              onClick={handleMarketingConsentToggle}
              className={`${
                settings.account.marketingConsent ? 'bg-primary-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <span
                className={`${
                  settings.account.marketingConsent ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-4">
        {/* Deactivate Account */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900 flex items-center">
                  <PauseIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Deactivate Account
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Temporarily deactivate your account. You can reactivate it at any time by signing in.
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-red-50 border border-red-200 rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-red-800 flex items-center">
                  <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
                  Delete Account
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
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
        title="Deactivate Account"
        description="Are you sure you want to deactivate your account? You can reactivate it anytime by signing in."
        confirmText="Deactivate"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
        isDestructive={false}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete Forever"
      />

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Reset Settings"
        description="This will reset all your settings to their default values. This action cannot be undone."
        confirmText="Reset Settings"
      />
    </div>
  );
}