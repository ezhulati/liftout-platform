import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { SecureMessage, Conversation, validateMessageSecurity } from '@/lib/messaging';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface NextApiResponseServerIO extends NextApiResponse {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
}

interface ConnectedUser {
  userId: string;
  userName: string;
  socketId: string;
  userType: 'individual' | 'company';
  joinedAt: number;
  lastActivity: number;
  status: 'online' | 'away' | 'busy';
  conversationIds: Set<string>;
}

// In-memory storage for connected users (in production, use Redis)
const connectedUsers = new Map<string, ConnectedUser>();
const userSockets = new Map<string, string>(); // userId -> socketId
const socketUsers = new Map<string, string>(); // socketId -> userId

function isUserAuthorizedForConversation(userId: string, conversationId: string): boolean {
  // In production, this would check against the database
  // For now, return true for demo purposes
  return true;
}

function encryptMessage(message: SecureMessage): SecureMessage {
  // In production, implement proper encryption based on the security level
  // For demo, return the message as-is
  return message;
}

function auditLogAction(action: string, userId: string, data: any) {
  // In production, log to audit trail
  console.log(`[AUDIT] ${action} by ${userId}:`, data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('🚀 Initializing Socket.IO server...');
    
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        const { userId, userName, userType } = socket.handshake.auth;
        
        if (!userId || !userName) {
          console.log('⚠️ Socket authentication failed: Missing credentials');
          return next(new Error('Authentication failed'));
        }

        // In production, validate the session/token here
        socket.data.userId = userId;
        socket.data.userName = userName;
        socket.data.userType = userType;
        
        console.log(`✅ Socket authenticated: ${userName} (${userId})`);
        next();
      } catch (error) {
        console.error('🚨 Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket) => {
      const { userId, userName, userType } = socket.data;
      
      console.log(`🔗 User connected: ${userName} (${socket.id})`);

      // Register user as online
      const user: ConnectedUser = {
        userId,
        userName,
        socketId: socket.id,
        userType,
        joinedAt: Date.now(),
        lastActivity: Date.now(),
        status: 'online',
        conversationIds: new Set(),
      };
      
      connectedUsers.set(userId, user);
      userSockets.set(userId, socket.id);
      socketUsers.set(socket.id, userId);

      // Broadcast user online status
      socket.broadcast.emit('user_online', {
        userId,
        userName,
        status: 'online',
        lastSeen: new Date().toISOString(),
      });

      // Send current online users to the new user
      const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
        userId: u.userId,
        userName: u.userName,
        status: u.status,
        lastSeen: new Date(u.lastActivity).toISOString(),
      }));
      socket.emit('users_online', onlineUsers);

      auditLogAction('user_connected', userId, { userName, socketId: socket.id });

      // Join conversation room
      socket.on('join_conversation', ({ conversationId }) => {
        if (!isUserAuthorizedForConversation(userId, conversationId)) {
          socket.emit('error', { message: 'Unauthorized to join conversation' });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        user.conversationIds.add(conversationId);
        
        console.log(`🏠 ${userName} joined conversation: ${conversationId}`);
        auditLogAction('conversation_joined', userId, { conversationId });

        // Notify other participants
        socket.to(`conversation:${conversationId}`).emit('participant_joined', {
          conversationId,
          participant: { userId, userName, userType },
        });
      });

      // Leave conversation room
      socket.on('leave_conversation', ({ conversationId }) => {
        socket.leave(`conversation:${conversationId}`);
        user.conversationIds.delete(conversationId);
        
        console.log(`🚪 ${userName} left conversation: ${conversationId}`);
        auditLogAction('conversation_left', userId, { conversationId });

        // Notify other participants
        socket.to(`conversation:${conversationId}`).emit('participant_left', {
          conversationId,
          userId,
        });
      });

      // Send message
      socket.on('send_message', async (message: SecureMessage) => {
        try {
          // Validate user authorization
          if (!isUserAuthorizedForConversation(userId, message.conversationId)) {
            socket.emit('error', { message: 'Unauthorized to send message to this conversation' });
            return;
          }

          // Validate message security (in production, fetch conversation from DB)
          const mockConversation = {
            id: message.conversationId,
            securityLevel: 'high' as const,
            encryptionEnabled: true,
            legalReviewRequired: false,
          };

          const validation = validateMessageSecurity(message, mockConversation as any);
          if (!validation.isValid) {
            socket.emit('error', { 
              message: 'Message validation failed', 
              errors: validation.errors 
            });
            return;
          }

          // Encrypt message based on security level
          const encryptedMessage = encryptMessage(message);
          
          // Update message status
          encryptedMessage.status = 'delivered';
          
          // In production, save to database here
          console.log(`📨 Message sent by ${userName} to conversation ${message.conversationId}`);
          auditLogAction('message_sent', userId, { 
            messageId: message.id,
            conversationId: message.conversationId,
            contentLength: message.content.length 
          });

          // Broadcast to conversation participants
          io.to(`conversation:${message.conversationId}`).emit('new_message', encryptedMessage);
          
          // Send confirmation to sender
          socket.emit('message_confirmed', { 
            messageId: message.id, 
            status: 'delivered',
            timestamp: new Date().toISOString() 
          });

          if (validation.warnings.length > 0) {
            socket.emit('message_warnings', {
              messageId: message.id,
              warnings: validation.warnings,
            });
          }
        } catch (error) {
          console.error('🚨 Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Mark message as read
      socket.on('mark_message_read', ({ messageId, conversationId }) => {
        const readData = {
          messageId,
          userId,
          readAt: new Date().toISOString(),
        };

        // In production, update database here
        auditLogAction('message_read', userId, readData);

        // Notify conversation participants
        socket.to(`conversation:${conversationId}`).emit('message_read', readData);
        
        console.log(`👁️ ${userName} read message ${messageId}`);
      });

      // Typing indicators
      socket.on('start_typing', ({ conversationId }) => {
        if (!user.conversationIds.has(conversationId)) {
          return; // User not in conversation
        }

        socket.to(`conversation:${conversationId}`).emit('user_typing', {
          userId,
          userName,
          conversationId,
        });
      });

      socket.on('stop_typing', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
          userId,
          conversationId,
        });
      });

      // Update user status
      socket.on('update_status', ({ status }) => {
        if (['online', 'away', 'busy'].includes(status)) {
          user.status = status;
          user.lastActivity = Date.now();
          
          // Broadcast status update
          socket.broadcast.emit('user_status_changed', {
            userId,
            status,
            lastSeen: new Date().toISOString(),
          });
        }
      });

      // Handle activity tracking
      socket.on('activity', () => {
        user.lastActivity = Date.now();
        if (user.status === 'away') {
          user.status = 'online';
          socket.broadcast.emit('user_status_changed', {
            userId,
            status: 'online',
            lastSeen: new Date().toISOString(),
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${userName} (${reason})`);
        
        // Clean up user data
        connectedUsers.delete(userId);
        userSockets.delete(userId);
        socketUsers.delete(socket.id);

        // Notify others that user is offline
        socket.broadcast.emit('user_offline', userId);
        
        // Leave all conversation rooms
        user.conversationIds.forEach(conversationId => {
          socket.to(`conversation:${conversationId}`).emit('participant_left', {
            conversationId,
            userId,
          });
        });

        auditLogAction('user_disconnected', userId, { reason, socketId: socket.id });
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`🚨 Socket error for ${userName}:`, error);
      });
    });

    // Set up periodic cleanup for inactive users
    setInterval(() => {
      const now = Date.now();
      const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
      
      connectedUsers.forEach((user, userId) => {
        if (now - user.lastActivity > inactiveThreshold && user.status !== 'away') {
          user.status = 'away';
          io.emit('user_status_changed', {
            userId,
            status: 'away',
            lastSeen: new Date(user.lastActivity).toISOString(),
          });
        }
      });
    }, 60 * 1000); // Check every minute

    res.socket.server.io = io;
    console.log('✅ Socket.IO server initialized successfully');
  } else {
    console.log('🔄 Socket.IO server already running');
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};