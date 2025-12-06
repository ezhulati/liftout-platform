'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import Link from 'next/link';
import {
  EllipsisVerticalIcon,
  UserIcon,
  PencilSquareIcon,
  StarIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface MemberRowMenuProps {
  memberId: string;
  memberUserId: string;
  memberName: string;
  memberRole: string;
  isLead: boolean;
  isCurrentUser: boolean;
  canEdit: boolean;
  canRemove: boolean;
  canMakeLead: boolean;
  canLeave: boolean;
  teamSize: number;
  onChangeRole: (memberId: string, newRole: string) => void;
  onMakeLead: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  onLeave: () => void;
}

export function MemberRowMenu({
  memberId,
  memberUserId,
  memberName,
  memberRole,
  isLead,
  isCurrentUser,
  canEdit,
  canRemove,
  canMakeLead,
  canLeave,
  teamSize,
  onChangeRole,
  onMakeLead,
  onRemove,
  onLeave,
}: MemberRowMenuProps) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMakeLeadModal, setShowMakeLeadModal] = useState(false);
  const [newRole, setNewRole] = useState(memberRole);

  const handleChangeRole = () => {
    onChangeRole(memberId, newRole);
    setShowRoleModal(false);
  };

  const handleMakeLead = () => {
    onMakeLead(memberId);
    setShowMakeLeadModal(false);
  };

  const handleRemove = () => {
    onRemove(memberId);
    setShowRemoveModal(false);
  };

  const handleLeave = () => {
    onLeave();
    setShowLeaveModal(false);
  };

  // Don't show menu if user has no actions available
  const hasActions = canEdit || canRemove || canLeave || isCurrentUser;
  if (!hasActions) return null;

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="min-h-10 min-w-10 flex items-center justify-center rounded-lg hover:bg-bg-alt transition-colors">
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
              {/* View Profile - always available */}
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={isCurrentUser ? '/app/profile' : `/app/profile/${memberUserId}`}
                    className={`${
                      active ? 'bg-bg-alt' : ''
                    } flex items-center px-4 py-3 text-sm text-text-primary`}
                  >
                    <UserIcon className="mr-3 h-5 w-5 text-text-tertiary" />
                    {isCurrentUser ? 'View my profile' : 'View profile'}
                  </Link>
                )}
              </Menu.Item>

              {/* Edit Role - for team leads editing others */}
              {canEdit && !isCurrentUser && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowRoleModal(true)}
                      className={`${
                        active ? 'bg-bg-alt' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-text-primary`}
                    >
                      <PencilSquareIcon className="mr-3 h-5 w-5 text-text-tertiary" />
                      Edit role
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Make Team Lead - for owners/leads promoting others */}
              {canMakeLead && !isCurrentUser && !isLead && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowMakeLeadModal(true)}
                      className={`${
                        active ? 'bg-bg-alt' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-text-primary`}
                    >
                      <StarIcon className="mr-3 h-5 w-5 text-gold" />
                      Make team lead
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Divider before destructive actions */}
              {((canRemove && !isCurrentUser) || (canLeave && isCurrentUser)) && (
                <div className="border-t border-border my-1" />
              )}

              {/* Remove Member - for leads removing others */}
              {canRemove && !isCurrentUser && teamSize > 2 && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowRemoveModal(true)}
                      className={`${
                        active ? 'bg-error-light' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-error`}
                    >
                      <TrashIcon className="mr-3 h-5 w-5" />
                      Remove from team
                    </button>
                  )}
                </Menu.Item>
              )}

              {/* Leave Team - for current user (non-lead) */}
              {canLeave && isCurrentUser && !isLead && teamSize > 2 && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className={`${
                        active ? 'bg-error-light' : ''
                      } flex items-center w-full px-4 py-3 text-sm text-error`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                      Leave team
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Change Role Modal */}
      <Transition appear show={showRoleModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowRoleModal(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                    Change role for {memberName}
                  </Dialog.Title>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="input-field min-h-12 w-full"
                      placeholder="e.g., Senior Analyst, Team Lead"
                    />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleChangeRole}
                      className="btn-primary min-h-12 flex-1"
                    >
                      Save changes
                    </button>
                    <button
                      onClick={() => setShowRoleModal(false)}
                      className="btn-outline min-h-12"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Make Lead Confirmation Modal */}
      <Transition appear show={showMakeLeadModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowMakeLeadModal(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                      <StarIconSolid className="h-6 w-6 text-gold" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                      Make {memberName} team lead?
                    </Dialog.Title>
                  </div>
                  <p className="text-text-secondary">
                    This will give {memberName} admin privileges including the ability to edit team details, invite members, and manage the team.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleMakeLead}
                      className="btn-primary min-h-12 flex-1"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowMakeLeadModal(false)}
                      className="btn-outline min-h-12"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Remove Member Confirmation Modal */}
      <Transition appear show={showRemoveModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowRemoveModal(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-error-light flex items-center justify-center">
                      <TrashIcon className="h-6 w-6 text-error" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                      Remove {memberName}?
                    </Dialog.Title>
                  </div>
                  <p className="text-text-secondary">
                    {memberName} will be removed from the team and will lose access to team conversations and opportunities. This action cannot be undone.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleRemove}
                      className="btn-primary min-h-12 flex-1 bg-error hover:bg-error-dark"
                    >
                      Remove member
                    </button>
                    <button
                      onClick={() => setShowRemoveModal(false)}
                      className="btn-outline min-h-12"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Leave Team Confirmation Modal */}
      <Transition appear show={showLeaveModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowLeaveModal(false)}>
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-error-light flex items-center justify-center">
                      <ArrowRightOnRectangleIcon className="h-6 w-6 text-error" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                      Leave team?
                    </Dialog.Title>
                  </div>
                  <p className="text-text-secondary">
                    Are you sure you want to leave this team? You will lose access to team conversations and opportunities. You can rejoin if invited again.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleLeave}
                      className="btn-primary min-h-12 flex-1 bg-error hover:bg-error-dark"
                    >
                      Leave team
                    </button>
                    <button
                      onClick={() => setShowLeaveModal(false)}
                      className="btn-outline min-h-12"
                    >
                      Stay
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
