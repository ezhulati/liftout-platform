'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ExclamationTriangleIcon, NoSymbolIcon, PauseIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  action: 'suspend' | 'unsuspend' | 'ban' | 'unban';
  userName: string;
  userEmail: string;
}

const actionConfig = {
  suspend: {
    title: 'Suspend User',
    description: 'This will temporarily suspend the user from the platform. They will not be able to log in until unsuspended.',
    confirmText: 'Suspend User',
    Icon: PauseIcon,
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    requiresReason: true,
  },
  unsuspend: {
    title: 'Unsuspend User',
    description: 'This will restore the user\'s access to the platform.',
    confirmText: 'Unsuspend User',
    Icon: PlayIcon,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    requiresReason: false,
  },
  ban: {
    title: 'Ban User',
    description: 'This will permanently ban the user from the platform. They will not be able to log in or create a new account with this email.',
    confirmText: 'Ban User',
    Icon: NoSymbolIcon,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    buttonClass: 'bg-red-600 hover:bg-red-700',
    requiresReason: true,
  },
  unban: {
    title: 'Unban User',
    description: 'This will lift the ban and restore the user\'s access to the platform.',
    confirmText: 'Unban User',
    Icon: CheckCircleIcon,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    buttonClass: 'bg-green-600 hover:bg-green-700',
    requiresReason: false,
  },
};

export function UserActionModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  userName,
  userEmail,
}: UserActionModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = actionConfig[action];
  const { Icon } = config;

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (config.requiresReason && !reason.trim()) {
      setError('Please provide a reason');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(reason.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={config.title}
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
            form="action-form"
            disabled={isSubmitting || (config.requiresReason && !reason.trim())}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${config.buttonClass}`}
          >
            {isSubmitting ? 'Processing...' : config.confirmText}
          </button>
        </div>
      }
    >
      <form id="action-form" onSubmit={handleSubmit} className="space-y-4">
        {/* User info */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${config.iconBg}`}>
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-300">{config.description}</p>
            <div className="mt-3 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-sm text-gray-400">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Reason input */}
        {config.requiresReason && (
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={`Why are you ${action === 'suspend' ? 'suspending' : 'banning'} this user?`}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This reason will be logged for audit purposes
            </p>
          </div>
        )}

        {/* Warning for ban */}
        {action === 'ban' && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">
              Banning a user is a serious action. Make sure you have documented evidence of the violation.
            </p>
          </div>
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

export default UserActionModal;
