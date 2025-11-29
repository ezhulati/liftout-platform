'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSoftDelete: (reason?: string) => Promise<void>;
  onHardDelete: (confirmationEmail: string) => Promise<void>;
  userName: string;
  userEmail: string;
}

type DeleteType = 'soft' | 'hard';

export function DeleteUserModal({
  isOpen,
  onClose,
  onSoftDelete,
  onHardDelete,
  userName,
  userEmail,
}: DeleteUserModalProps) {
  const [deleteType, setDeleteType] = useState<DeleteType>('soft');
  const [reason, setReason] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setDeleteType('soft');
    setReason('');
    setConfirmationEmail('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (deleteType === 'soft') {
        await onSoftDelete(reason.trim() || undefined);
      } else {
        if (confirmationEmail !== userEmail) {
          setError('Email does not match. Please type the exact email address.');
          setIsSubmitting(false);
          return;
        }
        await onHardDelete(confirmationEmail);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = deleteType === 'soft' || (deleteType === 'hard' && confirmationEmail === userEmail);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete User"
      size="md"
      footer={
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
            form="delete-form"
            disabled={isSubmitting || !canSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting...' : deleteType === 'soft' ? 'Soft Delete' : 'Permanently Delete'}
          </button>
        </div>
      }
    >
      <form id="delete-form" onSubmit={handleSubmit} className="space-y-6">
        {/* User info */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-500/10">
            <TrashIcon className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Choose how to delete this user account.</p>
            <div className="mt-3 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-sm text-gray-400">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Delete type selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Delete Type</label>

          <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
            deleteType === 'soft'
              ? 'border-yellow-500/50 bg-yellow-500/5'
              : 'border-gray-700 hover:border-gray-600'
          }`}>
            <input
              type="radio"
              name="deleteType"
              value="soft"
              checked={deleteType === 'soft'}
              onChange={() => setDeleteType('soft')}
              className="mt-1 h-4 w-4 text-red-500 border-gray-600 bg-gray-800 focus:ring-red-500"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-white">Soft Delete</span>
              <span className="block text-sm text-gray-400 mt-1">
                Mark the account as deleted but retain the data. Can be restored if needed.
              </span>
            </div>
          </label>

          <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
            deleteType === 'hard'
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-gray-700 hover:border-gray-600'
          }`}>
            <input
              type="radio"
              name="deleteType"
              value="hard"
              checked={deleteType === 'hard'}
              onChange={() => setDeleteType('hard')}
              className="mt-1 h-4 w-4 text-red-500 border-gray-600 bg-gray-800 focus:ring-red-500"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-white">Permanent Delete</span>
              <span className="block text-sm text-gray-400 mt-1">
                Permanently remove all user data. This action cannot be undone.
              </span>
            </div>
          </label>
        </div>

        {/* Reason (for soft delete) */}
        {deleteType === 'soft' && (
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
              Reason (optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Why are you deleting this account?"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Confirmation (for hard delete) */}
        {deleteType === 'hard' && (
          <>
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">
                <p className="font-medium">This action is permanent and cannot be undone.</p>
                <p className="mt-1">
                  All user data including profile, team memberships, messages, and activity history will be permanently deleted.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="font-mono text-red-400">{userEmail}</span> to confirm
              </label>
              <input
                type="email"
                id="confirmation"
                value={confirmationEmail}
                onChange={(e) => setConfirmationEmail(e.target.value)}
                placeholder="Enter user email to confirm"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}

export default DeleteUserModal;
