'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { emailInvitationService, TeamInvitation } from '@/lib/email-invitations';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['member', 'admin', 'leader'], {
    required_error: 'Please select a role',
  }),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteMemberProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  onInvitationSent?: (invitation: TeamInvitation) => void;
}

const roleDescriptions = {
  member: 'Can view team information and contribute to projects',
  admin: 'Can manage team settings and invite new members',
  leader: 'Full control over team management and direction'
};

export function InviteMember({ 
  isOpen, 
  onClose, 
  teamId, 
  teamName, 
  onInvitationSent 
}: InviteMemberProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'member',
      message: ''
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: InviteFormData) => {
    if (!user) {
      toast.error('You must be logged in to send invitations');
      return;
    }

    setIsSubmitting(true);

    try {
      const invitationData = {
        teamId,
        teamName,
        inviterEmail: user.email!,
        inviterName: user.name || user.email!,
        inviteeEmail: data.email,
        role: data.role,
        message: data.message,
      };

      const invitationId = await emailInvitationService.sendInvitation(invitationData);
      
      const invitation: TeamInvitation = {
        id: invitationId,
        ...invitationData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      toast.success(`Invitation sent to ${data.email}`);
      
      // Call callback if provided
      if (onInvitationSent) {
        onInvitationSent(invitation);
      }

      // Reset form and close dialog
      reset();
      onClose();

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserPlusIcon className="h-6 w-6 text-navy" />
                    </div>
                    <div className="ml-3">
                      <Dialog.Title as="h3" className="text-lg font-medium text-text-primary">
                        Invite team member
                      </Dialog.Title>
                      <p className="text-sm text-text-secondary">
                        Invite someone to join "{teamName}"
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-text-tertiary hover:text-text-primary transition-colors touch-target"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <FormField label="Email address" name="email" required error={errors.email?.message}>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="input-field"
                      placeholder="colleague@company.com"
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField
                    label="Role"
                    name="role"
                    required
                    error={errors.role?.message}
                    hint={selectedRole ? roleDescriptions[selectedRole] : undefined}
                  >
                    <select
                      id="role"
                      {...register('role')}
                      className="input-field"
                      disabled={isSubmitting}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="leader">Leader</option>
                    </select>
                  </FormField>

                  <FormField label="Personal message" name="message" error={errors.message?.message}>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={3}
                      className="input-field"
                      placeholder="Add a personal note to your invitation..."
                      disabled={isSubmitting}
                    />
                  </FormField>

                  {/* Info Box */}
                  <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
                    <div className="flex">
                      <InformationCircleIcon className="h-5 w-5 text-navy flex-shrink-0" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-navy-900">
                          Invitation details
                        </h3>
                        <div className="mt-2 text-sm text-navy-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Invitation will expire in 7 days</li>
                            <li>The invitee will receive an email with instructions</li>
                            <li>You can revoke invitations before they're accepted</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - LEFT aligned per Practical UI */}
                  <div className="pt-4">
                    <ButtonGroup>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary min-h-12 inline-flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="loading-spinner mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                            Send invitation
                          </>
                        )}
                      </button>
                      <TextLink onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                      </TextLink>
                    </ButtonGroup>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}