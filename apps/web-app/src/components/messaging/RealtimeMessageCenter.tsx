'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
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

  // API hooks
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { data: selectedConversationData } = useConversation(selectedConversationId);
  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedConversationId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Transform API data
  const conversations = conversationsData?.data?.map(transformConversation) || [];
  const selectedConversation = selectedConversationData ? transformConversation(selectedConversationData) : null;
  const messages = messagesData?.data?.map(msg => transformMessage(msg, session?.user?.id)) || [];

  // Select first conversation on load
  useEffect(() => {
    if (conversationsData?.data?.length && !selectedConversationId) {
      setSelectedConversationId(conversationsData.data[0].id);
    }
  }, [conversationsData, selectedConversationId]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    // Socket event listeners - invalidate queries on real-time updates
    const handleNewMessage = (event: CustomEvent) => {
      const message = event.detail;
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // Play notification sound for messages not from current user
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

    // Add event listeners
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
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length]);

  // Join conversation room when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      joinConversation(selectedConversationId);

      // Mark messages as read via API
      markAsReadMutation.mutate(selectedConversationId);
    }

    return () => {
      if (selectedConversationId) {
        leaveConversation(selectedConversationId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, joinConversation, leaveConversation]);

  const playNotificationSound = () => {
    // Create a subtle notification sound
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
  };

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversationId || !session?.user) {
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

    // Focus back on input
    messageInputRef.current?.focus();
  }, [newMessage, selectedConversationId, session?.user, sendMessageMutation, stopTyping]);

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);

    if (!selectedConversationId) return;

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping(selectedConversationId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
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

  if (conversationsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse h-96 bg-bg-alt rounded-lg w-full max-w-4xl"></div>
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
    if (message.status === 'read') return <CheckCircleIconSolid className="h-4 w-4 text-success" />;
    if (message.status === 'delivered') return <CheckCircleIcon className="h-4 w-4 text-text-tertiary" />;
    if (message.requiresAcknowledgment && !message.acknowledgedBy.length) {
      return <ExclamationTriangleIconSolid className="h-4 w-4 text-gold" />;
    }
    return <ClockIcon className="h-4 w-4 text-text-tertiary" />;
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

  // Messages are already filtered by conversation via API
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

  const isUserOnline = (userId: string) => {
    return onlineUsers.some(u => u.userId === userId);
  };

  return (
    <div className="h-screen flex bg-bg-surface">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-border flex flex-col">
        {/* Header with connection status */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-text-primary">Secure messages</h2>
              <div className="flex items-center space-x-1">
                {getConnectionStatusIcon()}
                <span className={`text-xs ${
                  connectionStatus === 'connected' ? 'text-success' :
                  connectionStatus === 'connecting' ? 'text-gold' :
                  'text-error'
                }`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
            <button className="btn-primary inline-flex items-center px-4 py-3 min-h-12">
              <PlusIcon className="h-5 w-5 mr-2" />
              New
            </button>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              Online ({onlineUsers.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.slice(0, 6).map((user) => (
                <div key={user.userId} className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-secondary truncate">{user.userName}</span>
                </div>
              ))}
              {onlineUsers.length > 6 && (
                <span className="text-xs text-text-tertiary">+{onlineUsers.length - 6} more</span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const unreadCount = session?.user?.id
              ? (conversation.unreadCounts?.[session.user.id] || 0)
              : 0;

            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-bg-alt relative transition-colors duration-fast ${
                  selectedConversationId === conversation.id ? 'bg-navy-50 border-l-4 border-l-navy' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getSecurityIcon(conversation.securityLevel)}
                      <h3 className="text-base font-medium text-text-primary truncate">
                        {conversation.title}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-error rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      {conversation.participants.map(p => (
                        <div key={p.userId} className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isUserOnline(p.userId) ? 'bg-success' : 'bg-bg-alt'
                          }`}></div>
                          <span className="text-xs text-text-tertiary">{p.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSecurityBadge(conversation.securityLevel)}`}>
                        {conversation.securityLevel.toUpperCase()}
                      </span>

                      {conversation.isConfidential && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-light text-error-dark">
                          CONFIDENTIAL
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-text-tertiary">
                    {formatTime(conversation.lastActivity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-border bg-bg-alt">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {getSecurityIcon(selectedConversation.securityLevel)}
                    <h3 className="text-lg font-semibold text-text-primary">
                      {selectedConversation.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityBadge(selectedConversation.securityLevel)}`}>
                      {selectedConversation.securityLevel.toUpperCase()} SECURITY
                    </span>

                    {selectedConversation.encryptionEnabled && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                        <LockClosedIcon className="h-3 w-3 mr-1" />
                        ENCRYPTED
                      </span>
                    )}

                    <span className="text-xs text-text-tertiary">
                      {selectedConversation.participants.length} participants
                    </span>

                    {isConnected && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                        <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse"></div>
                        REAL-TIME
                      </span>
                    )}
                  </div>
                </div>

                <button className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-lg transition-colors duration-fast">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>

              {selectedConversation.legalReviewRequired && (
                <div className="mt-3 p-3 bg-gold-50 border border-gold-200 rounded-lg">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-gold" />
                    <div className="ml-3">
                      <p className="text-sm text-gold-800">
                        <strong>Legal review required:</strong> All messages in this conversation are subject to legal review and compliance monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === session?.user?.id
                      ? 'bg-navy text-white'
                      : 'bg-bg-alt text-text-primary'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium flex items-center space-x-1">
                        <span>{message.senderName}</span>
                        {isUserOnline(message.senderId) && (
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                        )}
                      </span>
                      <div className="flex items-center space-x-1">
                        {message.encryptionLevel === 'legal' && (
                          <LockClosedIcon className="h-3 w-3 text-error" />
                        )}
                        {getMessageStatus(message)}
                      </div>
                    </div>

                    {message.subject && (
                      <div className="text-xs font-semibold mb-2 opacity-75">
                        {message.subject}
                      </div>
                    )}

                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                            <PaperClipIcon className="h-3 w-3" />
                            <span className="truncate">{attachment.filename}</span>
                            {attachment.documentType === 'nda' && (
                              <span className="px-1 py-0.5 bg-error-light text-error-dark rounded text-xs">
                                NDA
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>

                      {message.priority === 'urgent' && (
                        <span className="text-xs px-1 py-0.5 bg-error-light text-error-dark rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicators */}
              {currentTypingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-2 bg-bg-alt rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {currentTypingUsers.map(u => u.userName).join(', ')}
                        {currentTypingUsers.length === 1 ? ' is' : ' are'} typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isConnected ? "Type your secure message..." : "Connecting..."}
                    rows={3}
                    disabled={!isConnected}
                    className="input-field resize-none disabled:bg-bg-alt disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-lg transition-colors duration-fast disabled:cursor-not-allowed" disabled={!isConnected}>
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="btn-primary px-4 py-3 min-h-12 disabled:bg-bg-alt disabled:text-text-tertiary disabled:cursor-not-allowed"
                    disabled={!newMessage.trim() || !isConnected}
                  >
                    Send
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <LockClosedIcon className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </span>
                  {selectedConversation.auditTrailEnabled && (
                    <span>Audit trail enabled</span>
                  )}
                  {isConnected && (
                    <span className="text-success flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span>Real-time messaging active</span>
                    </span>
                  )}
                </div>
                <span>
                  {selectedConversation.retentionPolicy === 'legal_hold' ? 'Legal hold' : 'Auto-delete'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-text-tertiary" />
              <h3 className="mt-2 text-base font-medium text-text-primary">No conversation selected</h3>
              <p className="mt-1 text-base text-text-secondary">Choose a conversation to start real-time messaging</p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-text-tertiary">
                {getConnectionStatusIcon()}
                <span>Socket.io {connectionStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}