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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load team data</h3>
        <p className="mt-1 text-sm text-gray-500">
          {error?.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

  const isLeader = teamData.leader.userId === userData?.id;
  const allMembers = [teamData.leader, ...teamData.members];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Team Profile
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600">{teamData.teamName}</p>
            </div>
          </div>

          {isLeader && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Team Overview */}
      <div className="card mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Team Overview</h2>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{teamData.teamSize}</div>
              <div className="text-sm text-gray-600">Current Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{teamData.pendingInvitations.length}</div>
              <div className="text-sm text-gray-600">Pending Invitations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{teamData.maxTeamSize}</div>
              <div className="text-sm text-gray-600">Max Team Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {teamData.maxTeamSize - teamData.teamSize}
              </div>
              <div className="text-sm text-gray-600">Available Spots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Members */}
      <div className="card mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Team Members ({allMembers.length})</h2>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {allMembers.map((member) => (
              <div key={member.userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      {member.role === 'leader' && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{member.title}</p>
                    <p className="text-xs text-gray-500">
                      Joined {formatDistanceToNow(member.joinedAt.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.role === 'leader' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role === 'leader' ? 'Team Leader' : 'Member'}
                  </span>

                  {isLeader && member.role !== 'leader' && (
                    <button
                      onClick={() => handleRemoveMember(member.userId, member.name)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remove member"
                    >
                      <UserMinusIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Invitations */}
      {teamData.pendingInvitations.length > 0 && (
        <div className="card mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Invitations ({teamData.pendingInvitations.length})
            </h2>
          </div>
          <div className="px-6 py-6">
            <div className="space-y-4">
              {teamData.pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center">
                      <EnvelopeIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{invitation.invitedEmail}</h3>
                      <p className="text-sm text-gray-600">
                        Invited {formatDistanceToNow(invitation.invitedAt.toDate(), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {formatDistanceToNow(invitation.expiresAt.toDate(), { addSuffix: true })}
                      </p>
                      {invitation.message && (
                        <p className="text-sm text-gray-700 mt-1 italic">"{invitation.message}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Pending
                    </span>

                    {isLeader && (
                      <button
                        onClick={() => handleCancelInvitation(invitation.id, invitation.invitedEmail)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Cancel invitation"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Required Skills */}
      {teamData.requiredSkills && teamData.requiredSkills.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Skills We're Looking For</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex flex-wrap gap-2">
              {teamData.requiredSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
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
                <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="btn-primary"
                >
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}