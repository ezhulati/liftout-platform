import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface Application {
  id: string;
  opportunityId: string;
  teamId: string;
  applicantUserId: string;
  coverLetter: string;
  whyInterested: string;
  questionsForCompany?: string;
  availabilityTimeline: string;
  compensationExpectations?: string;
  teamLead: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
  status: 'submitted' | 'under_review' | 'interview_scheduled' | 'offer_made' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  timeline: Array<{
    status: string;
    date: string;
    note: string;
    actor?: string;
  }>;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  };
}

interface CreateApplicationData {
  opportunityId: string;
  teamId: string;
  coverLetter: string;
  whyInterested: string;
  questionsForCompany?: string;
  availabilityTimeline: string;
  compensationExpectations?: string;
  teamLead: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
}

interface ApplicationsFilters {
  opportunityId?: string;
  teamId?: string;
  status?: string;
}

export function useApplications(filters?: ApplicationsFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.opportunityId) params.append('opportunityId', filters.opportunityId);
      if (filters?.teamId) params.append('teamId', filters.teamId);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`/api/applications?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      return data.applications as Application[];
    },
    enabled: !!session,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: CreateApplicationData) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create application');
      }

      const data = await response.json();
      return data.application as Application;
    },
    onSuccess: () => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      // Also invalidate opportunities to update application counts
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Application> & { id: string }) => {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application');
      }

      const data = await response.json();
      return data.application as Application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete application');
      }

      return { id: applicationId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}