'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Invitation {
  id: string;
  email: string;
  role?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

interface PendingInvitesProps {
  invitations: Invitation[];
  canManage: boolean;
  onResend: (inviteId: string) => void;
  onCancel: (inviteId: string) => void;
}

export function PendingInvites({
  invitations,
  canManage,
  onResend,
  onCancel,
}: PendingInvitesProps) {
  const pendingInvites = invitations.filter(inv => inv.status === 'pending');

  if (pendingInvites.length === 0) {
    return null;
  }

  const getTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getStatusIcon = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gold" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-success" />;
      case 'declined':
        return <XCircleIcon className="h-5 w-5 text-error" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-text-tertiary" />;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <h3 className="text-sm font-medium text-text-tertiary mb-3">
        Pending invitations ({pendingInvites.length})
      </h3>
      <div className="space-y-2">
        {pendingInvites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between p-3 bg-bg-alt rounded-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getStatusIcon(invite.status)}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {invite.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  {invite.role && <span>{invite.role}</span>}
                  {invite.role && <span>•</span>}
                  <span>{getTimeRemaining(invite.expiresAt)}</span>
                </div>
              </div>
            </div>

            {canManage && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => onResend(invite.id)}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded text-text-tertiary hover:text-navy hover:bg-navy-50 transition-colors"
                  title="Resend invitation"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onCancel(invite.id)}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded text-text-tertiary hover:text-error hover:bg-error-light transition-colors"
                  title="Cancel invitation"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
