'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { EyeIcon, ExclamationTriangleIcon, ClockIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface ImpersonateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<{ token: string; expiresAt: string }>;
  userName: string;
  userEmail: string;
}

export function ImpersonateUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
}: ImpersonateUserModalProps) {
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [impersonationToken, setImpersonationToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleClose = () => {
    setReason('');
    setAcknowledged(false);
    setError(null);
    setImpersonationToken(null);
    setExpiresAt(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError('Please provide a reason for impersonation');
      return;
    }

    if (!acknowledged) {
      setError('Please acknowledge the impersonation policy');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onConfirm(reason.trim());
      setImpersonationToken(result.token);
      setExpiresAt(result.expiresAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start impersonation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartImpersonation = () => {
    if (impersonationToken) {
      // Store token in localStorage for the impersonation session
      localStorage.setItem('impersonation_token', impersonationToken);
      localStorage.setItem('impersonation_expires', expiresAt || '');
      // Open a new window/tab with impersonation mode
      window.open(`/app/dashboard?impersonate=${impersonationToken}`, '_blank');
      handleClose();
    }
  };

  const formatExpiry = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Impersonate User"
      size="md"
      footer={
        impersonationToken ? (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartImpersonation}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Open Impersonation Session
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="impersonate-form"
              disabled={isSubmitting || !reason.trim() || !acknowledged}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Starting...' : 'Start Impersonation'}
            </button>
          </div>
        )
      }
    >
      {impersonationToken ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="p-2 rounded-full bg-green-500/20">
              <EyeIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-300">Impersonation session ready</p>
              <p className="text-xs text-green-400/80 mt-0.5">
                Session expires at {expiresAt && formatExpiry(expiresAt)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg space-y-2">
            <p className="text-sm text-gray-300">
              Click the button below to open a new browser tab as <strong className="text-white">{userName}</strong>.
            </p>
            <p className="text-xs text-gray-500">
              The session will automatically end after 30 minutes or when you click "End Impersonation".
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>All actions during impersonation are logged in the audit trail</span>
          </div>
        </div>
      ) : (
        <form id="impersonate-form" onSubmit={handleSubmit} className="space-y-6">
          {/* User info */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-500/10">
              <EyeIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                You are about to impersonate this user. This will allow you to view the platform exactly as they see it.
              </p>
              <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-sm text-gray-400">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-300">
              <p className="font-medium">Important Guidelines</p>
              <ul className="mt-1 space-y-1 text-yellow-300/80 list-disc list-inside">
                <li>Only use for legitimate support or debugging purposes</li>
                <li>Do not make changes to the user's account without their consent</li>
                <li>Session automatically expires after 30 minutes</li>
                <li>All actions are logged and audited</li>
              </ul>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
              Reason for impersonation <span className="text-red-400">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g., Investigating reported bug, Assisting user with account issue..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Acknowledgment */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-500 border-gray-600 bg-gray-800 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-300">
              I acknowledge that this impersonation will be logged and I will only use it for legitimate administrative purposes.
            </span>
          </label>

          {/* Security note */}
          <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
            <ShieldExclamationIcon className="h-5 w-5 text-gray-500" />
            <p className="text-xs text-gray-400">
              This action is recorded in the security audit log with your admin ID, timestamp, and reason.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}

export default ImpersonateUserModal;
