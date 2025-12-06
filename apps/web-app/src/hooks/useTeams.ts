import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

interface Team {
  id: string;
  name: string;
  description: string;
  size: number;
  yearsWorking: number;
  cohesionScore: number;
  successfulProjects: number;
  clientSatisfaction: number;
  openToLiftout: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    id: string;
    userId?: string;
    name: string;
    role: string;
    experience: number;
    skills: string[];
    avatar?: string | null;
  }>;
  achievements: string[];
  industry: string;
  location: string;
  availability: string;
  compensation: {
    range: string;
    equity: boolean;
    benefits: string;
  };
}

interface CreateTeamData {
  name: string;
  description: string;
  members: Array<{
    name: string;
    role: string;
    experience: number;
    skills: string[];
  }>;
  industry?: string;
  location?: string;
  compensation?: {
    range: string;
    equity: boolean;
    benefits: string;
  };
}

interface TeamsFilters {
  search?: string;
  industry?: string;
  location?: string;
  minSize?: string;
  maxSize?: string;
  availability?: string;
  minExperience?: string;
  skills?: string;
  minCohesion?: string;
}

interface TeamsResponse {
  teams: Team[];
  total: number;
  filters: {
    industries: string[];
    locations: string[];
    sizes: number[];
  };
}

export function useTeams(filters?: TeamsFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['teams', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.industry) params.append('industry', filters.industry);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.minSize) params.append('minSize', filters.minSize);
      if (filters?.maxSize) params.append('maxSize', filters.maxSize);
      if (filters?.availability) params.append('availability', filters.availability);
      if (filters?.minExperience) params.append('minExperience', filters.minExperience);
      if (filters?.skills) params.append('skills', filters.skills);
      if (filters?.minCohesion) params.append('minCohesion', filters.minCohesion);

      const response = await fetch(`/api/teams?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data = await response.json();
      return data as TeamsResponse;
    },
    enabled: !!session,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (teamData: CreateTeamData) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockTeam: Team = {
          id: `demo-team-${Date.now()}`,
          name: teamData.name,
          description: teamData.description,
          size: teamData.members.length,
          yearsWorking: 0,
          cohesionScore: 0,
          successfulProjects: 0,
          clientSatisfaction: 0,
          openToLiftout: true,
          createdBy: session?.user?.id || 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          members: teamData.members.map((m, i) => ({ ...m, id: `demo-member-${i}` })),
          achievements: [],
          industry: teamData.industry || '',
          location: teamData.location || '',
          availability: 'available',
          compensation: teamData.compensation || { range: '', equity: false, benefits: '' },
        };
        console.log('[Demo] Created team:', mockTeam.id);
        return mockTeam;
      }

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team');
      }

      const data = await response.json();
      return data.team as Team;
    },
    onSuccess: () => {
      // Invalidate and refetch teams
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Team> & { id: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || id.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Updated team ${id}`);
        return { id, ...updates, updatedAt: new Date().toISOString() } as Team;
      }

      const response = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team');
      }

      const data = await response.json();
      return data.team as Team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (teamId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || teamId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Deleted team ${teamId}`);
        return { id: teamId };
      }

      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team');
      }

      return { id: teamId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}