import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/auth';
import { socketAuthMiddleware } from './socket/middleware';
import { registerSocketHandlers } from './socket/handlers';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import teamRoutes from './routes/teams';
import companyRoutes from './routes/companies';
import opportunityRoutes from './routes/opportunities';
import applicationRoutes from './routes/applications';
import conversationRoutes from './routes/conversations';
import searchRoutes from './routes/search';
import analyticsRoutes from './routes/analytics';
import subscriptionRoutes from './routes/subscriptions';
import notificationRoutes from './routes/notifications';

const app = express();
const server = createServer(app);

// Production-ready allowed origins
const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean);
  if (envOrigins && envOrigins.length > 0) {
    return envOrigins;
  }
  // Default origins for development and production
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://liftout.com',
    'https://www.liftout.com',
  ];
};

// Socket.IO setup with Redis adapter for horizontal scaling
const io = new SocketIOServer(server, {
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
  // Connection state recovery for better reliability
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

// Setup Redis adapter if REDIS_URL is provided (for horizontal scaling in production)
const setupRedisAdapter = async () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    logger.info('No REDIS_URL provided, using in-memory adapter (single instance mode)');
    return;
  }

  try {
    const pubClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => logger.error('Redis Pub Client Error:', err));
    subClient.on('error', (err) => logger.error('Redis Sub Client Error:', err));

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        pubClient.once('ready', () => resolve());
        pubClient.once('error', reject);
      }),
      new Promise<void>((resolve, reject) => {
        subClient.once('ready', () => resolve());
        subClient.once('error', reject);
      }),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.IO Redis adapter connected - horizontal scaling enabled');
  } catch (err) {
    logger.warn('Failed to connect Redis adapter, falling back to in-memory:', err);
  }
};

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter as express.RequestHandler);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/teams', authMiddleware, teamRoutes);
app.use('/api/companies', authMiddleware, companyRoutes);
app.use('/api/opportunities', authMiddleware, opportunityRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes);
app.use('/api/conversations', authMiddleware, conversationRoutes);
app.use('/api/search', authMiddleware, searchRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/subscriptions', authMiddleware, subscriptionRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Socket.IO authentication and handlers
io.use(socketAuthMiddleware);
registerSocketHandlers(io);

// Make io available to other modules
app.set('io', io);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => {
    logger.warn('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server with Redis adapter
const startServer = async () => {
  await setupRedisAdapter();

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`API base URL: http://localhost:${PORT}/api`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
