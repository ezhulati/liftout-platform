'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
  Conversation as APIConversation,
  Message as APIMessage,
} from '@/hooks/useConversations';
import {
  demoConversations,
  getMessagesWithSession,
  addDemoMessage,
} from '@/lib/demo-conversations';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WifiIcon,
  SignalIcon,
  ArrowLeftIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
} from '@heroicons/react/24/solid';

interface RealtimeMessageCenterProps {
  userId?: string;
}

// Transform API conversation to UI format
function transformConversation(conv: APIConversation) {
  return {
    id: conv.id,
    title: conv.subject || `Conversation with ${conv.participants.map(p => `${p.user.firstName} ${p.user.lastName}`).join(', ')}`,
    participants: conv.participants.map(p => ({
      userId: p.userId,
      name: `${p.user.firstName} ${p.user.lastName}`,
      email: '',
      role: p.role as any,
      title: p.user.profile?.title,
      profilePhotoUrl: p.user.profile?.profilePhotoUrl,
    })),
    securityLevel: 'high' as 'standard' | 'high' | 'maximum',
    encryptionEnabled: true,
    auditTrailEnabled: true,
    isConfidential: conv.isAnonymous,
    lastActivity: conv.lastMessageAt || conv.updatedAt,
    messageCount: conv.messageCount,
    unreadCounts: conv.unreadCounts,
    status: conv.status,
    teamId: conv.teamId,
    companyId: conv.companyId,
    opportunityId: conv.opportunityId,
    legalReviewRequired: false,
    retentionPolicy: 'standard' as 'standard' | 'legal_hold' | 'auto_delete',
  };
}

// Transform API message to UI format
function transformMessage(msg: APIMessage, currentUserId?: string) {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    senderName: msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Unknown',
    senderRole: 'team_lead' as const,
    content: msg.content,
    messageType: msg.messageType,
    timestamp: msg.sentAt,
    status: 'delivered' as 'sent' | 'delivered' | 'read',
    readBy: [] as any[],
    reactions: [] as any[],
    requiresAcknowledgment: false,
    acknowledgedBy: [] as string[],
    encryptionLevel: 'high' as 'standard' | 'high' | 'legal',
    accessLevel: 'parties_only' as const,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    attachments: msg.attachments || [],
    editedAt: msg.editedAt,
    deletedAt: msg.deletedAt,
    replyTo: msg.replyTo,
    subject: undefined as string | undefined,
  };
}

