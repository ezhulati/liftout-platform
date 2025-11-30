import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { User } from '@/types/firebase';

// Type for API handler functions
export type ApiHandler = (
  req: NextRequest,
  params?: any
) => Promise<NextResponse>;

// Type for authenticated API handler functions
export type AuthenticatedApiHandler = (
  req: NextRequest,
  user: User,
  params?: any
) => Promise<NextResponse>;

// Error response helper
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Success response helper
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

// Middleware to require authentication
export function withAuth(handler: AuthenticatedApiHandler): ApiHandler {
  return async (req: NextRequest, params?: any) => {
    try {
      const token = await getToken({ req });
      
      if (!token) {
        return errorResponse('Authentication required', 401);
      }

      // Extract user data from token
      const user: User = {
        id: token.sub as string,
        email: token.email as string,
        name: token.name as string,
        type: token.userType as 'individual' | 'company',
        photoURL: token.picture as string || '',
        phone: '',
        location: '',
        industry: '',
        companyName: '',
        position: '',
        verified: false,
        status: 'active',
        preferences: {
          notifications: true,
          marketing: true,
          confidentialMode: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return handler(req, user, params);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return errorResponse('Authentication failed', 500);
    }
  };
}

// Middleware to require specific user type
export function withUserType(
  userType: 'individual' | 'company',
  handler: AuthenticatedApiHandler
): ApiHandler {
  return withAuth(async (req: NextRequest, user: User, params?: any) => {
    if (user.type !== userType) {
      return errorResponse(
        `Access denied. ${userType} user access required.`,
        403
      );
    }

    return handler(req, user, params);
  });
}

// Middleware to require individual user access
export function withIndividualAccess(handler: AuthenticatedApiHandler): ApiHandler {
  return withUserType('individual', handler);
}

// Middleware to require company user access
export function withCompanyAccess(handler: AuthenticatedApiHandler): ApiHandler {
  return withUserType('company', handler);
}

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100, 
  windowMs: number = 60000 // 1 minute
) {
  return function rateLimitMiddleware(handler: ApiHandler): ApiHandler {
    return async (req: NextRequest, params?: any) => {
      const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      
      const current = rateLimitMap.get(identifier);
      
      if (!current || now > current.resetTime) {
        rateLimitMap.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
        });
      } else {
        current.count++;
        
        if (current.count > maxRequests) {
          return errorResponse('Rate limit exceeded', 429);
        }
      }

      return handler(req, params);
    };
  };
}

// CORS middleware
export function withCors(
  allowedOrigins: string[] = [],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
) {
  return function corsMiddleware(handler: ApiHandler): ApiHandler {
    return async (req: NextRequest, params?: any) => {
      const origin = req.headers.get('origin');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        
        if (allowedOrigins.length > 0 && origin && allowedOrigins.includes(origin)) {
          response.headers.set('Access-Control-Allow-Origin', origin);
        } else if (allowedOrigins.length === 0) {
          response.headers.set('Access-Control-Allow-Origin', '*');
        }
        
        response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400');
        
        return response;
      }

      // Handle actual request
      const response = await handler(req, params);
      
      if (allowedOrigins.length > 0 && origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      } else if (allowedOrigins.length === 0) {
        response.headers.set('Access-Control-Allow-Origin', '*');
      }
      
      return response;
    };
  };
}

// Input validation middleware
export function withValidation<T>(
  schema: (data: any) => T,
  handler: (req: NextRequest, validatedData: T, user?: User, params?: any) => Promise<NextResponse>
): ApiHandler {
  return async (req: NextRequest, params?: any) => {
    try {
      const body = await req.json();
      const validatedData = schema(body);
      
      // For GET requests, pass null as validated data
      if (req.method === 'GET') {
        return handler(req, null as T, undefined, params);
      }
      
      return handler(req, validatedData, undefined, params);
    } catch (error) {
      return errorResponse('Invalid request data', 400);
    }
  };
}

// Compose multiple middleware functions
export function compose(...middlewares: Array<(handler: ApiHandler) => ApiHandler>) {
  return function composedMiddleware(handler: ApiHandler): ApiHandler {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

// Security headers middleware
export function withSecurityHeaders(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, params?: any) => {
    const response = await handler(req, params);
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  };
}

// Request logging middleware
export function withLogging(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, params?: any) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Started`);
    
    try {
      const response = await handler(req, params);
      const duration = Date.now() - start;
      
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} - ${response.status} (${duration}ms)`
      );
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `[${new Date().toISOString()}] ${method} ${url} - Error (${duration}ms):`,
        error
      );
      throw error;
    }
  };
}

// Example usage combinations
export const withStandardAuth = compose(
  withSecurityHeaders,
  withLogging,
  withRateLimit(100, 60000),
  withAuth
);

export const withIndividualAuth = compose(
  withSecurityHeaders,
  withLogging,
  withRateLimit(100, 60000),
  withIndividualAccess
);

export const withCompanyAuth = compose(
  withSecurityHeaders,
  withLogging,
  withRateLimit(100, 60000),
  withCompanyAccess
);