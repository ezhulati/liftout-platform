'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
 * Hook to fetch unread count
 */
export function useUnreadCount() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const data = await fetchWithAuth('/api/conversations/unread');
      return data.data.unreadCount as number;
    },
    enabled: !!session,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateConversationInput) => {
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

  return useMutation({
    mutationFn: async ({
      conversationId,
      ...input
    }: SendMessageInput & { conversationId: string }) => {
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

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => {
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

  return useMutation({
    mutationFn: async (conversationId: string) => {
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

  return useMutation({
    mutationFn: async (conversationId: string) => {
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

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
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

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      await fetchWithAuth(`/api/conversations/${conversationId}/participants/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] });
    },
  });
}
