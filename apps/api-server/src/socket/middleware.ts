import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { prisma } from '@liftout/database';
import { logger } from '../utils/logger';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: string;
    };
  };
}

/**
 * Socket.IO authentication middleware
 * Validates JWT token and attaches user data to socket
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    // Get token from handshake auth
    const token = socket.handshake.auth.token;

    if (!token) {
      logger.warn(`Socket connection rejected: No token provided (socket: ${socket.id})`);
      return next(new Error('Authentication required'));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
      },
    });

    if (!user) {
      logger.warn(`Socket connection rejected: User not found (socket: ${socket.id})`);
      return next(new Error('User not found'));
    }

    // Attach user to socket data
    socket.data.user = user;

    logger.info(`Socket authenticated: ${socket.id} (user: ${user.email})`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Socket connection rejected: Token expired (socket: ${socket.id})`);
      return next(new Error('Token expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Socket connection rejected: Invalid token (socket: ${socket.id})`);
      return next(new Error('Invalid token'));
    }

    logger.error('Socket authentication error:', error);
    return next(new Error('Authentication failed'));
  }
};
