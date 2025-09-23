'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  UserIcon,
  CrownIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  TeamPermissionMember, 
  TeamRole, 
  ROLE_DESCRIPTIONS, 
  teamPermissionService 
} from '@/lib/team-permissions';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface MemberRolesProps {
  teamId: string;
  onMemberUpdate?: () => void;
}

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamPermissionMember | null;
  currentUserRole: TeamRole | null;
  onRoleChange: (memberId: string, newRole: TeamRole, reason?: string) => void;
  loading: boolean;
}

const getRoleIcon = (role: TeamRole) => {
  switch (role) {
    case 'leader':
      return <CrownIcon className="h-5 w-5 text-yellow-600" />;
    case 'admin':
      return <ShieldCheckIcon className="h-5 w-5 text-blue-600" />;
    case 'member':
      return <UserIcon className="h-5 w-5 text-gray-600" />;
  }
};

const getRoleBadgeColor = (role: TeamRole) => {
  switch (role) {
    case 'leader':
      return 'bg-yellow-100 text-yellow-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    case 'member':
      return 'bg-gray-100 text-gray-800';
  }
};

function RoleChangeModal({ 
  isOpen, 
  onClose, 
  member, 
  currentUserRole, 
  onRoleChange, 
  loading 
}: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] = useState<TeamRole>('member');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
      setReason('');
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member && selectedRole !== member.role) {
      onRoleChange(member.id!, selectedRole, reason || undefined);
    }
  };

  const canChangeToRole = (role: TeamRole): boolean => {
    if (!currentUserRole || !member) return false;
    
    // Leaders can change anyone to any role (except removing the last leader)
    if (currentUserRole === 'leader') return true;
    
    // Admins can change members to any role, but cannot change leaders or other admins
    if (currentUserRole === 'admin') {
      return member.role === 'member';
    }
    
    return false;
  };

  if (!member) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                  Change Role for {member.name}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Current Role */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <span className="text-sm font-medium text-gray-700">
                        Current: {ROLE_DESCRIPTIONS[member.role].title}
                      </span>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Role
                    </label>
                    <div className="space-y-2">
                      {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => {
                        const roleKey = role as TeamRole;
                        const canChange = canChangeToRole(roleKey);
                        
                        return (
                          <label
                            key={role}
                            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedRole === role 
                                ? 'border-blue-500 bg-blue-50' 
                                : canChange 
                                  ? 'border-gray-200 hover:border-gray-300' 
                                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={role}
                              checked={selectedRole === role}
                              onChange={(e) => setSelectedRole(e.target.value as TeamRole)}
                              className="mt-1"
                              disabled={!canChange}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {getRoleIcon(roleKey)}
                                <span className="font-medium text-gray-900">
                                  {description.title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {description.description}
                              </p>
                              {!canChange && (
                                <p className="text-xs text-red-600 mt-1">
                                  You don't have permission to assign this role
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason (Optional)
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Why are you changing this person's role?"
                    />
                  </div>

                  {/* Warning for role changes */}
                  {selectedRole !== member.role && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Role Change Impact
                          </h3>
                          <p className="mt-1 text-sm text-yellow-700">
                            Changing roles will immediately update the member's permissions and access level.
                            This action will be recorded in the team's audit log.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || selectedRole === member.role}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Update Role
                        </>
                      )}
                    </button>
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

export function MemberRoles({ teamId, onMemberUpdate }: MemberRolesProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamPermissionMember[]>([]);
  const [currentUserMember, setCurrentUserMember] = useState<TeamPermissionMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamPermissionMember | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [teamId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const [teamMembers, currentMember] = await Promise.all([
        teamPermissionService.getTeamMembers(teamId),
        user ? teamPermissionService.getTeamMember(teamId, user.uid) : null
      ]);
      
      setMembers(teamMembers);
      setCurrentUserMember(currentMember);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: TeamRole, reason?: string) => {
    if (!user || !currentUserMember) return;

    try {
      setActionLoading(memberId);
      
      const member = members.find(m => m.id === memberId);
      if (!member) {
        throw new Error('Member not found');
      }

      await teamPermissionService.changeRole(
        teamId, 
        member.userId, 
        newRole, 
        user.uid, 
        reason
      );

      toast.success(`Role updated to ${ROLE_DESCRIPTIONS[newRole].title}`);
      setShowRoleModal(false);
      setSelectedMember(null);
      await loadMembers();
      if (onMemberUpdate) onMemberUpdate();

    } catch (error) {
      console.error('Error changing role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (member: TeamPermissionMember) => {
    if (!user || !currentUserMember) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the team? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(member.id!);
      
      await teamPermissionService.removeTeamMember(teamId, member.userId, user.uid);
      
      toast.success(`${member.name} has been removed from the team`);
      await loadMembers();
      if (onMemberUpdate) onMemberUpdate();

    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setActionLoading(null);
    }
  };

  const canEditRoles = currentUserMember?.permissions?.includes('members.edit.roles') || false;
  const canRemoveMembers = currentUserMember?.permissions?.includes('members.remove') || false;

  const openRoleModal = (member: TeamPermissionMember) => {
    setSelectedMember(member);
    setShowRoleModal(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Team Members ({members.length})
          </h3>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {member.name}
                      </h4>
                      {member.userId === user?.uid && (
                        <span className="text-xs text-blue-600 font-medium">(You)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        <span className="mr-1">{getRoleIcon(member.role)}</span>
                        {ROLE_DESCRIPTIONS[member.role].title}
                      </span>
                      <span className="text-xs text-gray-400">
                        Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canEditRoles && member.userId !== user?.uid && (
                    <button
                      onClick={() => openRoleModal(member)}
                      disabled={actionLoading === member.id}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                      title="Change role"
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                    </button>
                  )}

                  {canRemoveMembers && member.userId !== user?.uid && (
                    <button
                      onClick={() => handleRemoveMember(member)}
                      disabled={actionLoading === member.id}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Remove member"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Change Modal */}
      <RoleChangeModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        currentUserRole={currentUserMember?.role || null}
        onRoleChange={handleRoleChange}
        loading={actionLoading !== null}
      />
    </div>
  );
}