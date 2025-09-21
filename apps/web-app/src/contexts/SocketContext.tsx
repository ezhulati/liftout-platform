'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { SecureMessage, Conversation } from '@/lib/messaging';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  sendMessage: (message: Omit<SecureMessage, 'id' | 'timestamp' | 'status'>) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  typingUsers: TypingUser[];
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

interface OnlineUser {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: string;
}

interface TypingUser {
  userId: string;
  userName: string;
  conversationId: string;
  timestamp: number;
}

interface SocketMessage {
  type: 'message' | 'typing' | 'stop_typing' | 'user_online' | 'user_offline' | 'message_read' | 'conversation_update';
  data: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (session?.user) {
      // Initialize Socket.io connection
      const newSocket = io('/api/socket', {
        auth: {
          userId: session.user.id,
          userName: session.user.name,
          userType: session.user.userType,
        },
        transports: ['websocket', 'polling'],
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('🔗 Socket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
        setOnlineUsers([]);
        setTypingUsers([]);
      });

      // Real-time message events
      newSocket.on('new_message', (message: SecureMessage) => {
        console.log('📨 New message received:', message);
        // Emit custom event that components can listen to
        window.dispatchEvent(new CustomEvent('socket:new_message', { detail: message }));
      });

      newSocket.on('message_updated', (message: SecureMessage) => {
        console.log('📝 Message updated:', message);
        window.dispatchEvent(new CustomEvent('socket:message_updated', { detail: message }));
      });

      newSocket.on('message_deleted', (messageId: string) => {
        console.log('🗑️ Message deleted:', messageId);
        window.dispatchEvent(new CustomEvent('socket:message_deleted', { detail: { messageId } }));
      });

      // Typing indicators
      newSocket.on('user_typing', (data: { userId: string; userName: string; conversationId: string }) => {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId || u.conversationId !== data.conversationId);
          return [...filtered, { ...data, timestamp: Date.now() }];
        });
      });

      newSocket.on('user_stop_typing', (data: { userId: string; conversationId: string }) => {
        setTypingUsers(prev => 
          prev.filter(u => !(u.userId === data.userId && u.conversationId === data.conversationId))
        );
      });

      // Online presence
      newSocket.on('users_online', (users: OnlineUser[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_online', (user: OnlineUser) => {
        setOnlineUsers(prev => {
          const filtered = prev.filter(u => u.userId !== user.userId);
          return [...filtered, user];
        });
      });

      newSocket.on('user_offline', (userId: string) => {
        setOnlineUsers(prev => prev.filter(u => u.userId !== userId));
      });

      // Conversation events
      newSocket.on('conversation_updated', (conversation: Conversation) => {
        console.log('💬 Conversation updated:', conversation);
        window.dispatchEvent(new CustomEvent('socket:conversation_updated', { detail: conversation }));
      });

      newSocket.on('participant_joined', (data: { conversationId: string; participant: any }) => {
        console.log('👋 Participant joined:', data);
        window.dispatchEvent(new CustomEvent('socket:participant_joined', { detail: data }));
      });

      newSocket.on('participant_left', (data: { conversationId: string; userId: string }) => {
        console.log('👋 Participant left:', data);
        window.dispatchEvent(new CustomEvent('socket:participant_left', { detail: data }));
      });

      // Read receipts
      newSocket.on('message_read', (data: { messageId: string; userId: string; readAt: string }) => {
        console.log('👁️ Message read:', data);
        window.dispatchEvent(new CustomEvent('socket:message_read', { detail: data }));
      });

      // Error handling
      newSocket.on('error', (error: any) => {
        console.error('🚨 Socket error:', error);
      });

      newSocket.on('connect_error', (error: any) => {
        console.error('🚨 Socket connection error:', error);
      });

      setSocket(newSocket);

      // Cleanup on unmount or session change
      return () => {
        console.log('🧹 Cleaning up socket connection');
        newSocket.disconnect();
      };
    }
  }, [session?.user]);

  // Clean up typing indicators that are older than 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(user => Date.now() - user.timestamp < 5000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (message: Omit<SecureMessage, 'id' | 'timestamp' | 'status'>) => {
    if (socket && isConnected) {
      const fullMessage: SecureMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'sent',
        readBy: [],
        reactions: [],
        acknowledgedBy: [],
        tags: message.tags || [],
        attachments: message.attachments || [],
        moderationFlags: [],
      };

      socket.emit('send_message', fullMessage);
      console.log('📤 Sending message:', fullMessage);
    } else {
      console.warn('⚠️ Cannot send message: Socket not connected');
    }
  };

  const joinConversation = (conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', { conversationId });
      console.log('🏠 Joining conversation:', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', { conversationId });
      console.log('🚪 Leaving conversation:', conversationId);
    }
  };

  const startTyping = (conversationId: string) => {
    if (socket && isConnected && session?.user) {
      socket.emit('start_typing', { 
        conversationId,
        userId: session.user.id,
        userName: session.user.name 
      });
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socket && isConnected && session?.user) {
      socket.emit('stop_typing', { 
        conversationId,
        userId: session.user.id 
      });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    typingUsers,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}