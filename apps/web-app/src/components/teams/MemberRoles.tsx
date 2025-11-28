'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  UserIcon,
  StarIcon,
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
      return <StarIcon className="h-5 w-5 text-gold" />;
    case 'admin':
      return <ShieldCheckIcon className="h-5 w-5 text-navy" />;
    case 'member':
      return <UserIcon className="h-5 w-5 text-text-secondary" />;
  }
};

const getRoleBadgeColor = (role: TeamRole) => {
  switch (role) {
    case 'leader':
      return 'bg-gold-100 text-gold-800';
    case 'admin':
      return 'bg-navy-50 text-navy-800';
    case 'member':
      return 'bg-bg-alt text-text-secondary';
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-text-primary mb-4">
                  Change Role for {member.name}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Current Role */}
                  <div className="bg-bg-alt rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <span className="text-sm font-medium text-text-secondary">
                        Current: {ROLE_DESCRIPTIONS[member.role].title}
                      </span>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                                ? 'border-navy bg-navy-50' 
                                : canChange 
                                  ? 'border-border hover:border-border' 
                                  : 'border-border bg-bg-alt cursor-not-allowed opacity-60'
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
                                <span className="font-medium text-text-primary">
                                  {description.title}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary mt-1">
                                {description.description}
                              </p>
                              {!canChange && (
                                <p className="text-xs text-error mt-1">
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
                    <label htmlFor="reason" className="block text-sm font-medium text-text-secondary mb-2">
                      Reason (Optional)
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy"
                      placeholder="Why are you changing this person's role?"
                    />
                  </div>

                  {/* Warning for role changes */}
                  {selectedRole !== member.role && (
                    <div className="bg-gold-50 border border-gold/30 rounded-md p-3">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gold-800">
                            Role Change Impact
                          </h3>
                          <p className="mt-1 text-sm text-gold-700">
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
                      className="px-4 py-2 text-sm font-medium text-text-secondary bg-bg-surface border border-border rounded-md shadow-sm hover:bg-bg-alt focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || selectedRole === member.role}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-navy border border-transparent rounded-md shadow-sm hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
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
        user ? teamPermissionService.getTeamMember(teamId, user.id) : null
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
        user.id, 
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
      
      await teamPermissionService.removeTeamMember(teamId, member.userId, user.id);
      
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
        <div className="h-4 bg-bg-alt rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-bg-alt rounded"></div>
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
          <UserGroupIcon className="h-6 w-6 text-navy mr-2" />
          <h3 className="text-lg font-medium text-text-primary">
            Team Members ({members.length})
          </h3>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-bg-surface rounded-lg border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div key={member.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-bg-alt flex items-center justify-center">
                      <span className="text-sm font-medium text-text-secondary">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-text-primary">
                        {member.name}
                      </h4>
                      {member.userId === user?.id && (
                        <span className="text-xs text-navy font-medium">(You)</span>
                      )}
                    </div>
                    <p className="text-sm text-text-tertiary">{member.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        <span className="mr-1">{getRoleIcon(member.role)}</span>
                        {ROLE_DESCRIPTIONS[member.role].title}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        Joined {formatDistanceToNow(
                          member.joinedAt instanceof Date ? member.joinedAt : member.joinedAt.toDate(), 
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canEditRoles && member.userId !== user?.id && (
                    <button
                      onClick={() => openRoleModal(member)}
                      disabled={actionLoading === member.id}
                      className="p-1 text-text-tertiary hover:text-navy-800 transition-colors disabled:opacity-50"
                      title="Change role"
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                    </button>
                  )}

                  {canRemoveMembers && member.userId !== user?.id && (
                    <button
                      onClick={() => handleRemoveMember(member)}
                      disabled={actionLoading === member.id}
                      className="p-1 text-text-tertiary hover:text-error transition-colors disabled:opacity-50"
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