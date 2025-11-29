import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Types
interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'individual' | 'company' | 'admin';
  emailVerified: boolean;
  createdAt: string;
  lastActive: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  bannedAt: string | null;
  bannedReason: string | null;
  deletedAt: string | null;
  profile: {
    profilePhotoUrl: string | null;
  } | null;
}

interface AdminUserDetail extends AdminUser {
  teamMemberships: Array<{
    id: string;
    role: string;
    team: {
      id: string;
      name: string;
      slug: string | null;
      verificationStatus: string;
    };
  }>;
  companyMemberships: Array<{
    id: string;
    role: string;
    company: {
      id: string;
      name: string;
      slug: string | null;
      verificationStatus: string;
    };
  }>;
  skills: Array<{
    id: string;
    proficiencyLevel: string;
    skill: {
      id: number;
      name: string;
      category: string | null;
    };
  }>;
}

interface AdminUsersFilters {
  query?: string;
  userType?: string;
  status?: 'active' | 'suspended' | 'banned' | 'deleted';
  verified?: boolean;
  limit?: number;
  offset?: number;
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

interface AdminNote {
  id: string;
  entityType: string;
  entityId: string;
  note: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  createdByUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

// Fetch all users with filters
export function useAdminUsers(filters?: AdminUsersFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.query) params.append('query', filters.query);
      if (filters?.userType) params.append('userType', filters.userType);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.verified !== undefined) params.append('verified', String(filters.verified));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      return response.json() as Promise<AdminUsersResponse>;
    },
    enabled: !!session && session.user?.userType === 'admin',
  });
}

// Fetch single user details
export function useAdminUser(userId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user');
      }

      const data = await response.json();
      return data.user as AdminUserDetail;
    },
    enabled: !!session && session.user?.userType === 'admin' && !!userId,
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        userType: 'individual' | 'company' | 'admin';
        emailVerified: boolean;
      }>;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });
    },
  });
}

// Suspend user
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to suspend user');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });
    },
  });
}

// Unsuspend user
export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unsuspend user');
      }

      return response.json();
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
    },
  });
}

// Ban user
export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to ban user');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });
    },
  });
}

// Unban user
export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unban user');
      }

      return response.json();
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
    },
  });
}

// Soft delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// Hard delete user (permanent)
export function useHardDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      confirmationEmail,
    }: {
      userId: string;
      confirmationEmail: string;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}/hard-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to permanently delete user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// Get admin notes for a user
export function useAdminNotes(entityType: string, entityId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['admin', 'notes', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${entityId}/notes`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notes');
      }

      const data = await response.json();
      return data.notes as AdminNote[];
    },
    enabled: !!session && session.user?.userType === 'admin' && !!entityId,
  });
}

// Create admin note
export function useCreateAdminNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      note,
    }: {
      entityType: string;
      entityId: string;
      note: string;
    }) => {
      const response = await fetch(`/api/admin/users/${entityId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create note');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'notes', variables.entityType, variables.entityId],
      });
    },
  });
}

// Start impersonation
export function useImpersonateUser() {
  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start impersonation');
      }

      return response.json() as Promise<{
        success: boolean;
        token: string;
        expiresAt: string;
        message: string;
      }>;
    },
  });
}

// End impersonation
export function useEndImpersonation() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/admin/users/impersonate?token=${token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to end impersonation');
      }

      return response.json();
    },
  });
}
