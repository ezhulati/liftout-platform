'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { where, orderBy } from 'firebase/firestore';
import { 
  userService, 
  teamService, 
  opportunityService, 
  applicationService, 
  messagingService, 
  notificationService 
} from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  Team, 
  Opportunity, 
  Application, 
  Conversation, 
  Message, 
  Notification 
} from '@/types/firebase';

// Teams hooks
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.searchTeams({}),
  });
}

export function useTeamsByUser() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['teams', 'user', userData?.id],
    queryFn: () => userData ? teamService.getTeamsByMember(userData.id) : [],
    enabled: !!userData,
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getTeamById(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamService.createTeam.bind(teamService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) => 
      teamService.updateTeam(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
    },
  });
}

// Opportunities hooks
export function useOpportunities(filters?: {
  industry?: string;
  location?: string;
  type?: string;
  skills?: string[];
}) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunityService.searchOpportunities(filters || {}),
  });
}

export function useOpportunitiesByCompany() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['opportunities', 'company', userData?.id],
    queryFn: () => userData ? opportunityService.getOpportunitiesByCompany(userData.id) : [],
    enabled: !!userData && userData.type === 'company',
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => opportunityService.getOpportunityById(id),
    enabled: !!id,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: opportunityService.createOpportunity.bind(opportunityService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) => 
      opportunityService.updateOpportunity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities', variables.id] });
    },
  });
}

// Applications hooks
export function useApplicationsByTeam() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['applications', 'team', userData?.id],
    queryFn: async () => {
      if (!userData) return [];
      const teams = await teamService.getTeamsByMember(userData.id);
      if (teams.length === 0) return [];
      
      const applications = await Promise.all(
        teams.map(team => applicationService.getApplicationsByTeam(team.id))
      );
      
      return applications.flat();
    },
    enabled: !!userData && userData.type === 'individual',
  });
}

export function useApplicationsByCompany() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['applications', 'company', userData?.id],
    queryFn: () => userData ? applicationService.getApplicationsByCompany(userData.id) : [],
    enabled: !!userData && userData.type === 'company',
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applicationService.createApplication.bind(applicationService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Application['status'] }) => 
      applicationService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// Messaging hooks
export function useConversations() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', userData?.id],
    queryFn: () => userData ? messagingService.getConversationsByUser(userData.id) : [],
    enabled: !!userData,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagingService.getMessagesByConversation(conversationId),
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messagingService.createConversation.bind(messagingService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => 
      messagingService.sendMessage(messageData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Notifications hooks
export function useNotifications() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', userData?.id],
    queryFn: () => userData ? notificationService.getNotificationsByUser(userData.id) : [],
    enabled: !!userData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUnreadNotifications() {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', 'unread', userData?.id],
    queryFn: () => userData ? notificationService.getNotificationsByUser(userData.id, true) : [],
    enabled: !!userData,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead.bind(notificationService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  
  return useMutation({
    mutationFn: () => userData ? notificationService.markAllAsRead(userData.id) : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Search hooks
export function useSearchTeams(filters: {
  industry?: string;
  location?: string;
  minSize?: number;
  maxSize?: number;
  skills?: string[];
  availability?: string;
}) {
  return useQuery({
    queryKey: ['search', 'teams', filters],
    queryFn: () => teamService.searchTeams(filters),
    enabled: Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined),
  });
}

export function useSearchOpportunities(filters: {
  industry?: string;
  location?: string;
  type?: string;
  minCompensation?: number;
  maxCompensation?: number;
  skills?: string[];
}) {
  return useQuery({
    queryKey: ['search', 'opportunities', filters],
    queryFn: () => opportunityService.searchOpportunities(filters),
    enabled: Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined),
  });
}

// Dashboard data hooks
export function useDashboardData() {
  const { userData } = useAuth();
  const isCompany = userData?.type === 'company';

  const teamsQuery = useTeamsByUser();

  // Call all hooks unconditionally to follow Rules of Hooks
  const companyOpportunitiesQuery = useOpportunitiesByCompany();
  const teamOpportunitiesQuery = useOpportunities();
  const companyApplicationsQuery = useApplicationsByCompany();
  const teamApplicationsQuery = useApplicationsByTeam();
  const notificationsQuery = useUnreadNotifications();

  // Select the appropriate data based on user type
  const opportunitiesQuery = isCompany ? companyOpportunitiesQuery : teamOpportunitiesQuery;
  const applicationsQuery = isCompany ? companyApplicationsQuery : teamApplicationsQuery;

  return {
    teams: teamsQuery.data || [],
    opportunities: opportunitiesQuery.data || [],
    applications: applicationsQuery.data || [],
    notifications: notificationsQuery.data || [],
    isLoading: teamsQuery.isLoading || opportunitiesQuery.isLoading || applicationsQuery.isLoading,
    error: teamsQuery.error || opportunitiesQuery.error || applicationsQuery.error,
  };
}