export function RealtimeMessageCenter({ userId }: RealtimeMessageCenterProps) {
  const { data: session } = useSession();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    typingUsers,
    startTyping,
    stopTyping,
  } = useSocket();

  // Check if this is a demo user (no Firestore user)
  const isDemoUser = !user && !!session;

  // API hooks
  const { data: conversationsData, isLoading: conversationsLoading, error: conversationsError } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { data: selectedConversationData } = useConversation(selectedConversationId);
  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedConversationId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const createConversationMutation = useCreateConversation();

  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'demo'>('connecting');
  const [demoMessages, setDemoMessages] = useState<APIMessage[]>([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [mobileShowConversation, setMobileShowConversation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Use demo mode if API failed or user is demo user
  const useDemoMode = isDemoUser || !!conversationsError || (!conversationsLoading && !conversationsData?.data?.length);

  // Transform API data or use demo data
  const conversations = useDemoMode
    ? demoConversations.map(transformConversation)
    : (conversationsData?.data?.map(transformConversation) || []);

  const selectedConversation = useDemoMode
    ? (selectedConversationId ? transformConversation(demoConversations.find(c => c.id === selectedConversationId)!) : null)
    : (selectedConversationData ? transformConversation(selectedConversationData) : null);

  // Use demoMessages state to trigger re-render when messages change in demo mode
  // eslint-disable-next-line no-unused-vars
  const _demoMessagesTrigger = demoMessages;
  const messages = useDemoMode
    ? (selectedConversationId ? getMessagesWithSession(selectedConversationId).map(msg => transformMessage(msg, session?.user?.id)) : [])
    : (messagesData?.data?.map(msg => transformMessage(msg, session?.user?.id)) || []);

  // Simulated connection for demo mode (always "connected")
  const effectiveIsConnected = useDemoMode ? true : isConnected;

  // Select first conversation on load (desktop only)
  useEffect(() => {
    // Only auto-select on desktop (not mobile)
    const isMobile = window.innerWidth < 768;
    if (!selectedConversationId && !isMobile) {
      if (useDemoMode && demoConversations.length > 0) {
        setSelectedConversationId(demoConversations[0].id);
      } else if (conversationsData?.data?.length) {
        setSelectedConversationId(conversationsData.data[0].id);
      }
    }
  }, [conversationsData, selectedConversationId, useDemoMode]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const message = event.detail;
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      if (message.senderId !== session?.user?.id) {
        playNotificationSound();
      }
    };

    const handleMessageUpdated = (event: CustomEvent) => {
      const message = event.detail;
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
    };

    const handleMessageDeleted = (event: CustomEvent) => {
      if (selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      }
    };

    const handleMessagesRead = (event: CustomEvent) => {
      const { conversationId } = event.detail;
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    };

    const handleConversationUpdated = (event: CustomEvent) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    window.addEventListener('socket:new_message', handleNewMessage as EventListener);
    window.addEventListener('socket:message_updated', handleMessageUpdated as EventListener);
    window.addEventListener('socket:message_deleted', handleMessageDeleted as EventListener);
    window.addEventListener('socket:messages_read', handleMessagesRead as EventListener);
    window.addEventListener('socket:conversation_updated', handleConversationUpdated as EventListener);

    return () => {
      window.removeEventListener('socket:new_message', handleNewMessage as EventListener);
      window.removeEventListener('socket:message_updated', handleMessageUpdated as EventListener);
      window.removeEventListener('socket:message_deleted', handleMessageDeleted as EventListener);
      window.removeEventListener('socket:messages_read', handleMessagesRead as EventListener);
      window.removeEventListener('socket:conversation_updated', handleConversationUpdated as EventListener);
    };
  }, [session?.user?.id, selectedConversationId, queryClient]);

  // Update connection status
  useEffect(() => {
    if (useDemoMode) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    }
  }, [isConnected, useDemoMode]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  // Join conversation room when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      joinConversation(selectedConversationId);
      markAsReadMutation.mutate(selectedConversationId);
    }

    return () => {
      if (selectedConversationId) {
        leaveConversation(selectedConversationId);
      }
    };
  }, [selectedConversationId, joinConversation, leaveConversation]);

  // Handle Escape key to close modal - must be before early returns
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showNewConversationModal) {
        setShowNewConversationModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showNewConversationModal]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Audio not supported
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setMobileShowConversation(true);
  };

  const handleBackToList = () => {
    setMobileShowConversation(false);
  };

  const handleNewConversation = () => {
    setShowNewConversationModal(true);
  };

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversationId || !session?.user) {
      return;
    }

    if (useDemoMode) {
      const sessionUser = session?.user as any;
      addDemoMessage(selectedConversationId, {
        conversationId: selectedConversationId,
        senderId: sessionUser?.id || 'demo-team-user',
        content: newMessage.trim(),
        messageType: 'text',
        attachments: [],
        editedAt: null,
        deletedAt: null,
        sender: {
          id: sessionUser?.id || 'demo-team-user',
          firstName: sessionUser?.name?.split(' ')[0] || 'Demo',
          lastName: sessionUser?.name?.split(' ').slice(1).join(' ') || 'User',
        },
      });

      setDemoMessages(getMessagesWithSession(selectedConversationId));
      setNewMessage('');
      messageInputRef.current?.focus();
      return;
    }

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content: newMessage.trim(),
      messageType: 'text',
    });

    setNewMessage('');
    stopTyping(selectedConversationId);
    setIsTyping(false);
    messageInputRef.current?.focus();
  }, [newMessage, selectedConversationId, session?.user, sendMessageMutation, stopTyping, useDemoMode]);

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);

    if (!selectedConversationId) return;

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping(selectedConversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping(selectedConversationId);
      }
    }, 2000);
  }, [selectedConversationId, isTyping, startTyping, stopTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (conversationsLoading && !useDemoMode) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-surface">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading conversations...</p>
        </div>
      </div>
    );
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum':
        return <ShieldCheckIcon className="h-4 w-4 text-error" />;
      case 'high':
        return <LockClosedIcon className="h-4 w-4 text-gold" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-navy" />;
    }
  };

  const getSecurityBadge = (level: string) => {
    const colors = {
      maximum: 'bg-error-light text-error-dark',
      high: 'bg-gold-100 text-gold-800',
      standard: 'bg-navy-50 text-navy-800',
    };
    return colors[level as keyof typeof colors] || colors.standard;
  };

  const getMessageStatus = (message: ReturnType<typeof transformMessage>) => {
    if (message.status === 'read') return <CheckCircleIconSolid className="h-3 w-3 text-success" />;
    if (message.status === 'delivered') return <CheckCircleIcon className="h-3 w-3 text-text-tertiary" />;
    return <ClockIcon className="h-3 w-3 text-text-tertiary" />;
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <WifiIcon className="h-4 w-4 text-success" />;
      case 'connecting':
        return <SignalIcon className="h-4 w-4 text-gold animate-pulse" />;
      default:
        return <WifiIcon className="h-4 w-4 text-error" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const conversationMessages = messages;

  const currentTypingUsers = selectedConversationId
    ? typingUsers.filter(u =>
        u.conversationId === selectedConversationId &&
        u.userId !== session?.user?.id
      )
    : [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const isUserOnline = (participantUserId: string) => {
    return onlineUsers.some(u => u.userId === participantUserId);
  };

  // New Conversation Modal
  const NewConversationModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          setShowNewConversationModal(false);
        }
      }}
    >
      <div className="bg-bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Start new conversation</h2>
          <button
            onClick={() => setShowNewConversationModal(false)}
            className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {useDemoMode ? (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary mb-2">Demo mode active</p>
              <p className="text-sm text-text-tertiary">
                In demo mode, you can explore existing conversations.
                Creating new conversations requires a live account.
              </p>
              <button
                onClick={() => setShowNewConversationModal(false)}
                className="btn-secondary mt-4 min-h-12 px-6"
              >
                Got it
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-text-secondary">
                Select a team or company to start a conversation with.
              </p>
              <p className="text-sm text-text-tertiary">
                New conversations are created when you express interest in an opportunity
                or when a company reaches out about your team profile.
              </p>
              <button
                onClick={() => setShowNewConversationModal(false)}
                className="btn-primary w-full min-h-12"
              >
                Browse opportunities
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Conversation List Component - Practical UI typography
  const ConversationList = () => (
    <div className="flex flex-col h-full bg-bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary">Messages</h1>
            <div className="flex items-center gap-1">
              {getConnectionStatusIcon()}
              <span className={`text-xs font-normal ${
                connectionStatus === 'connected' ? 'text-success' :
                connectionStatus === 'connecting' ? 'text-gold' : 'text-error'
              }`}>
                {connectionStatus === 'connected' ? (useDemoMode ? 'demo' : 'live') : connectionStatus}
              </span>
            </div>
          </div>
          <button
            onClick={handleNewConversation}
            className="btn-primary min-h-12 px-4 inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 min-h-12"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary mb-2">No conversations yet</p>
            <p className="text-sm text-text-tertiary">
              Start exploring opportunities to connect with teams and companies.
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const unreadCount = session?.user?.id
              ? (conversation.unreadCounts?.[session.user.id] || 0)
              : 0;
            const isSelected = selectedConversationId === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full p-4 border-b border-border text-left transition-colors min-h-[72px] ${
                  isSelected
                    ? 'bg-navy-50 border-l-4 border-l-navy'
                    : 'hover:bg-bg-alt active:bg-bg-alt'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar/Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    conversation.isConfidential ? 'bg-error-light' : 'bg-navy-50'
                  }`}>
                    {conversation.isConfidential ? (
                      <ShieldCheckIcon className="h-5 w-5 text-error" />
                    ) : (
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-navy" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-base truncate ${
                        unreadCount > 0 ? 'font-bold text-text-primary' : 'font-normal text-text-primary'
                      }`}>
                        {conversation.title}
                      </h3>
                      <span className="text-xs font-normal text-text-tertiary flex-shrink-0">
                        {formatTime(conversation.lastActivity)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-text-secondary truncate">
                        {conversation.participants.map(p => p.name).join(', ')}
                      </span>
                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-error rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getSecurityBadge(conversation.securityLevel)}`}>
                        {conversation.securityLevel}
                      </span>
                      {conversation.isConfidential && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-error-light text-error-dark">
                          confidential
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // Message View Component
  const MessageView = () => {
    if (!selectedConversation) {
      return (
        <div className="h-full flex items-center justify-center bg-bg-surface">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">Select a conversation</h2>
            <p className="text-base font-normal text-text-secondary">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-bg-surface">
        {/* Conversation Header */}
        <div className="flex-shrink-0 p-4 border-b border-border bg-bg-alt">
          <div className="flex items-center gap-3">
            {/* Back button - mobile only */}
            <button
              onClick={handleBackToList}
              className="md:hidden min-h-12 min-w-12 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Conversation info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getSecurityIcon(selectedConversation.securityLevel)}
                <h2 className="text-lg font-bold text-text-primary truncate">
                  {selectedConversation.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm font-normal text-text-secondary">
                <span>{selectedConversation.participants.length} participants</span>
                {effectiveIsConnected && (
                  <span className="inline-flex items-center gap-1 text-success">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    {useDemoMode ? 'demo' : 'live'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <button className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-surface rounded-lg transition-colors">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Security badges */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${getSecurityBadge(selectedConversation.securityLevel)}`}>
              {selectedConversation.securityLevel} security
            </span>
            {selectedConversation.encryptionEnabled && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-success-light text-success-dark">
                <LockClosedIcon className="h-3 w-3" />
                encrypted
              </span>
            )}
            {selectedConversation.isConfidential && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-error-light text-error-dark">
                confidential
              </span>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversationMessages.map((message) => {
            const isOwnMessage = message.senderId === session?.user?.id ||
              (useDemoMode && (message.senderId === 'demo-team-user' || message.senderId === session?.user?.id));

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] ${
                  isOwnMessage
                    ? 'bg-navy text-white rounded-2xl rounded-br-md'
                    : 'bg-bg-alt text-text-primary rounded-2xl rounded-bl-md'
                } px-4 py-3`}>
                  {/* Sender name (for received messages) */}
                  {!isOwnMessage && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold">{message.senderName}</span>
                      {isUserOnline(message.senderId) && (
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                      )}
                    </div>
                  )}

                  {/* Message content */}
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {/* Attachments */}
                  {message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 text-xs opacity-80">
                          <PaperClipIcon className="h-3 w-3" />
                          <span className="truncate">{attachment.filename}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp and status */}
                  <div className={`flex items-center gap-2 mt-2 text-xs ${
                    isOwnMessage ? 'text-white/70 justify-end' : 'text-text-tertiary'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwnMessage && getMessageStatus(message)}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {currentTypingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-bg-alt rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {currentTypingUsers.map(u => u.userName).join(', ')} typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-bg-surface">
          <div className="flex items-end gap-2">
            {/* Attachment button */}
            <button
              className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-lg transition-colors disabled:opacity-50"
              disabled={!effectiveIsConnected}
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>

            {/* Text input */}
            <div className="flex-1">
              <textarea
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={effectiveIsConnected ? "Type a message..." : "Connecting..."}
                rows={1}
                disabled={!effectiveIsConnected}
                className="input-field resize-none min-h-12 max-h-32 py-3 disabled:bg-bg-alt disabled:cursor-not-allowed"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !effectiveIsConnected}
              className="btn-primary min-h-12 min-w-12 flex items-center justify-center disabled:bg-bg-alt disabled:text-text-tertiary disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Security footer */}
          <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <LockClosedIcon className="h-3 w-3" />
                End-to-end encrypted
              </span>
            </div>
            {useDemoMode && (
              <span className="text-gold">Demo mode</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex bg-bg-surface">
      {/* New Conversation Modal */}
      {showNewConversationModal && <NewConversationModal />}

      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:flex w-full">
        {/* Conversation list - fixed width */}
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-border">
          <ConversationList />
        </div>
        {/* Message view - flex grow */}
        <div className="flex-1 min-w-0">
          <MessageView />
        </div>
      </div>

      {/* Mobile: Stack layout with slide transition */}
      <div className="md:hidden w-full h-full">
        {mobileShowConversation && selectedConversationId ? (
          <MessageView />
        ) : (
          <ConversationList />
        )}
      </div>
    </div>
  );
}
