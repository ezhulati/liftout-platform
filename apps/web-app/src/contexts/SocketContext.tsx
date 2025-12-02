'use client';

import React, { createContext, useContext } from 'react';

/**
 * Stub Socket Context - Real-time functionality removed
 *
 * The messaging system now uses REST API with polling instead of WebSockets.
 * This stub maintains API compatibility with existing components.
 */

interface SocketContextType {
  socket: null;
  isConnected: boolean;
  onlineUsers: never[];
  sendMessage: (message: unknown) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  typingUsers: never[];
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * SocketProvider stub - provides no-op functions
 * Real-time messaging has been replaced with REST API polling
 */
export function SocketProvider({ children }: SocketProviderProps) {
  // Stub implementation - all functions are no-ops
  const value: SocketContextType = {
    socket: null,
    isConnected: false, // Always disconnected since we removed WebSockets
    onlineUsers: [],
    sendMessage: () => {}, // No-op
    joinConversation: () => {}, // No-op
    leaveConversation: () => {}, // No-op
    typingUsers: [],
    startTyping: () => {}, // No-op
    stopTyping: () => {}, // No-op
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
