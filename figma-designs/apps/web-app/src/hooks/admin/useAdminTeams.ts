import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Types
interface AdminTeam {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  industry: string | null;
  size: number;
  location: string | null;
  verificationStatus: string;
  createdAt: string;
  deletedAt: string | null;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  _count: {
    members: number;
    applications: number;
  };
}

interface AdminTeamDetail extends AdminTeam {
  applications: Array<{
    id: string;
    status: string;
    createdAt: string;
    opportunity: {
      id: string;
      title: string;
    } | null;
  }>;
}

interface AdminTeamsFilters {
  query?: string;
  verificationStatus?: string;
  status?: 'active' | 'deleted';
  limit?: number;
  offset?: number;
}

interface AdminTeamsResponse {
  teams: AdminTeam[];
  total: number;
  limit: number;
  offset: number;
}

// Fetch all teams with filters
export function useAdminTeams(filters?: AdminTeamsFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'teams', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.verificationStatus) params.append('verificationStatus', filters.verificationStatus);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));

      const response = await fetch(`/api/admin/teams?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch teams');
      }

      return response.json() as Promise<AdminTeamsResponse>;
    },
    enabled: !!session && session.user?.userType === 'admin',
  });
}

// Fetch single team details
export function useAdminTeam(teamId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'teams', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/teams/${teamId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch team');
      }

      const data = await response.json();
      return data.team as AdminTeamDetail;
    },
    enabled: !!session && session.user?.userType === 'admin' && !!teamId,
  });
}

// Update team
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      data,
    }: {
      teamId: string;
      data: Partial<{
        name: string;
        description: string;
        industry: string;
        verificationStatus: 'pending' | 'verified' | 'rejected';
      }>;
    }) => {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams', variables.teamId] });
    },
  });
}

// Verify team
export function useVerifyTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await fetch(`/api/admin/teams/${teamId}/verify`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify team');
      }

      return response.json();
    },
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams', teamId] });
    },
  });
}

// Reject team verification
export function useRejectTeamVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, reason }: { teamId: string; reason?: string }) => {
      const response = await fetch(`/api/admin/teams/${teamId}/verify`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject team verification');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams', variables.teamId] });
    },
  });
}

// Delete team (soft)
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
    },
  });
}
