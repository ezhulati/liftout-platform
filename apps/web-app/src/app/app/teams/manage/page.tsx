'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    queryKey: ['my-team'],
    queryFn: () => fetch('/api/teams/my-team').then(res => res.json()),
    enabled: !!userData,
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { teamId: string, email: string; message?: string }) => {
        const response = await fetch(`/api/teams/${data.teamId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, message: data.message }),
        });
        if (!response.ok) {
            throw new Error('Failed to send invitation');
        }
        return response.json();
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteForm(false);
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (data: { teamId: string, memberId: string }) => {
        const response = await fetch(`/api/teams/${data.teamId}/members/${data.memberId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to remove member');
        }
    },
    onSuccess: () => {
      toast.success('Member removed from team');
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove member');
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
        teamId: teamData?.team?.id,
        email: inviteEmail.trim(),
        message: inviteMessage.trim() || undefined
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberUserId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      await removeMemberMutation.mutateAsync({ teamId: teamData?.team?.id, memberId: memberUserId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (error) {
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

  // No team yet - show create team prompt
  if (!teamData?.team) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="page-header mb-8">
          <h1 className="page-title">My Team</h1>
          <p className="page-subtitle">Create or join a team to get started</p>
        </div>

        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-navy-50 flex items-center justify-center mb-4">
            <UserGroupIcon className="h-8 w-8 text-navy" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">You don't have a team yet</h2>
          <p className="text-base text-text-secondary max-w-md mx-auto mb-6">
            Create a team profile to showcase your collective experience and connect with companies looking for intact teams.
          </p>
          <button
            onClick={() => router.push('/app/teams/create')}
            className="btn-primary min-h-12 inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Create team profile
          </button>
        </div>
      </div>
    );
  }

  const team = teamData.team;
  const isLeader = team.members.find((m:any) => m.userId === userData?.id)?.isLead;
  const allMembers = team.members;

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
              <p className="text-base font-normal text-text-secondary mt-1">{team.name}</p>
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

      {/* Current Members - Practical UI: bold section heading, proper typography hierarchy */}
      <div className="card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Team members ({allMembers.length})</h2>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {allMembers.map((member:any) => {
              // Get initials from name
              const initials = (member.name || 'TM').split(' ').map((n:string) => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={member.id || member.userId} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt hover:border-navy/30 transition-all duration-fast">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center flex-shrink-0">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-white">{initials}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-text-primary">{member.name}</h3>
                        {member.isLead && (
                          <CheckBadgeIcon className="h-5 w-5 text-navy" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-sm font-normal text-text-secondary">{member.role}</p>
                      {member.experience > 0 && (
                        <p className="text-sm font-normal text-text-tertiary">
                          {member.experience} years experience
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs ${
                      member.isLead
                        ? 'badge-primary'
                        : 'badge-secondary'
                    }`}>
                      {member.isLead ? 'Team leader' : 'Member'}
                    </span>

                    {isLeader && !member.isLead && (
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
              );
            })}
          </div>
        </div>
      </div>

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