'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

type ExportFormat = 'json' | 'csv';
type ExportStatus = 'idle' | 'preparing' | 'ready' | 'error';
type DeletionStatus = 'idle' | 'pending' | 'confirmed' | 'processing' | 'completed';

interface DataExportRequest {
  id: string;
  requestedAt: Date;
  status: 'pending' | 'processing' | 'ready' | 'expired';
  format: ExportFormat;
  downloadUrl?: string;
  expiresAt?: Date;
}

export function DataManagementSettings() {
  const { user } = useAuth();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus>('idle');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Request data export
  const handleRequestExport = async () => {
    setIsExporting(true);
    setExportStatus('preparing');

    try {
      const response = await fetch('/api/gdpr/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: exportFormat }),
      });

      if (!response.ok) {
        throw new Error('Failed to request data export');
      }

      const data = await response.json();

      if (data.downloadUrl) {
        // Direct download available
        setExportStatus('ready');
        window.location.href = data.downloadUrl;
        toast.success('Your data export is ready for download');
      } else if (data.requestId) {
        // Async processing
        setExportRequests(prev => [
          {
            id: data.requestId,
            requestedAt: new Date(),
            status: 'pending',
            format: exportFormat,
          },
          ...prev,
        ]);
        toast.success('Data export requested. You will receive an email when it\'s ready.');
        setExportStatus('idle');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to request data export');
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  // Download existing export
  const handleDownloadExport = async (requestId: string) => {
    try {
      const response = await fetch(`/api/gdpr/export/${requestId}`);

      if (!response.ok) {
        throw new Error('Failed to download export');
      }

      const data = await response.json();

      if (data.downloadUrl) {
        window.location.href = data.downloadUrl;
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download export');
    }
  };

  // Initiate account deletion
  const handleInitiateDeletion = () => {
    setDeletionStatus('pending');
  };

  // Confirm account deletion
  const handleConfirmDeletion = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    setDeletionStatus('processing');

    try {
      const response = await fetch('/api/gdpr/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: deleteConfirmText }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setDeletionStatus('completed');
      toast.success('Account deletion initiated. You will be signed out shortly.');

      // Sign out after a delay
      setTimeout(() => {
        window.location.href = '/auth/signin?deleted=true';
      }, 3000);
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error('Failed to delete account');
      setDeletionStatus('idle');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const handleCancelDeletion = () => {
    setDeletionStatus('idle');
    setDeleteConfirmText('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Data management</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your personal data, including export and deletion options for GDPR compliance.
        </p>
      </div>

      {/* Data Export Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowDownTrayIcon className="h-5 w-5 text-text-tertiary" />
          <h4 className="text-base font-bold text-text-primary">Export your data</h4>
        </div>
        <p className="text-sm text-text-secondary">
          Download a copy of all your personal data stored on Liftout. This includes your profile information,
          team memberships, applications, messages, and activity history.
        </p>

        <div className="bg-bg-alt rounded-xl p-6 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Export format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="w-4 h-4 text-navy focus:ring-navy"
                />
                <span className="text-sm text-text-secondary">JSON (machine-readable)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="w-4 h-4 text-navy focus:ring-navy"
                />
                <span className="text-sm text-text-secondary">CSV (spreadsheet-compatible)</span>
              </label>
            </div>
          </div>

          {/* Data Included */}
          <div>
            <h5 className="text-sm font-medium text-text-primary mb-2">Data included in export:</h5>
            <ul className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Profile information
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Team memberships
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Applications & EOIs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Messages & conversations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Activity history
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success" />
                Settings & preferences
              </li>
            </ul>
          </div>

          {/* Export Button */}
          <button
            onClick={handleRequestExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-12 bg-navy text-white rounded-lg font-medium hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Preparing export...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                Request data export
              </>
            )}
          </button>

          {/* Export Status */}
          {exportStatus === 'ready' && (
            <div className="flex items-center gap-2 p-3 bg-success-light rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-success" />
              <span className="text-sm text-success-dark">Your export is ready for download!</span>
            </div>
          )}
        </div>

        {/* Previous Export Requests */}
        {exportRequests.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-text-primary">Previous export requests:</h5>
            <div className="space-y-2">
              {exportRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-5 w-5 text-text-tertiary" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {request.format.toUpperCase()} Export
                      </p>
                      <p className="text-xs text-text-tertiary">
                        Requested {request.requestedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 text-gold-800 rounded text-xs">
                        <ClockIcon className="h-3 w-3" />
                        Processing
                      </span>
                    )}
                    {request.status === 'ready' && request.downloadUrl && (
                      <button
                        onClick={() => handleDownloadExport(request.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-navy text-white rounded text-sm hover:bg-navy-600"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download
                      </button>
                    )}
                    {request.status === 'expired' && (
                      <span className="text-xs text-text-tertiary">Expired</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Deletion Section */}
      <div className="space-y-4 pt-8 border-t border-border">
        <div className="flex items-center gap-2">
          <TrashIcon className="h-5 w-5 text-error" />
          <h4 className="text-base font-bold text-text-primary">Delete your account</h4>
        </div>
        <p className="text-sm text-text-secondary">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {deletionStatus === 'idle' && (
          <div className="bg-error-light border border-error-light rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-error flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-error">Warning: This action is irreversible</h5>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>Your profile and all personal information will be deleted</li>
                  <li>You will be removed from all teams</li>
                  <li>All your applications and expressions of interest will be cancelled</li>
                  <li>Your message history will be anonymized</li>
                  <li>Any active subscriptions will be cancelled</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleInitiateDeletion}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-12 bg-error text-white rounded-lg font-medium hover:bg-error-dark transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
              Delete my account
            </button>
          </div>
        )}

        {(deletionStatus === 'pending' || deletionStatus === 'processing') && (
          <div className="bg-bg-surface border-2 border-error rounded-xl p-6 space-y-4">
            <h5 className="text-lg font-bold text-text-primary">Confirm account deletion</h5>
            <p className="text-sm text-text-secondary">
              This will permanently delete your account for <strong>{user?.email}</strong>.
              Type <strong>DELETE</strong> below to confirm.
            </p>

            <div>
              <label htmlFor="deleteConfirm" className="block text-sm font-medium text-text-primary mb-2">
                Type DELETE to confirm
              </label>
              <input
                id="deleteConfirm"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={isDeleting}
                className="w-full px-4 py-3 border border-border rounded-lg text-text-primary bg-bg-surface focus:ring-2 focus:ring-error focus:border-error disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDeletion}
                disabled={isDeleting}
                className="px-4 py-2.5 min-h-12 border border-border rounded-lg font-medium text-text-primary hover:bg-bg-alt disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletion}
                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-12 bg-error text-white rounded-lg font-medium hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5" />
                    Permanently delete account
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {deletionStatus === 'completed' && (
          <div className="bg-bg-alt rounded-xl p-6 text-center">
            <CheckCircleIcon className="h-12 w-12 text-success mx-auto mb-4" />
            <h5 className="text-lg font-bold text-text-primary mb-2">Account deletion initiated</h5>
            <p className="text-sm text-text-secondary">
              Your account will be deleted within 30 days. You will receive an email confirmation.
              You will be signed out shortly.
            </p>
          </div>
        )}
      </div>

      {/* GDPR Rights Information */}
      <div className="bg-navy-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-navy" />
          <h4 className="text-base font-bold text-text-primary">Your data rights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
          <div>
            <h5 className="font-medium text-text-primary">Right to access</h5>
            <p>Request a copy of all your personal data</p>
          </div>
          <div>
            <h5 className="font-medium text-text-primary">Right to rectification</h5>
            <p>Update or correct your personal information</p>
          </div>
          <div>
            <h5 className="font-medium text-text-primary">Right to erasure</h5>
            <p>Request deletion of your personal data</p>
          </div>
          <div>
            <h5 className="font-medium text-text-primary">Right to portability</h5>
            <p>Export your data in a machine-readable format</p>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          For questions about your data or to exercise additional rights, contact us at{' '}
          <a href="mailto:privacy@liftout.io" className="text-link">privacy@liftout.io</a>
        </p>
      </div>
    </div>
  );
}
