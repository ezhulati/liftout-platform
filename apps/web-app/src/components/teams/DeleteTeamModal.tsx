'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

export function DeleteTeamModal({
  isOpen,
  onClose,
  teamId,
  teamName,
}: DeleteTeamModalProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmValid = confirmText === teamName;

  const handleDelete = async () => {
    if (!isConfirmValid) {
      toast.error('Please type the team name to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmName: confirmText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete team');
      }

      toast.success('Team deleted successfully');
      onClose();
      router.push('/app/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete team');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-error" />
                    </div>
                    <div className="ml-3">
                      <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                        Delete team
                      </Dialog.Title>
                      <p className="text-sm text-text-secondary">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-text-tertiary hover:text-text-primary transition-colors touch-target"
                    onClick={handleClose}
                    disabled={isDeleting}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Warning */}
                <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-error-dark font-medium mb-2">
                    You are about to permanently delete:
                  </p>
                  <p className="text-base font-bold text-text-primary">
                    {teamName}
                  </p>
                  <ul className="mt-3 text-sm text-text-secondary list-disc list-inside space-y-1">
                    <li>All team member associations will be removed</li>
                    <li>Pending applications will be cancelled</li>
                    <li>Message history will be deleted</li>
                    <li>This cannot be reversed</li>
                  </ul>
                </div>

                {/* Confirmation Input */}
                <FormField
                  label="Type the team name to confirm"
                  name="confirmText"
                  required
                  hint={`Enter "${teamName}" exactly as shown`}
                >
                  <input
                    type="text"
                    id="confirmText"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="input-field"
                    placeholder={teamName}
                    disabled={isDeleting}
                    autoComplete="off"
                  />
                </FormField>

                {/* Action Buttons */}
                <div className="mt-6">
                  <ButtonGroup>
                    <button
                      onClick={handleDelete}
                      disabled={!isConfirmValid || isDeleting}
                      className="btn-primary min-h-12 inline-flex items-center bg-error hover:bg-error-dark disabled:bg-error/50"
                    >
                      {isDeleting ? (
                        <>
                          <div className="loading-spinner mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="h-5 w-5 mr-2" />
                          Delete team permanently
                        </>
                      )}
                    </button>
                    <TextLink onClick={handleClose} disabled={isDeleting}>
                      Cancel
                    </TextLink>
                  </ButtonGroup>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
