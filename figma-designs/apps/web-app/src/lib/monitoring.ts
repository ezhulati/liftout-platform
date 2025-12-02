/**
 * Monitoring and Observability Utilities
 *
 * This module provides structured logging, error tracking, and performance
 * monitoring utilities. Configure SENTRY_DSN, LOGFLARE_API_KEY, or similar
 * environment variables to enable external integrations.
 */

// ============================================
// TYPES
// ============================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  teamId?: string;
  companyId?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ErrorReport {
  error: Error;
  context?: LogContext;
  tags?: Record<string, string>;
  user?: { id: string; email?: string };
}

// ============================================
// CONFIGURATION
// ============================================

const config = {
  // Log level threshold
  logLevel: (process.env.LOG_LEVEL || 'info') as LogLevel,
  // Enable detailed logging in development
  isDevelopment: process.env.NODE_ENV === 'development',
  // External service configuration
  sentryDsn: process.env.SENTRY_DSN,
  logflareApiKey: process.env.LOGFLARE_API_KEY,
  // Performance thresholds (ms)
  slowRequestThreshold: parseInt(process.env.SLOW_REQUEST_THRESHOLD || '2000'),
  slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || '500'),
};

const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// ============================================
// LOGGER
// ============================================

function shouldLog(level: LogLevel): boolean {
  return logLevelPriority[level] >= logLevelPriority[config.logLevel];
}

function formatLogMessage(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (shouldLog('debug')) {
      console.debug(formatLogMessage('debug', message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    if (shouldLog('info')) {
      console.info(formatLogMessage('info', message, context));
    }
  },

  warn(message: string, context?: LogContext): void {
    if (shouldLog('warn')) {
      console.warn(formatLogMessage('warn', message, context));
    }
  },

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (shouldLog('error')) {
      console.error(formatLogMessage('error', message, context));
      if (error instanceof Error) {
        console.error(error.stack);
      } else if (error) {
        console.error(error);
      }
    }
  },
};

// ============================================
// ERROR TRACKING
// ============================================

/**
 * Report an error to external error tracking service (e.g., Sentry)
 * Configure SENTRY_DSN environment variable to enable
 */
export async function captureError(report: ErrorReport): Promise<void> {
  const { error, context, tags, user } = report;

  // Always log locally
  logger.error(error.message, error, context);

  // In development, just log to console
  if (config.isDevelopment) {
    console.error('Error captured (dev mode):', {
      message: error.message,
      stack: error.stack,
      context,
      tags,
      user,
    });
    return;
  }

  // If Sentry is configured, send to Sentry
  if (config.sentryDsn) {
    try {
      const Sentry = await import('@sentry/nextjs');
      if (user) {
        Sentry.setUser({ id: user.id, email: user.email });
      }
      if (tags) {
        Object.entries(tags).forEach(([key, value]) => {
          Sentry.setTag(key, value);
        });
      }
      if (context) {
        Sentry.setContext('additional', context);
      }
      Sentry.captureException(error);
    } catch {
      // Sentry not available, skip
    }
  }
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: LogContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await captureError({
        error: error instanceof Error ? error : new Error(String(error)),
        context,
      });
      throw error;
    }
  }) as T;
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

const performanceMetrics: PerformanceMetric[] = [];
const MAX_STORED_METRICS = 1000;

/**
 * Record a performance metric
 */
export function recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
  const fullMetric: PerformanceMetric = {
    ...metric,
    timestamp: new Date(),
  };

  performanceMetrics.push(fullMetric);

  // Prevent memory leaks
  if (performanceMetrics.length > MAX_STORED_METRICS) {
    performanceMetrics.shift();
  }

  // Log slow operations
  if (metric.name.includes('request') && metric.duration > config.slowRequestThreshold) {
    logger.warn(`Slow request detected: ${metric.name}`, {
      duration: metric.duration,
      ...metric.metadata,
    });
  } else if (metric.name.includes('query') && metric.duration > config.slowQueryThreshold) {
    logger.warn(`Slow query detected: ${metric.name}`, {
      duration: metric.duration,
      ...metric.metadata,
    });
  }
}

/**
 * Measure the execution time of an async function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = Math.round(performance.now() - start);
    recordMetric({ name, duration, metadata });
  }
}

/**
 * Create a timer for manual measurements
 */
