'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { TeamInvitation, emailInvitationService } from '@/lib/email-invitations';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface InvitationNotificationsProps {
  onInvitationUpdate?: () => void;
}

export function InvitationNotifications({ onInvitationUpdate }: InvitationNotificationsProps) {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      loadInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadInvitations = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const userInvitations = await emailInvitationService.getUserInvitations(user.email);
      setInvitations(userInvitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    if (!user?.email) return;

    try {
      setActionLoading(invitationId);
      await emailInvitationService.acceptInvitation(invitationId, user.email);
      toast.success('Invitation accepted! Welcome to the team!');
      await loadInvitations();
      if (onInvitationUpdate) onInvitationUpdate();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    if (!user?.email) return;

    try {
      setActionLoading(invitationId);
      await emailInvitationService.declineInvitation(invitationId, user.email);
      toast.success('Invitation declined');
      await loadInvitations();
      if (onInvitationUpdate) onInvitationUpdate();
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to decline invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'member':
        return 'Team Member';
      case 'admin':
        return 'Team Admin';
      case 'leader':
        return 'Team Leader';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-bg-alt rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return null; // Don't show anything if no invitations
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <UserGroupIcon className="h-5 w-5 text-navy mr-2" />
        <h3 className="text-lg font-medium text-text-primary">
          Team invitations ({invitations.length})
        </h3>
      </div>

      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-semibold text-text-primary">
                    {invitation.teamName}
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-100 text-navy-800">
                    {getRoleDescription(invitation.role)}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mt-1">
                  Invited by {invitation.inviterName}
                </p>

                {invitation.message && (
                  <div className="mt-2 p-3 bg-bg-alt rounded-md">
                    <p className="text-sm text-text-secondary">"{invitation.message}"</p>
                  </div>
                )}

                <div className="flex items-center mt-3 text-xs text-text-tertiary">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    Invited {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    Expires {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleAcceptInvitation(invitation.id!)}
                  disabled={actionLoading === invitation.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-success hover:bg-success-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === invitation.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Accept
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeclineInvitation(invitation.id!)}
                  disabled={actionLoading === invitation.id}
                  className="inline-flex items-center px-3 py-1.5 border border-border text-sm font-medium rounded-md text-text-secondary bg-bg-surface hover:bg-bg-alt focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-navy-50 border border-navy-200 rounded-md p-3">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-navy flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-navy-800">
              About team invitations
            </h3>
            <p className="mt-1 text-sm text-navy-700">
              Accepting an invitation will add you to the team and give you access to team resources based on your assigned role.
              Team invitations expire after 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}