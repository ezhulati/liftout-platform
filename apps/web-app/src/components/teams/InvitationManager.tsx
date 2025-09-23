'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowPathIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { TeamInvitation, InvitationSummary, emailInvitationService } from '@/lib/email-invitations';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface InvitationManagerProps {
  teamId: string;
  onInvitationUpdate?: () => void;
}

export function InvitationManager({ teamId, onInvitationUpdate }: InvitationManagerProps) {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [summary, setSummary] = useState<InvitationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, [teamId]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const [invitationsData, summaryData] = await Promise.all([
        emailInvitationService.getTeamInvitations(teamId),
        emailInvitationService.getInvitationSummary(teamId)
      ]);
      
      // Sort by creation date (newest first)
      const sortedInvitations = invitationsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setInvitations(sortedInvitations);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (invitationId: string) => {
    try {
      setActionLoading(invitationId);
      await emailInvitationService.sendReminder(invitationId);
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reminder');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!user) return;

    try {
      setActionLoading(invitationId);
      await emailInvitationService.revokeInvitation(invitationId, user.email!);
      toast.success('Invitation revoked successfully');
      await loadInvitations();
      if (onInvitationUpdate) onInvitationUpdate();
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to revoke invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: TeamInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
      case 'revoked':
        return <TrashIcon className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: TeamInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'expired':
        return 'Expired';
      case 'revoked':
        return 'Revoked';
      default:
        return status;
    }
  };

  const getStatusColor = (status: TeamInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'accepted':
        return 'text-green-700 bg-green-100';
      case 'declined':
        return 'text-red-700 bg-red-100';
      case 'expired':
      case 'revoked':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const isExpired = (invitation: TeamInvitation) => {
    return invitation.status === 'pending' && new Date() > new Date(invitation.expiresAt);
  };

  const canSendReminder = (invitation: TeamInvitation) => {
    return invitation.status === 'pending' && !isExpired(invitation);
  };

  const canRevoke = (invitation: TeamInvitation) => {
    return invitation.status === 'pending' && invitation.inviterEmail === user?.email;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invitation Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.accepted}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.declined}</div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{summary.expired}</div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Invitations List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Team Invitations</h3>
            <button
              onClick={loadInvitations}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {invitations.length === 0 ? (
          <div className="text-center py-8">
            <PaperAirplaneIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by inviting team members to join your team.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(invitation.status)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.inviteeEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invitation.role} • Invited by {invitation.inviterName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                        {invitation.status === 'pending' && (
                          <span className="ml-2">
                            • Expires {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                      {getStatusText(invitation.status)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      {canSendReminder(invitation) && (
                        <button
                          onClick={() => handleSendReminder(invitation.id!)}
                          disabled={actionLoading === invitation.id}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                          title="Send reminder"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}

                      {canRevoke(invitation) && (
                        <button
                          onClick={() => handleRevokeInvitation(invitation.id!)}
                          disabled={actionLoading === invitation.id}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Revoke invitation"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Message */}
                {invitation.message && (
                  <div className="mt-3 ml-8">
                    <div className="bg-gray-50 rounded-md px-3 py-2">
                      <p className="text-sm text-gray-700">"{invitation.message}"</p>
                    </div>
                  </div>
                )}

                {/* Expiry Warning */}
                {isExpired(invitation) && (
                  <div className="mt-3 ml-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                      <p className="text-sm text-yellow-700">
                        This invitation has expired and will be automatically updated soon.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}