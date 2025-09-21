'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/contexts/SocketContext';
import {
  Conversation,
  SecureMessage,
  mockConversations,
  mockMessages
} from '@/lib/messaging';
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
  UserIcon,
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

export function RealtimeMessageCenter({ userId }: RealtimeMessageCenterProps) {
  const { data: session } = useSession();
  const {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    typingUsers,
    startTyping,
    stopTyping,
  } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize data and socket listeners
  useEffect(() => {
    // Load initial data
    setTimeout(() => {
      setConversations(mockConversations);
      setMessages(mockMessages);
      setSelectedConversation(mockConversations[0]);
      setIsLoading(false);
    }, 500);

    // Socket event listeners
    const handleNewMessage = (event: CustomEvent) => {
      const message: SecureMessage = event.detail;
      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
      
      // Update conversation last activity
      setConversations(prev => 
        prev.map(conv => 
          conv.id === message.conversationId
            ? { ...conv, lastActivity: message.timestamp, messageCount: conv.messageCount + 1 }
            : conv
        )
      );

      // Play notification sound for messages not from current user
      if (message.senderId !== session?.user?.id) {
        playNotificationSound();
      }
    };

    const handleMessageUpdated = (event: CustomEvent) => {
      const message: SecureMessage = event.detail;
      setMessages(prev => 
        prev.map(m => m.id === message.id ? message : m)
      );
    };

    const handleMessageDeleted = (event: CustomEvent) => {
      const { messageId } = event.detail;
      setMessages(prev => prev.filter(m => m.id !== messageId));
    };

    const handleMessageRead = (event: CustomEvent) => {
      const { messageId, userId: readByUserId, readAt } = event.detail;
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId
            ? {
                ...m,
                readBy: [...m.readBy.filter(r => r.userId !== readByUserId), {
                  userId: readByUserId,
                  readAt,
                }],
                status: 'read'
              }
            : m
        )
      );
    };

    // Add event listeners
    window.addEventListener('socket:new_message', handleNewMessage as EventListener);
    window.addEventListener('socket:message_updated', handleMessageUpdated as EventListener);
    window.addEventListener('socket:message_deleted', handleMessageDeleted as EventListener);
    window.addEventListener('socket:message_read', handleMessageRead as EventListener);

    return () => {
      window.removeEventListener('socket:new_message', handleNewMessage as EventListener);
      window.removeEventListener('socket:message_updated', handleMessageUpdated as EventListener);
      window.removeEventListener('socket:message_deleted', handleMessageDeleted as EventListener);
      window.removeEventListener('socket:message_read', handleMessageRead as EventListener);
    };
  }, [session?.user?.id]);

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join conversation room when selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      joinConversation(selectedConversation.id);
      
      // Mark messages as read
      const unreadMessages = conversationMessages.filter(msg => 
        msg.senderId !== session?.user?.id && 
        !msg.readBy.some(r => r.userId === session?.user?.id)
      );
      
      unreadMessages.forEach(msg => {
        if (socket) {
          socket.emit('mark_message_read', {
            messageId: msg.id,
            conversationId: selectedConversation.id,
          });
        }
      });
    }

    return () => {
      if (selectedConversation) {
        leaveConversation(selectedConversation.id);
      }
    };
  }, [selectedConversation, joinConversation, leaveConversation, socket, session?.user?.id]);

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
    if (!newMessage.trim() || !selectedConversation || !session?.user) {
      return;
    }

    const message: Omit<SecureMessage, 'id' | 'timestamp' | 'status'> = {
      conversationId: selectedConversation.id,
      senderId: session.user.id,
      senderName: session.user.name || 'Unknown User',
      senderRole: session.user.userType === 'company' ? 'company_rep' : 'team_lead',
      recipientIds: selectedConversation.participants
        .filter(p => p.userId !== session.user.id)
        .map(p => p.userId),
      content: newMessage.trim(),
      messageType: 'text',
      encryptionLevel: selectedConversation.securityLevel === 'maximum' ? 'legal' : 'high',
      accessLevel: 'parties_only',
      isAnonymous: false,
      readBy: [],
      reactions: [],
      requiresAcknowledgment: selectedConversation.securityLevel === 'maximum',
      acknowledgedBy: [],
      tags: [],
      priority: 'medium',
      attachments: [],
      moderationFlags: [],
    };

    sendMessage(message);
    setNewMessage('');
    stopTyping(selectedConversation.id);
    setIsTyping(false);
    
    // Focus back on input
    messageInputRef.current?.focus();
  }, [newMessage, selectedConversation, session?.user, sendMessage, stopTyping]);

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);
    
    if (!selectedConversation) return;

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping(selectedConversation.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping(selectedConversation.id);
      }
    }, 2000);
  }, [selectedConversation, isTyping, startTyping, stopTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse h-96 bg-gray-200 rounded-lg w-full max-w-4xl"></div>
      </div>
    );
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum':
        return <ShieldCheckIcon className="h-4 w-4 text-red-500" />;
      case 'high':
        return <LockClosedIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSecurityBadge = (level: string) => {
    const colors = {
      maximum: 'bg-red-100 text-red-800',
      high: 'bg-yellow-100 text-yellow-800',
      standard: 'bg-blue-100 text-blue-800',
    };
    return colors[level as keyof typeof colors] || colors.standard;
  };

  const getMessageStatus = (message: SecureMessage) => {
    if (message.status === 'read') return <CheckCircleIconSolid className="h-4 w-4 text-green-500" />;
    if (message.status === 'delivered') return <CheckCircleIcon className="h-4 w-4 text-gray-400" />;
    if (message.requiresAcknowledgment && !message.acknowledgedBy.length) {
      return <ExclamationTriangleIconSolid className="h-4 w-4 text-yellow-500" />;
    }
    return <ClockIcon className="h-4 w-4 text-gray-400" />;
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <WifiIcon className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <SignalIcon className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <WifiIcon className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const conversationMessages = selectedConversation
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  const currentTypingUsers = selectedConversation
    ? typingUsers.filter(u => 
        u.conversationId === selectedConversation.id && 
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
    <div className="h-screen flex bg-white">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header with connection status */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">Secure Messages</h2>
              <div className="flex items-center space-x-1">
                {getConnectionStatusIcon()}
                <span className={`text-xs ${
                  connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'connecting' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
            <button className="btn-sm bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Online ({onlineUsers.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.slice(0, 6).map((user) => (
                <div key={user.userId} className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 truncate">{user.userName}</span>
                </div>
              ))}
              {onlineUsers.length > 6 && (
                <span className="text-xs text-gray-500">+{onlineUsers.length - 6} more</span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const unreadCount = messages.filter(msg => 
              msg.conversationId === conversation.id &&
              msg.senderId !== session?.user?.id &&
              !msg.readBy.some(r => r.userId === session?.user?.id)
            ).length;

            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 relative ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getSecurityIcon(conversation.securityLevel)}
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.title}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {conversation.participants.map(p => (
                        <div key={p.userId} className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isUserOnline(p.userId) ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs text-gray-500">{p.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSecurityBadge(conversation.securityLevel)}`}>
                        {conversation.securityLevel.toUpperCase()}
                      </span>
                      
                      {conversation.isConfidential && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          CONFIDENTIAL
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
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
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {getSecurityIcon(selectedConversation.securityLevel)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityBadge(selectedConversation.securityLevel)}`}>
                      {selectedConversation.securityLevel.toUpperCase()} SECURITY
                    </span>
                    
                    {selectedConversation.encryptionEnabled && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <LockClosedIcon className="h-3 w-3 mr-1" />
                        ENCRYPTED
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500">
                      {selectedConversation.participants.length} participants
                    </span>
                    
                    {isConnected && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        REAL-TIME
                      </span>
                    )}
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>

              {selectedConversation.legalReviewRequired && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Legal Review Required:</strong> All messages in this conversation are subject to legal review and compliance monitoring.
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
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium flex items-center space-x-1">
                        <span>{message.senderName}</span>
                        {isUserOnline(message.senderId) && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </span>
                      <div className="flex items-center space-x-1">
                        {message.encryptionLevel === 'legal' && (
                          <LockClosedIcon className="h-3 w-3 text-red-400" />
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
                              <span className="px-1 py-0.5 bg-red-200 text-red-800 rounded text-xs">
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
                        <span className="text-xs px-1 py-0.5 bg-red-200 text-red-800 rounded">
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
                  <div className="max-w-xs lg:max-w-md px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {currentTypingUsers.map(u => u.userName).join(', ')} 
                        {currentTypingUsers.length === 1 ? 'is' : 'are'} typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed" disabled={!isConnected}>
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="btn-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim() || !isConnected}
                  >
                    Send
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <LockClosedIcon className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </span>
                  {selectedConversation.auditTrailEnabled && (
                    <span>Audit trail enabled</span>
                  )}
                  {isConnected && (
                    <span className="text-green-600 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a conversation to start real-time messaging</p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
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