import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '@liftout/database';
import { logger } from '../utils/logger';
import { AuthenticatedSocket } from './middleware';

// Track online users
const onlineUsers = new Map<string, Set<string>>(); // userId -> Set of socket ids

/**
 * Register socket event handlers
 */
export const registerSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;

    if (!user) {
      logger.warn(`Unauthenticated socket connected: ${socket.id}`);
      socket.disconnect();
      return;
    }

    logger.info(`Socket connected: ${socket.id} (user: ${user.email})`);

    // Track user as online
    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, new Set());
    }
    onlineUsers.get(user.id)!.add(socket.id);

    // Join user's personal room for direct notifications
    socket.join(`user:${user.id}`);

    // Broadcast user came online (to relevant users)
    socket.broadcast.emit('user_online', {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // ==========================================
    // Conversation Events
    // ==========================================

    /**
     * Join a conversation room
     */
    socket.on('join_conversation', async (data: { conversationId: string }) => {
      const { conversationId } = data;

      try {
        // Verify user has access to this conversation
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId: user.id,
            },
          },
        });

        if (!participant || participant.leftAt) {
          socket.emit('error', {
            event: 'join_conversation',
            message: 'You do not have access to this conversation',
          });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        logger.info(`Socket ${socket.id} joined conversation ${conversationId}`);

        // Acknowledge the join
        socket.emit('joined_conversation', { conversationId });
      } catch (error) {
        logger.error('Error joining conversation:', error);
        socket.emit('error', {
          event: 'join_conversation',
          message: 'Failed to join conversation',
        });
      }
    });

    /**
     * Leave a conversation room
     */
    socket.on('leave_conversation', (data: { conversationId: string }) => {
      const { conversationId } = data;
      socket.leave(`conversation:${conversationId}`);
      logger.info(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // ==========================================
    // Typing Indicator Events
    // ==========================================

    /**
     * User started typing
     */
    socket.on('start_typing', async (data: { conversationId: string }) => {
      const { conversationId } = data;

      // Verify access
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: user.id,
          },
        },
      });

      if (!participant || participant.leftAt) {
        return;
      }

      // Broadcast to others in the conversation
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
      });
    });

    /**
     * User stopped typing
     */
    socket.on('stop_typing', (data: { conversationId: string }) => {
      const { conversationId } = data;

      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId: user.id,
      });
    });

    // ==========================================
    // Read Receipt Events
    // ==========================================

    /**
     * Mark messages as read (via socket for real-time update)
     */
    socket.on('mark_read', async (data: { conversationId: string }) => {
      const { conversationId } = data;

      try {
        // Verify access
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId: user.id,
            },
          },
        });

        if (!participant || participant.leftAt) {
          return;
        }

        // Update last read time
        await prisma.conversationParticipant.update({
          where: {
            conversationId_userId: {
              conversationId,
              userId: user.id,
            },
          },
          data: {
            lastReadAt: new Date(),
          },
        });

        // Reset unread count
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (conversation) {
          const unreadCounts = (conversation.unreadCounts as Record<string, number>) || {};
          unreadCounts[user.id] = 0;

          await prisma.conversation.update({
            where: { id: conversationId },
            data: { unreadCounts },
          });
        }

        // Broadcast read receipt
        socket.to(`conversation:${conversationId}`).emit('messages_read', {
          conversationId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          readAt: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error marking messages as read:', error);
      }
    });

    // ==========================================
    // Presence Events
    // ==========================================

    /**
     * Get online status of users
     */
    socket.on('get_online_users', (data: { userIds: string[] }) => {
      const { userIds } = data;
      const onlineStatuses: Record<string, boolean> = {};

      for (const userId of userIds) {
        onlineStatuses[userId] = onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
      }

      socket.emit('online_users', onlineStatuses);
    });

    // ==========================================
    // Disconnect Event
    // ==========================================

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (user: ${user.email}), reason: ${reason}`);

      // Remove from online users
      if (onlineUsers.has(user.id)) {
        onlineUsers.get(user.id)!.delete(socket.id);

        // If no more sockets, user is offline
        if (onlineUsers.get(user.id)!.size === 0) {
          onlineUsers.delete(user.id);

          // Broadcast user went offline
          socket.broadcast.emit('user_offline', {
            userId: user.id,
          });
        }
      }
    });

    // ==========================================
    // Error Handling
    // ==========================================

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });
};

/**
 * Get online user IDs
 */
export const getOnlineUserIds = (): string[] => {
  return Array.from(onlineUsers.keys());
};

/**
 * Check if a user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
};
