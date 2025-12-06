'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { DeleteTeamModal } from './DeleteTeamModal';

interface TeamCardMenuProps {
  teamId: string;
  teamName: string;
  isAvailable: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onToggleAvailability: () => void;
  onEditClick: () => void;
}

export function TeamCardMenu({
  teamId,
  teamName,
  isAvailable,
  canEdit,
  canDelete,
  onToggleAvailability,
  onEditClick,
}: TeamCardMenuProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!canEdit && !canDelete) return null;

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="min-h-12 min-w-12 flex items-center justify-center hover:bg-bg-alt rounded-lg transition-colors">
          <EllipsisVerticalIcon className="h-5 w-5 text-text-tertiary" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {/* Edit Team Details */}
              {canEdit && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onEditClick}
                      className={`${
                        active ? 'bg-bg-alt' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-text-primary`}
                    >
                      <PencilSquareIcon className="mr-3 h-5 w-5 text-text-tertiary" />
                      Edit team details
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Toggle Availability */}
              {canEdit && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onToggleAvailability}
                      className={`${
                        active ? 'bg-bg-alt' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-text-primary`}
                    >
                      {isAvailable ? (
                        <>
                          <XCircleIcon className="mr-3 h-5 w-5 text-text-tertiary" />
                          Mark as not available
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="mr-3 h-5 w-5 text-success" />
                          Mark as available
                        </>
                      )}
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Team Settings */}
              {canEdit && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push(`/app/teams/${teamId}/settings`)}
                      className={`${
                        active ? 'bg-bg-alt' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-text-primary`}
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5 text-text-tertiary" />
                      Team settings
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Divider before delete */}
              {canDelete && <div className="border-t border-border my-1" />}

              {/* Delete Team */}
              {canDelete && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className={`${
                        active ? 'bg-error-light' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-error`}
                    >
                      <TrashIcon className="mr-3 h-5 w-5" />
                      Delete team
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Delete Team Modal */}
      <DeleteTeamModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        teamId={teamId}
        teamName={teamName}
      />
    </>
  );
}
