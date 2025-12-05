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
  InformationCircleIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['member', 'admin', 'recruiter'], {
    required_error: 'Please select a role',
  }),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteCompanyMemberProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  onInvitationSent?: () => void;
}

const roleDescriptions = {
  member: 'Can view company information and team matches',
  admin: 'Can manage company settings, post opportunities, and invite members',
  recruiter: 'Can browse teams, manage applications, and conduct outreach',
};

export function InviteCompanyMember({
  isOpen,
  onClose,
  companyId,
  companyName,
  onInvitationSent,
}: InviteCompanyMemberProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'recruiter',
      message: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: InviteFormData) => {
    if (!user) {
      toast.error('You must be logged in to send invitations');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/companies/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          companyName,
          inviteeEmail: data.email,
          role: data.role,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }

      toast.success(`Invitation sent to ${data.email}`);
      setInviteLink(result.inviteLink);

      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      const fullUrl = `${window.location.origin}${inviteLink}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Invite link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setInviteLink(null);
      setCopied(false);
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
                      <UserPlusIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                        Invite team member
                      </Dialog.Title>
                      <p className="text-sm text-text-secondary">
                        Invite someone to join {companyName}
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

                {/* Success State - Show invite link */}
                {inviteLink ? (
                  <div className="space-y-4">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                      <CheckIcon className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="text-sm font-medium text-success-dark">
                        Invitation sent successfully!
                      </p>
                    </div>

                    <div className="bg-bg-alt rounded-lg p-4">
                      <p className="text-sm text-text-secondary mb-2">
                        Share this link with your colleague:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-bg-surface border border-border rounded px-3 py-2 truncate">
                          {window.location.origin}{inviteLink}
                        </code>
                        <button
                          onClick={handleCopyLink}
                          className="btn-outline min-h-10 px-3"
                        >
                          {copied ? (
                            <CheckIcon className="h-5 w-5 text-success" />
                          ) : (
                            <ClipboardIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <ButtonGroup>
                        <button
                          onClick={() => {
                            setInviteLink(null);
                            reset();
                          }}
                          className="btn-primary min-h-12"
                        >
                          Send another invitation
                        </button>
                        <TextLink onClick={handleClose}>
                          Done
                        </TextLink>
                      </ButtonGroup>
                    </div>
                  </div>
                ) : (
                  /* Form */
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
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
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
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex">
                        <InformationCircleIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-purple-800">
                            Invitation details
                          </h3>
                          <div className="mt-2 text-sm text-purple-700">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Invitation expires in 7 days</li>
                              <li>Invitee will receive an email with a link</li>
                              <li>If they don&apos;t have an account, they&apos;ll create one</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
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
                              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
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
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
