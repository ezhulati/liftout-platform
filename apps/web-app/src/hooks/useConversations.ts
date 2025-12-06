'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// Types
export interface Participant {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  leftAt: string | null;
  lastReadAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profile?: {
      profilePhotoUrl?: string;
      title?: string;
    };
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'file' | 'system' | 'video_invite';
  attachments: any[];
  sentAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profile?: {
      profilePhotoUrl?: string;
    };
  };
  replyTo?: {
    id: string;
    content: string;
    sender?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface Conversation {
  id: string;
  teamId?: string;
  companyId?: string;
  opportunityId?: string;
  subject?: string;
  status: 'active' | 'archived' | 'blocked';
  isAnonymous: boolean;
  lastMessageAt?: string;
  messageCount: number;
  unreadCounts: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages?: Message[];
}

export interface CreateConversationInput {
  teamId?: string;
  companyId?: string;
  opportunityId?: string;
  subject?: string;
  participantIds: string[];
  initialMessage?: {
    content: string;
    messageType?: 'text' | 'file' | 'system' | 'video_invite';
  };
  /** Whether the team being contacted is anonymous (requires NDA acceptance) */
  isAnonymous?: boolean;
  /** Whether the user has accepted the NDA (required for anonymous teams) */
  acceptNDA?: boolean;
}

export interface SendMessageInput {
  content: string;
  messageType?: 'text' | 'file' | 'system' | 'video_invite';
  replyToId?: string;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
    fileSize: number;
  }>;
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

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
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
}

/**
 * Hook to fetch user's conversations
 */
export function useConversations(page = 1, limit = 20) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['conversations', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const data = await fetchWithAuth(`/api/conversations?${params}`);
      return data.data as PaginatedResponse<Conversation>;
    },
    enabled: !!session,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a single conversation
 */
export function useConversation(id: string | null) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      if (!id) throw new Error('Conversation ID required');
      const data = await fetchWithAuth(`/api/conversations/${id}`);
      return data.data as Conversation;
    },
    enabled: !!session && !!id,
  });
}

/**
 * Hook to fetch messages for a conversation
 */
export function useMessages(conversationId: string | null, page = 1, limit = 50) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['messages', conversationId, page, limit],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID required');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const data = await fetchWithAuth(`/api/conversations/${conversationId}/messages?${params}`);
      return data.data as PaginatedResponse<Message>;
    },
    enabled: !!session && !!conversationId,
    staleTime: 10000, // 10 seconds
  });
}

/**
 * Hook to fetch unread count with smart polling
 * - Polls every 10 seconds when window is focused
 * - Polls every 60 seconds when window is in background
 * - Stops polling when user is idle for 5 minutes
 */
export function useUnreadCount() {
  const { data: session } = useSession();
  const [isFocused, setIsFocused] = React.useState(true);
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  // Track window focus state
  React.useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleActivity = () => setLastActivity(Date.now());

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Calculate polling interval based on focus and activity
  const getPollingInterval = () => {
    const idleTime = Date.now() - lastActivity;
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (idleTime > FIVE_MINUTES) return false; // Stop polling when idle
    if (isFocused) return 10000; // 10 seconds when focused
    return 60000; // 60 seconds when in background
  };

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const data = await fetchWithAuth('/api/conversations/unread');
      return data.data.unreadCount as number;
    },
    enabled: !!session,
    refetchInterval: getPollingInterval(),
    refetchIntervalInBackground: true,
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (input: CreateConversationInput) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockConversation: Conversation = {
          id: `demo-conv-${Date.now()}`,
          teamId: input.teamId,
          companyId: input.companyId,
          opportunityId: input.opportunityId,
          subject: input.subject,
          status: 'active',
          isAnonymous: false,
          messageCount: input.initialMessage ? 1 : 0,
          unreadCounts: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          participants: [],
        };
        console.log('[Demo] Created conversation:', mockConversation.id);
        return mockConversation;
      }

      const data = await fetchWithAuth('/api/conversations', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      conversationId,
      ...input
    }: SendMessageInput & { conversationId: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || conversationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const mockMessage: Message = {
          id: `demo-msg-${Date.now()}`,
          conversationId,
          senderId: session?.user?.id || 'demo-user',
          content: input.content,
          messageType: input.messageType || 'text',
          attachments: input.attachments || [],
          sentAt: new Date().toISOString(),
          editedAt: null,
          deletedAt: null,
        };
        console.log('[Demo] Sent message:', mockMessage.id);
        return mockMessage;
      }

      const data = await fetchWithAuth(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return data.data as Message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to edit a message
 */
export function useEditMessage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
      content,
    }: {
      conversationId: string;
      messageId: string;
      content: string;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || messageId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Edited message ${messageId}`);
        return { id: messageId, content, editedAt: new Date().toISOString() } as Message;
      }

      const data = await fetchWithAuth(
        `/api/conversations/${conversationId}/messages/${messageId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ content }),
        }
      );
      return data.data as Message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || messageId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Deleted message ${messageId}`);
        return;
      }

      await fetchWithAuth(`/api/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

/**
 * Hook to mark messages as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || conversationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`[Demo] Marked conversation ${conversationId} as read`);
        return;
      }

      await fetchWithAuth(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to archive a conversation
 */
export function useArchiveConversation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || conversationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Archived conversation ${conversationId}`);
        return;
      }

      await fetchWithAuth(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Hook to add a participant to a conversation
 */
export function useAddParticipant() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || conversationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Added participant ${userId} to conversation ${conversationId}`);
        return { success: true };
      }

      const data = await fetchWithAuth(`/api/conversations/${conversationId}/participants`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] });
    },
  });
}

/**
 * Hook to remove a participant from a conversation
 */
export function useRemoveParticipant() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || conversationId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Removed participant ${userId} from conversation ${conversationId}`);
        return;
      }

      await fetchWithAuth(`/api/conversations/${conversationId}/participants/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] });
    },
  });
}
