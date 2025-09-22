'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  UserPlusIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  personalMessage: z.string().max(500, 'Message must be less than 500 characters').optional(),
  permissions: z.object({
    canEditTeam: z.boolean(),
    canInviteMembers: z.boolean(),
    canViewAnalytics: z.boolean(),
  }),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  expiresAt: Date;
  invitedBy: string;
  personalMessage?: string;
  permissions: {
    canEditTeam: boolean;
    canInviteMembers: boolean;
    canViewAnalytics: boolean;
  };
}

interface MemberInvitationProps {
  teamId: string;
  teamName: string;
  existingInvites: Invitation[];
  onInviteSent: (invite: Invitation) => void;
  isTeamLead?: boolean;
}

export function MemberInvitation({ 
  teamId, 
  teamName, 
  existingInvites, 
  onInviteSent,
  isTeamLead = false 
}: MemberInvitationProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      permissions: {
        canEditTeam: false,
        canInviteMembers: false,
        canViewAnalytics: true,
      },
    },
  });

  const watchedPermissions = watch('permissions');

  const sendInvitation = async (data: InviteFormData) => {
    try {
      // Check if email is already invited
      const existingInvite = existingInvites.find(
        invite => invite.email === data.email && invite.status === 'pending'
      );

      if (existingInvite) {
        toast.error('This email already has a pending invitation');
        return;
      }

      // Simulate API call
      const newInvite: Invitation = {
        id: `invite_${Date.now()}`,
        email: data.email,
        role: data.role,
        status: 'pending',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        invitedBy: 'current-user-id', // Would come from auth context
        personalMessage: data.personalMessage,
        permissions: data.permissions,
      };

      onInviteSent(newInvite);
      reset();
      setIsInviting(false);
      toast.success('Invitation sent successfully!');
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const resendInvitation = async (inviteId: string) => {
    try {
      // Simulate API call to resend
      toast.success('Invitation resent successfully!');
    } catch (error) {
      toast.error('Failed to resend invitation');
    }
  };

  const cancelInvitation = async (inviteId: string) => {
    try {
      // Simulate API call to cancel
      const updatedInvites = existingInvites.map(invite =>
        invite.id === inviteId ? { ...invite, status: 'expired' as const } : invite
      );
      toast.success('Invitation cancelled');
    } catch (error) {
      toast.error('Failed to cancel invitation');
    }
  };

  const getStatusIcon = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="space-y-6">
      {/* Invite New Member */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
            {!isInviting && (
              <button
                onClick={() => setIsInviting(true)}
                className="btn-primary flex items-center"
                disabled={!isTeamLead}
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Send Invitation
              </button>
            )}
          </div>
        </div>

        {isInviting && (
          <form onSubmit={handleSubmit(sendInvitation)} className="px-6 py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field pl-10"
                    placeholder="colleague@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  {...register('role')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Senior Data Scientist"
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                {...register('personalMessage')}
                rows={3}
                className="input-field"
                placeholder="Add a personal note to your invitation..."
              />
              {errors.personalMessage && (
                <p className="mt-1 text-sm text-red-600">{errors.personalMessage.message}</p>
              )}
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Member Permissions
                </label>
                <button
                  type="button"
                  onClick={() => setShowPermissions(!showPermissions)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {showPermissions ? 'Hide' : 'Show'} Permissions
                </button>
              </div>

              {showPermissions && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input
                      {...register('permissions.canEditTeam')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Can edit team profile and settings
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register('permissions.canInviteMembers')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Can invite new team members
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register('permissions.canViewAnalytics')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Can view team analytics and performance data
                    </label>
                  </div>
                </div>
              )}

              {!showPermissions && (
                <div className="text-sm text-gray-600">
                  Permissions: {Object.values(watchedPermissions).filter(Boolean).length} of 3 enabled
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsInviting(false);
                  reset();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Existing Invitations */}
      {existingInvites.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {existingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(invite.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{invite.email}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                            {invite.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{invite.role}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Sent {invite.sentAt.toLocaleDateString()}</span>
                          {invite.status === 'pending' && (
                            <span>{formatTimeRemaining(invite.expiresAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {invite.personalMessage && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        "{invite.personalMessage}"
                      </p>
                    )}
                  </div>

                  {invite.status === 'pending' && isTeamLead && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => resendInvitation(invite.id)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => cancelInvitation(invite.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Invitations Message */}
      {existingInvites.length === 0 && !isInviting && (
        <div className="card">
          <div className="px-6 py-12 text-center">
            <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending invitations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start building your team by inviting talented professionals to join.
            </p>
            {isTeamLead && (
              <div className="mt-6">
                <button
                  onClick={() => setIsInviting(true)}
                  className="btn-primary"
                >
                  Send First Invitation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}