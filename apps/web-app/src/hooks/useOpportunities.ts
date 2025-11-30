import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: string;
  description: string;
  teamSize: string;
  compensation: string;
  location: string;
  timeline: string;
  requirements: string[];
  whatWeOffer: string[];
  integrationPlan: string;
  confidential: boolean;
  urgent: boolean;
  industry: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  applications: any[];
}

interface CreateOpportunityData {
  title: string;
  company: string;
  type?: string;
  description: string;
  teamSize?: string;
  compensation: string;
  location?: string;
  timeline?: string;
  requirements?: string[];
  whatWeOffer?: string[];
  integrationPlan?: string;
  confidential?: boolean;
  urgent?: boolean;
  industry?: string;
}

interface OpportunitiesFilters {
  search?: string;
  industry?: string;
  location?: string;
  type?: string;
  urgent?: string;
  confidential?: string;
  skills?: string;
  minCompensation?: string;
  maxCompensation?: string;
  teamSizeMin?: string;
  teamSizeMax?: string;
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
  total: number;
  filters: {
    industries: string[];
    locations: string[];
    types: string[];
  };
}

export function useOpportunities(filters?: OpportunitiesFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.industry) params.append('industry', filters.industry);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.urgent) params.append('urgent', filters.urgent);
      if (filters?.confidential) params.append('confidential', filters.confidential);
      if (filters?.skills) params.append('skills', filters.skills);
      if (filters?.minCompensation) params.append('minCompensation', filters.minCompensation);
      if (filters?.maxCompensation) params.append('maxCompensation', filters.maxCompensation);
      if (filters?.teamSizeMin) params.append('teamSizeMin', filters.teamSizeMin);
      if (filters?.teamSizeMax) params.append('teamSizeMax', filters.teamSizeMax);

      const response = await fetch(`/api/opportunities?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const data = await response.json();
      return data as OpportunitiesResponse;
    },
    enabled: !!session,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (opportunityData: CreateOpportunityData) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockOpportunity = {
          id: `demo-opp-${Date.now()}`,
          ...opportunityData,
          type: opportunityData.type || 'liftout',
          createdBy: session?.user?.id || 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          applications: [],
        } as Opportunity;
        console.log('[Demo] Created opportunity:', mockOpportunity.id);
        return mockOpportunity;
      }

      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create opportunity');
      }

      const data = await response.json();
      return data.opportunity as Opportunity;
    },
    onSuccess: () => {
      // Invalidate and refetch opportunities
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Opportunity> & { id: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || id.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Updated opportunity ${id}`);
        return { id, ...updates, updatedAt: new Date().toISOString() } as Opportunity;
      }

      const response = await fetch(`/api/opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update opportunity');
      }

      const data = await response.json();
      return data.opportunity as Opportunity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (opportunityId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || opportunityId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Deleted opportunity ${opportunityId}`);
        return { id: opportunityId };
      }

      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete opportunity');
      }

      return { id: opportunityId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}