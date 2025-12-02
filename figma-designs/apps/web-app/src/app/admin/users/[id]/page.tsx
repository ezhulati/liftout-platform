'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PauseIcon,
  PlayIcon,
  DocumentTextIcon,
  PlusIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import {
  useAdminUser,
  useUpdateUser,
  useSuspendUser,
  useUnsuspendUser,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
  useHardDeleteUser,
  useAdminNotes,
  useCreateAdminNote,
  useImpersonateUser,
} from '@/hooks/admin/useAdminUsers';
import { UserActionModal, DeleteUserModal, ImpersonateUserModal } from '@/components/admin/modals';

function UserTypeBadge({ type }: { type: string }) {
  const config = {
    individual: { label: 'Individual', icon: UserGroupIcon, color: 'bg-blue-500/10 text-blue-400' },
    company: { label: 'Company', icon: BuildingOfficeIcon, color: 'bg-green-500/10 text-green-400' },
    admin: { label: 'Admin', icon: ShieldCheckIcon, color: 'bg-red-500/10 text-red-400' },
  }[type] || { label: type, icon: UserCircleIcon, color: 'bg-gray-500/10 text-gray-400' };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${config.color}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
}

function StatusBadge({ user }: { user: any }) {
  if (user.deletedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-500/10 text-gray-400">
        <TrashIcon className="h-4 w-4" />
        Deleted
      </span>
    );
  }
  if (user.bannedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400">
        <NoSymbolIcon className="h-4 w-4" />
        Banned
      </span>
    );
  }
  if (user.suspendedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-500/10 text-yellow-400">
        <ExclamationTriangleIcon className="h-4 w-4" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-400">
      <CheckBadgeIcon className="h-4 w-4" />
      Active
    </span>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Data fetching
  const { data: user, isLoading, error, refetch } = useAdminUser(userId);
  const { data: notes, refetch: refetchNotes } = useAdminNotes('user', userId);

  // Mutations
  const updateUser = useUpdateUser();
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const deleteUser = useDeleteUser();
  const hardDeleteUser = useHardDeleteUser();
  const createNote = useCreateAdminNote();
  const impersonateUser = useImpersonateUser();

  // Modal states
  const [activeModal, setActiveModal] = useState<'suspend' | 'unsuspend' | 'ban' | 'unban' | 'delete' | 'impersonate' | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', userType: '' });
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Handlers
  const handleSuspend = async (reason: string) => {
    await suspendUser.mutateAsync({ userId, reason });
    toast.success('User suspended');
    refetch();
  };

  const handleUnsuspend = async () => {
    await unsuspendUser.mutateAsync(userId);
    toast.success('User unsuspended');
    refetch();
  };

  const handleBan = async (reason: string) => {
    await banUser.mutateAsync({ userId, reason });
    toast.success('User banned');
    refetch();
  };

  const handleUnban = async () => {
    await unbanUser.mutateAsync(userId);
    toast.success('User unbanned');
    refetch();
  };

  const handleSoftDelete = async (reason?: string) => {
    await deleteUser.mutateAsync({ userId, reason });
    toast.success('User deleted (soft)');
    router.push('/admin/users');
  };

  const handleHardDelete = async (confirmationEmail: string) => {
    await hardDeleteUser.mutateAsync({ userId, confirmationEmail });
    toast.success('User permanently deleted');
    router.push('/admin/users');
  };

  const handleImpersonate = async (reason: string) => {
    const result = await impersonateUser.mutateAsync({ userId, reason });
    return result;
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({
        userId,
        data: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          userType: editForm.userType as 'individual' | 'company' | 'admin',
        },
      });
      toast.success('User updated');
      setIsEditingInfo(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      await createNote.mutateAsync({
        entityType: 'user',
        entityId: userId,
        note: newNote.trim(),
      });
      toast.success('Note added');
      setNewNote('');
      refetchNotes();
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const startEditing = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      });
      setIsEditingInfo(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse"></div>
        <div className="h-48 bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Users
        </Link>
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-red-400">Failed to load user details</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserTypeBadge type={user.userType} />
          <StatusBadge user={user} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {!user.deletedAt && (
          <>
            {user.bannedAt ? (
              <button
                onClick={() => setActiveModal('unban')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
                Unban
              </button>
            ) : user.suspendedAt ? (
              <button
                onClick={() => setActiveModal('unsuspend')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
                Unsuspend
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveModal('suspend')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <PauseIcon className="h-4 w-4" />
                  Suspend
                </button>
                <button
                  onClick={() => setActiveModal('ban')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <NoSymbolIcon className="h-4 w-4" />
                  Ban
                </button>
              </>
            )}
            <button
              onClick={() => setActiveModal('impersonate')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
              Impersonate
            </button>
          </>
        )}
        <button
          onClick={() => setActiveModal('delete')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">User Information</h2>
              {!isEditingInfo && (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditingInfo ? (
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">User Type</label>
                    <select
                      value={editForm.userType}
                      onChange={(e) => setEditForm({ ...editForm, userType: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateUser.isPending}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <UserCircleIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <dt className="text-sm text-gray-500">Full Name</dt>
                      <dd className="text-white">{user.firstName} {user.lastName}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-white flex items-center gap-2">
                        {user.email}
                        {user.emailVerified ? (
                          <CheckBadgeIcon className="h-4 w-4 text-green-400" title="Verified" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-400" title="Not verified" />
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <dt className="text-sm text-gray-500">Joined</dt>
                      <dd className="text-white">{formatDate(user.createdAt)}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <dt className="text-sm text-gray-500">Last Active</dt>
                      <dd className="text-white">{formatTimeAgo(user.lastActive)}</dd>
                    </div>
                  </div>
                </dl>
              )}
            </div>
          </div>

          {/* Team Memberships */}
          {user.teamMemberships && user.teamMemberships.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-gray-500" />
                  Team Memberships ({user.teamMemberships.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-700">
                {user.teamMemberships.map((membership: any) => (
                  <div key={membership.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{membership.team.name}</p>
                      <p className="text-sm text-gray-400">Role: {membership.role}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      membership.team.verificationStatus === 'verified'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {membership.team.verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Memberships */}
          {user.companyMemberships && user.companyMemberships.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  Company Memberships ({user.companyMemberships.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-700">
                {user.companyMemberships.map((membership: any) => (
                  <div key={membership.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{membership.company.name}</p>
                      <p className="text-sm text-gray-400">Role: {membership.role}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      membership.company.verificationStatus === 'verified'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {membership.company.verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Skills ({user.skills.length})</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((userSkill: any) => (
                    <span
                      key={userSkill.id}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      title={`Proficiency: ${userSkill.proficiencyLevel}`}
                    >
                      {userSkill.skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Info */}
          {(user.suspendedAt || user.bannedAt || user.deletedAt) && (
            <div className={`border rounded-xl p-4 ${
              user.deletedAt
                ? 'bg-gray-500/10 border-gray-500/20'
                : user.bannedAt
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <h3 className={`font-medium ${
                user.deletedAt
                  ? 'text-gray-300'
                  : user.bannedAt
                    ? 'text-red-300'
                    : 'text-yellow-300'
              }`}>
                {user.deletedAt ? 'Account Deleted' : user.bannedAt ? 'Account Banned' : 'Account Suspended'}
              </h3>
              <p className={`text-sm mt-1 ${
                user.deletedAt
                  ? 'text-gray-400'
                  : user.bannedAt
                    ? 'text-red-400/80'
                    : 'text-yellow-400/80'
              }`}>
                {user.deletedAt
                  ? formatDate(user.deletedAt)
                  : user.bannedAt
                    ? formatDate(user.bannedAt)
                    : user.suspendedAt
                      ? formatDate(user.suspendedAt)
                      : 'Unknown'}
              </p>
              {(user.bannedReason || user.suspendedReason) && (
                <p className={`text-sm mt-2 ${
                  user.bannedAt ? 'text-red-300/80' : 'text-yellow-300/80'
                }`}>
                  Reason: {user.bannedReason || user.suspendedReason}
                </p>
              )}
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                Admin Notes
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Add note form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !newNote.trim()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <PlusIcon className="h-4 w-4" />
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </button>
              </form>

              {/* Notes list */}
              {notes && notes.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notes.map((note: any) => (
                    <div key={note.id} className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-300">{note.note}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {note.createdByUser
                            ? `${note.createdByUser.firstName} ${note.createdByUser.lastName}`
                            : 'System'}
                        </span>
                        <span>{formatTimeAgo(note.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-4">Account Stats</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Teams</dt>
                <dd className="text-white font-medium">{user.teamMemberships?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Companies</dt>
                <dd className="text-white font-medium">{user.companyMemberships?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Skills</dt>
                <dd className="text-white font-medium">{user.skills?.length || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(activeModal === 'suspend' || activeModal === 'unsuspend' || activeModal === 'ban' || activeModal === 'unban') && (
        <UserActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirm={
            activeModal === 'suspend' ? handleSuspend :
            activeModal === 'unsuspend' ? handleUnsuspend :
            activeModal === 'ban' ? handleBan :
            handleUnban
          }
          action={activeModal}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.email}
        />
      )}

      {activeModal === 'delete' && (
        <DeleteUserModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleHardDelete}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.email}
        />
      )}

      {activeModal === 'impersonate' && (
        <ImpersonateUserModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirm={handleImpersonate}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.email}
        />
      )}
    </div>
  );
}
