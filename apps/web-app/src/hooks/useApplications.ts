'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// Types matching the API server response
export interface TeamApplication {
  id: string;
  teamId: string;
  opportunityId: string;
  submittedById: string;
  coverLetter: string | null;
  teamFitExplanation: string | null;
  questionsForCompany: string | null;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  reviewedAt: string | null;
  reviewedById: string | null;
  interviewScheduledAt: string | null;
  interviewNotes: string | null;
  internalNotes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  team?: {
    id: string;
    name: string;
    description: string | null;
    size: number;
    isAnonymous: boolean;
  };
  opportunity?: {
    id: string;
    title: string;
    company?: {
      id: string;
      name: string;
    };
  };
  submittedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ExpressionOfInterest {
  id: string;
  companyId: string;
  teamId: string;
  submittedById: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
  };
}

export interface CreateApplicationInput {
  teamId: string;
  opportunityId: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusInput {
  status: 'reviewing' | 'interviewing' | 'accepted' | 'rejected' | 'withdrawn';
  internalNotes?: string;
  rejectionReason?: string;
}

export interface ScheduleInterviewInput {
  scheduledAt: string;
  notes?: string;
}

export interface ApplicationFeedbackInput {
  feedback: string;
  rating?: number;
}

interface ApplicationFilters {
  status?: string;
  teamId?: string;
  opportunityId?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API base
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

/**
 * Hook to fetch team applications
 */
export function useApplications(filters?: ApplicationFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.teamId) params.append('teamId', filters.teamId);
      if (filters?.opportunityId) params.append('opportunityId', filters.opportunityId);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetchWithAuth(`/api/applications?${params}`);
      // Return the response with data array for consistency
      return {
        data: response.data || response.applications || [],
        pagination: response.pagination,
      } as PaginatedResponse<TeamApplication>;
    },
    enabled: !!session,
  });
}

/**
 * Hook to fetch a single application
 */
export function useApplication(id: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id) throw new Error('Application ID required');
      const data = await fetchWithAuth(`/api/applications/${id}`);
      return data.data as TeamApplication;
    },
    enabled: !!session && !!id,
  });
}

/**
 * Hook to fetch applications for a specific team
 */
export function useTeamApplications(teamId: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['teamApplications', teamId],
    queryFn: async () => {
      if (!teamId) throw new Error('Team ID required');
      const data = await fetchWithAuth(`/api/applications/team/${teamId}`);
      return data.data as TeamApplication[];
    },
    enabled: !!session && !!teamId,
  });
}

/**
 * Hook to fetch applications for a specific opportunity
 */
export function useOpportunityApplications(opportunityId: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['opportunityApplications', opportunityId],
    queryFn: async () => {
      if (!opportunityId) throw new Error('Opportunity ID required');
      const data = await fetchWithAuth(`/api/applications/opportunity/${opportunityId}`);
      return data.data as TeamApplication[];
    },
    enabled: !!session && !!opportunityId,
  });
}

/**
 * Hook to create a new application
 */
export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (input: CreateApplicationInput) => {
      // Demo user handling - simulate success
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockApplication: TeamApplication = {
          id: `demo-app-${Date.now()}`,
          teamId: input.teamId,
          opportunityId: input.opportunityId,
          submittedById: session?.user?.id || 'demo-user',
          coverLetter: input.coverLetter || null,
          teamFitExplanation: null,
          questionsForCompany: null,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          reviewedById: null,
          interviewScheduledAt: null,
          interviewNotes: null,
          internalNotes: null,
          rejectionReason: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('[Demo] Created application:', mockApplication.id);
        return mockApplication;
      }

      const data = await fetchWithAuth('/api/applications', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data as TeamApplication;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['teamApplications', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['opportunityApplications', variables.opportunityId] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

/**
 * Hook to update application status
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      applicationId,
      ...input
    }: UpdateApplicationStatusInput & { applicationId: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || applicationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Updated application ${applicationId} status to ${input.status}`);
        return {
          id: applicationId,
          teamId: 'demo-team',
          opportunityId: 'demo-opportunity',
          status: input.status,
        } as TeamApplication;
      }

      const data = await fetchWithAuth(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      return data.data as TeamApplication;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', result.id] });
      queryClient.invalidateQueries({ queryKey: ['teamApplications', result.teamId] });
      queryClient.invalidateQueries({ queryKey: ['opportunityApplications', result.opportunityId] });
    },
  });
}

/**
 * Hook to schedule an interview
 */
export function useScheduleInterview() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      applicationId,
      ...input
    }: ScheduleInterviewInput & { applicationId: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || applicationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Scheduled interview for application ${applicationId}`);
        return { id: applicationId, interviewScheduledAt: input.scheduledAt } as TeamApplication;
      }

      const data = await fetchWithAuth(`/api/applications/${applicationId}/interview`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data as TeamApplication;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', result.id] });
    },
  });
}

/**
 * Hook to add feedback to an application
 */
export function useAddApplicationFeedback() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      applicationId,
      ...input
    }: ApplicationFeedbackInput & { applicationId: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || applicationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Added feedback to application ${applicationId}`);
        return { success: true };
      }

      const data = await fetchWithAuth(`/api/applications/${applicationId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
    },
  });
}

/**
 * Hook to withdraw an application
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || applicationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Withdrew application ${applicationId}`);
        return { id: applicationId, teamId: 'demo-team', status: 'withdrawn' } as TeamApplication;
      }

      const data = await fetchWithAuth(`/api/applications/${applicationId}/withdraw`, {
        method: 'POST',
      });
      return data.data as TeamApplication;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', result.id] });
      queryClient.invalidateQueries({ queryKey: ['teamApplications', result.teamId] });
    },
  });
}

