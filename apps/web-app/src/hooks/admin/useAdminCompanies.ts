import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Types
interface AdminCompany {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  industry: string | null;
  website: string | null;
  verificationStatus: string;
  createdAt: string;
  deletedAt: string | null;
  _count: {
    users: number;
    opportunities: number;
  };
}

interface AdminCompanyDetail extends AdminCompany {
  users: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      profile: { profilePhotoUrl: string | null } | null;
    };
  }>;
  opportunities: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

interface AdminCompaniesFilters {
  query?: string;
  verificationStatus?: string;
  status?: 'active' | 'deleted';
  limit?: number;
  offset?: number;
}

interface AdminCompaniesResponse {
  companies: AdminCompany[];
  total: number;
  limit: number;
  offset: number;
}

// Fetch all companies with filters
export function useAdminCompanies(filters?: AdminCompaniesFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'companies', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.verificationStatus) params.append('verificationStatus', filters.verificationStatus);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));

      const response = await fetch(`/api/admin/companies?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch companies');
      }

      return response.json() as Promise<AdminCompaniesResponse>;
    },
    enabled: !!session && session.user?.userType === 'admin',
  });
}

// Fetch single company details
export function useAdminCompany(companyId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'companies', companyId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/companies/${companyId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch company');
      }

      const data = await response.json();
      return data.company as AdminCompanyDetail;
    },
    enabled: !!session && session.user?.userType === 'admin' && !!companyId,
  });
}

// Update company
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      data,
    }: {
      companyId: string;
      data: Partial<{
        name: string;
        description: string;
        industry: string;
        verificationStatus: 'pending' | 'verified' | 'rejected';
      }>;
    }) => {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update company');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies', variables.companyId] });
    },
  });
}

// Verify company
export function useVerifyCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch(`/api/admin/companies/${companyId}/verify`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify company');
      }

      return response.json();
    },
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies', companyId] });
    },
  });
}

// Reject company verification
export function useRejectCompanyVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, reason }: { companyId: string; reason?: string }) => {
      const response = await fetch(`/api/admin/companies/${companyId}/verify`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject company verification');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies', variables.companyId] });
    },
  });
}

// Delete company (soft)
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete company');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
    },
  });
}