export function createTimer(name: string): {
  end: (metadata?: Record<string, unknown>) => number;
} {
  const start = performance.now();
  return {
    end(metadata?: Record<string, unknown>): number {
      const duration = Math.round(performance.now() - start);
      recordMetric({ name, duration, metadata });
      return duration;
    },
  };
}

/**
 * Get recent performance metrics
 */
export function getMetrics(limit = 100): PerformanceMetric[] {
  return performanceMetrics.slice(-limit);
}

/**
 * Get performance summary
 */
export function getMetricsSummary(): {
  totalRequests: number;
  avgDuration: number;
  slowRequests: number;
  errorRate: number;
} {
  const requestMetrics = performanceMetrics.filter((m) =>
    m.name.includes('request')
  );

  if (requestMetrics.length === 0) {
    return { totalRequests: 0, avgDuration: 0, slowRequests: 0, errorRate: 0 };
  }

  const totalDuration = requestMetrics.reduce((sum, m) => sum + m.duration, 0);
  const slowRequests = requestMetrics.filter(
    (m) => m.duration > config.slowRequestThreshold
  ).length;

  return {
    totalRequests: requestMetrics.length,
    avgDuration: Math.round(totalDuration / requestMetrics.length),
    slowRequests,
    errorRate: slowRequests / requestMetrics.length,
  };
}

// ============================================
// API ROUTE INSTRUMENTATION
// ============================================

/**
 * Wrap an API route handler with logging and metrics
 */
export function instrumentRoute<T>(
  routeName: string,
  handler: () => Promise<T>
): Promise<T> {
  return measureAsync(`request:${routeName}`, async () => {
    logger.info(`API request started: ${routeName}`);
    try {
      const result = await handler();
      logger.info(`API request completed: ${routeName}`);
      return result;
    } catch (error) {
      logger.error(`API request failed: ${routeName}`, error);
      throw error;
    }
  });
}

// ============================================
// USER ACTIVITY TRACKING
// ============================================

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const userActivities: UserActivity[] = [];
const MAX_STORED_ACTIVITIES = 500;

/**
 * Track user activity for analytics
 */
export function trackActivity(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  const activity: UserActivity = {
    userId,
    action,
    timestamp: new Date(),
    metadata,
  };

  userActivities.push(activity);

  // Prevent memory leaks
  if (userActivities.length > MAX_STORED_ACTIVITIES) {
    userActivities.shift();
  }

  logger.debug(`User activity: ${action}`, { userId, ...metadata });
}

/**
 * Get recent user activities
 */
export function getRecentActivities(
  userId?: string,
  limit = 50
): UserActivity[] {
  let activities = userActivities;
  if (userId) {
    activities = activities.filter((a) => a.userId === userId);
  }
  return activities.slice(-limit);
}

// ============================================
// HEALTH CHECK
// ============================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
  }[];
}

/**
 * Run health checks and return status
 */
export async function getHealthStatus(): Promise<HealthStatus> {
  const checks: HealthStatus['checks'] = [];

  // Memory check
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  checks.push({
    name: 'memory',
    status: heapUsedMB / heapTotalMB < 0.9 ? 'pass' : 'fail',
    message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB`,
  });

  // Performance check
  const summary = getMetricsSummary();
  checks.push({
    name: 'performance',
    status: summary.errorRate < 0.1 ? 'pass' : 'fail',
    message: `Avg response: ${summary.avgDuration}ms, Error rate: ${(
      summary.errorRate * 100
    ).toFixed(1)}%`,
  });

  // Determine overall status
  const failedChecks = checks.filter((c) => c.status === 'fail').length;
  let status: HealthStatus['status'] = 'healthy';
  if (failedChecks > 0) status = 'degraded';
  if (failedChecks === checks.length) status = 'unhealthy';

  return {
    status,
    timestamp: new Date(),
    checks,
  };
}

// ============================================
// EXPORTS
// ============================================

export const monitoring = {
  logger,
  captureError,
  withErrorTracking,
  measureAsync,
  createTimer,
  recordMetric,
  getMetrics,
  getMetricsSummary,
  instrumentRoute,
  trackActivity,
  getRecentActivities,
  getHealthStatus,
};

export default monitoring;
