import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  role: string;
  experience: number;
  education?: string;
  skills: string[];
  avatar?: string | null;
  isLead?: boolean;
  joinedAt?: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface MyTeam {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  size: number;
  yearsWorkingTogether: number;
  availabilityStatus: 'available' | 'interviewing' | 'not_available';
  openToLiftout: boolean;
  visibility: 'public' | 'anonymous' | 'private';
  createdBy: string;
  createdAt: string;
  members: TeamMember[];
  invitations: TeamInvitation[];
  compensation?: {
    range?: string;
    equity?: boolean;
    benefits?: string;
  };
}

export type UserTeamRole = 'owner' | 'lead' | 'member';

export interface UseMyTeamResult {
  team: MyTeam | null;
  isLoading: boolean;
  error: Error | null;
  userRole: UserTeamRole;
  isTeamLead: boolean;
  isOwner: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canRemoveMembers: boolean;
  canDelete: boolean;
  refetch: () => void;
  updateTeam: (data: Partial<MyTeam>) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, newRole: string, isLead?: boolean) => Promise<void>;
  sendInvite: (email: string, role?: string) => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
  resendInvite: (inviteId: string) => Promise<void>;
  leaveTeam: () => Promise<void>;
  deleteTeam: () => Promise<void>;
}

export function useMyTeam(): UseMyTeamResult {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = (session?.user as any)?.id;

  // Fetch user's team
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-team', userId],
    queryFn: async () => {
      const response = await fetch('/api/teams/my-team');
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No team
        }
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      return data.team as MyTeam;
    },
    enabled: !!userId,
  });

  const team = data ?? null;

  // Determine user's role
  const isOwner = team?.createdBy === userId;
  const currentMember = team?.members.find(m => m.userId === userId);
  const isTeamLead = isOwner || currentMember?.isLead === true;
  const userRole: UserTeamRole = isOwner ? 'owner' : isTeamLead ? 'lead' : 'member';

  // Permissions
  const canEdit = isOwner || isTeamLead;
  const canInvite = isOwner || isTeamLead;
  const canRemoveMembers = isOwner || isTeamLead;
  const canDelete = isOwner;

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (updates: Partial<MyTeam>) => {
      const response = await fetch(`/api/teams/${team?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Team updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/teams/${team?.id}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Member removed');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ memberId, newRole, isLead }: { memberId: string; newRole: string; isLead?: boolean }) => {
      const response = await fetch(`/api/teams/${team?.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, isLead }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update member role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Member role updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Send invite mutation
  const sendInviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role?: string }) => {
      const response = await fetch('/api/teams/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team?.id, email, role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Invitation sent');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Cancel invite mutation
  const cancelInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await fetch(`/api/teams/invitations/${inviteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invitation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Invitation cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Resend invite mutation
  const resendInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await fetch(`/api/teams/invitations/${inviteId}/resend`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend invitation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      toast.success('Invitation resent');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Leave team mutation
  const leaveTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${team?.id}/leave`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to leave team');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('You have left the team');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${team?.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    team,
    isLoading,
    error: error as Error | null,
    userRole,
    isTeamLead,
    isOwner,
    canEdit,
    canInvite,
    canRemoveMembers,
    canDelete,
    refetch,
    updateTeam: async (data) => { await updateTeamMutation.mutateAsync(data); },
    removeMember: async (memberId) => { await removeMemberMutation.mutateAsync(memberId); },
    updateMemberRole: async (memberId, newRole, isLead) => {
      await updateMemberRoleMutation.mutateAsync({ memberId, newRole, isLead });
    },
    sendInvite: async (email, role) => { await sendInviteMutation.mutateAsync({ email, role }); },
    cancelInvite: async (inviteId) => { await cancelInviteMutation.mutateAsync(inviteId); },
    resendInvite: async (inviteId) => { await resendInviteMutation.mutateAsync(inviteId); },
    leaveTeam: async () => { await leaveTeamMutation.mutateAsync(); },
    deleteTeam: async () => { await deleteTeamMutation.mutateAsync(); },
  };
}
