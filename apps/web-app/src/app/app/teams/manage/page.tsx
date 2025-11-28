'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamManagementService } from '@/lib/services/teamManagementService';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  PlusIcon,
  EnvelopeIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  UserMinusIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function TeamManagePage() {
  const { userData } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const { data: teamData, isLoading, error } = useQuery({
    queryKey: ['team-management', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;
      return await teamManagementService.getTeamManagement(userData.id);
    },
    enabled: !!userData?.id,
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; message?: string }) => {
      if (!userData?.id || !teamData?.teamId) {
        throw new Error('User or team not found');
      }
      return await teamManagementService.inviteToTeam(
        teamData.teamId,
        data.email,
        userData.id,
        userData.name,
        data.message
      );
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteForm(false);
      queryClient.invalidateQueries({ queryKey: ['team-management'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberUserId: string) => {
      if (!userData?.id) throw new Error('User not found');
      return await teamManagementService.removeMember(userData.id, memberUserId);
    },
    onSuccess: () => {
      toast.success('Member removed from team');
      queryClient.invalidateQueries({ queryKey: ['team-management'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!userData?.id) throw new Error('User not found');
      return await teamManagementService.cancelInvitation(invitationId, userData.id);
    },
    onSuccess: () => {
      toast.success('Invitation cancelled');
      queryClient.invalidateQueries({ queryKey: ['team-management'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel invitation');
    },
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    try {
      await inviteMutation.mutateAsync({
        email: inviteEmail.trim(),
        message: inviteMessage.trim() || undefined
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberUserId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      await removeMemberMutation.mutateAsync(memberUserId);
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (confirm(`Cancel invitation to ${email}?`)) {
      await cancelInvitationMutation.mutateAsync(invitationId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-error" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">Unable to load team data</h3>
        <p className="mt-1 text-sm text-text-tertiary">
          {error?.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

  const isLeader = teamData.leader.userId === userData?.id;
  const allMembers = [teamData.leader, ...teamData.members];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header - Practical UI: tertiary back link, bold headings */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-base font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast min-h-12 flex items-center mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Back to team profile
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Team Management</h1>
              <p className="text-base font-normal text-text-secondary mt-1">{teamData.teamName}</p>
            </div>
          </div>

          {isLeader && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary min-h-12 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Invite member
            </button>
          )}
        </div>
      </div>

      {/* Team Overview - Practical UI: bold section headings, consistent typography */}
      <div className="card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Team Overview</h2>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="text-2xl font-bold text-navy">{teamData.teamSize}</div>
              <div className="text-sm font-normal text-text-secondary mt-1">Current members</div>
            </div>
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="text-2xl font-bold text-gold">{teamData.pendingInvitations.length}</div>
              <div className="text-sm font-normal text-text-secondary mt-1">Pending invites</div>
            </div>
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="text-2xl font-bold text-navy">{teamData.maxTeamSize}</div>
              <div className="text-sm font-normal text-text-secondary mt-1">Max team size</div>
            </div>
            <div className="text-center p-4 bg-bg-alt rounded-xl">
              <div className="text-2xl font-bold text-success">
                {teamData.maxTeamSize - teamData.teamSize}
              </div>
              <div className="text-sm font-normal text-text-secondary mt-1">Available spots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Members - Practical UI: bold section heading, proper typography hierarchy */}
      <div className="card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Team members ({allMembers.length})</h2>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {allMembers.map((member) => (
              <div key={member.userId} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-text-primary">{member.name}</h3>
                      {member.role === 'leader' && (
                        <CheckBadgeIcon className="h-5 w-5 text-navy" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-sm font-normal text-text-secondary">{member.title}</p>
                    <p className="text-sm font-normal text-text-tertiary">
                      Joined {formatDistanceToNow(member.joinedAt.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${
                    member.role === 'leader'
                      ? 'badge-primary'
                      : 'badge-secondary'
                  }`}>
                    {member.role === 'leader' ? 'Team leader' : 'Member'}
                  </span>

                  {isLeader && member.role !== 'leader' && (
                    <button
                      onClick={() => handleRemoveMember(member.userId, member.name)}
                      className="text-text-tertiary hover:text-error min-h-12 min-w-12 flex items-center justify-center rounded-lg hover:bg-error-light transition-colors duration-fast"
                      title="Remove member"
                    >
                      <UserMinusIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Invitations - Practical UI: consistent card styling */}
      {teamData.pendingInvitations.length > 0 && (
        <div className="card mb-6">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">
              Pending invitations ({teamData.pendingInvitations.length})
            </h2>
          </div>
          <div className="px-6 py-6">
            <div className="space-y-4">
              {teamData.pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border border-gold/30 bg-gold-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <EnvelopeIcon className="h-6 w-6 text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">{invitation.invitedEmail}</h3>
                      <p className="text-sm font-normal text-text-secondary">
                        Invited {formatDistanceToNow(invitation.invitedAt.toDate(), { addSuffix: true })}
                      </p>
                      <p className="text-sm font-normal text-text-tertiary">
                        Expires {formatDistanceToNow(invitation.expiresAt.toDate(), { addSuffix: true })}
                      </p>
                      {invitation.message && (
                        <p className="text-sm font-normal text-text-secondary mt-1 italic">&ldquo;{invitation.message}&rdquo;</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge badge-warning text-xs flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Pending
                    </span>

                    {isLeader && (
                      <button
                        onClick={() => handleCancelInvitation(invitation.id, invitation.invitedEmail)}
                        className="text-text-tertiary hover:text-error min-h-12 min-w-12 flex items-center justify-center rounded-lg hover:bg-error-light transition-colors duration-fast"
                        title="Cancel invitation"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Required Skills - Practical UI: consistent badge styling */}
      {teamData.requiredSkills && teamData.requiredSkills.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Skills we&apos;re looking for</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex flex-wrap gap-2">
              {teamData.requiredSkills.map((skill) => (
                <span key={skill} className="badge badge-success text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Form Modal - Practical UI: labels on top, primary button left */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Invite team member</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-text-tertiary hover:text-text-primary min-h-12 min-w-12 flex items-center justify-center rounded-lg hover:bg-bg-elevated transition-colors duration-fast"
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-5">
              {/* Label on TOP per Practical UI */}
              <div>
                <label htmlFor="inviteEmail" className="block text-base font-bold text-text-primary mb-2">
                  Email address *
                </label>
                <input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="inviteMessage" className="block text-base font-bold text-text-primary mb-2">
                  Personal message <span className="font-normal text-text-tertiary">(optional)</span>
                </label>
                <textarea
                  id="inviteMessage"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a personal note to your invitation..."
                  className="input-field"
                />
              </div>

              {/* Practical UI: Primary left, Tertiary right */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isInviting}
                  className="btn-primary min-h-12"
                >
                  {isInviting ? 'Sending...' : 'Send invitation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="text-base font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast min-h-12"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}