/**
 * Hook to make an offer to an application
 */
export function useMakeOffer() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      applicationId,
      ...offerDetails
    }: {
      applicationId: string;
      terms: string;
      compensation?: string;
      startDate?: string;
      expiresAt?: string;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || applicationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Made offer for application ${applicationId}`);
        return { success: true, applicationId, ...offerDetails };
      }

      const data = await fetchWithAuth(`/api/applications/${applicationId}/offer`, {
        method: 'POST',
        body: JSON.stringify(offerDetails),
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// ============================================
// Expression of Interest Hooks
// ============================================

/**
 * Hook to fetch expressions of interest for a team
 */
export function useTeamEOIs(teamId: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['teamEOIs', teamId],
    queryFn: async () => {
      if (!teamId) throw new Error('Team ID required');
      const data = await fetchWithAuth(`/api/applications/eoi/team/${teamId}`);
      return data.data as ExpressionOfInterest[];
    },
    enabled: !!session && !!teamId,
  });
}

/**
 * Hook to fetch expressions of interest from a company
 */
export function useCompanyEOIs(companyId: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['companyEOIs', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('Company ID required');
      const data = await fetchWithAuth(`/api/applications/eoi/company/${companyId}`);
      return data.data as ExpressionOfInterest[];
    },
    enabled: !!session && !!companyId,
  });
}

/**
 * Hook to create an expression of interest
 */
export function useCreateEOI() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (input: { teamId: string; message?: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockEOI: ExpressionOfInterest = {
          id: `demo-eoi-${Date.now()}`,
          companyId: session?.user?.id || 'demo-company',
          teamId: input.teamId,
          submittedById: session?.user?.id || 'demo-user',
          message: input.message || null,
          status: 'pending',
          expiresAt: null,
          respondedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('[Demo] Created EOI:', mockEOI.id);
        return mockEOI;
      }

      const data = await fetchWithAuth('/api/applications/eoi', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data as ExpressionOfInterest;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['teamEOIs', result.teamId] });
      queryClient.invalidateQueries({ queryKey: ['companyEOIs', result.companyId] });
    },
  });
}

/**
 * Hook to respond to an expression of interest
 */
export function useRespondToEOI() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      eoiId,
      accept,
    }: {
      eoiId: string;
      accept: boolean;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || eoiId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Responded to EOI ${eoiId}: ${accept ? 'accepted' : 'rejected'}`);
        return {
          id: eoiId,
          teamId: 'demo-team',
          companyId: 'demo-company',
          status: accept ? 'accepted' : 'rejected',
        } as ExpressionOfInterest;
      }

      const data = await fetchWithAuth(`/api/applications/eoi/${eoiId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ accept }),
      });
      return data.data as ExpressionOfInterest;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['teamEOIs', result.teamId] });
      queryClient.invalidateQueries({ queryKey: ['companyEOIs', result.companyId] });
    },
  });
}

// Legacy exports for backward compatibility
export function useUpdateApplication() {
  return useUpdateApplicationStatus();
}

export function useDeleteApplication() {
  return useWithdrawApplication();
}
