import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
    name: string;
    role: string;
    experience: number;
    skills: string[];
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

  return useMutation({
    mutationFn: async (teamData: CreateTeamData) => {
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

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Team> & { id: string }) => {
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

  return useMutation({
    mutationFn: async (teamId: string) => {
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