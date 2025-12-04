import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { logAdminAction, extractRequestMetadata, AdminActionType } from '@/lib/services/auditService';

// Extended user type for admin context
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  userType: 'admin';
  twoFactorEnabled: boolean;
  twoFactorVerified?: boolean; // Set in session after 2FA verification
}

// Type for admin API handler functions
export type AdminApiHandler = (
  req: NextRequest,
  admin: AdminUser,
  params?: Record<string, string>
) => Promise<NextResponse>;

// Error response helper
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Middleware to require admin access with 2FA verification
 * Use this for all admin API routes
 */
export function withAdminAccess(handler: AdminApiHandler) {
  return async (req: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      const token = await getToken({ req });

      // Check if user is authenticated
      if (!token || !token.sub) {
        return errorResponse('Authentication required', 401);
      }

      // Check if user is an admin
      if (token.userType !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      // Get full user data from database for 2FA status
      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          twoFactorEnabled: true,
          suspendedAt: true,
          bannedAt: true,
        },
      });

      if (!user) {
        return errorResponse('User not found', 404);
      }

      // Check if user is suspended or banned
      if (user.suspendedAt) {
        return errorResponse('Account is suspended', 403);
      }

      if (user.bannedAt) {
        return errorResponse('Account is banned', 403);
      }

      // Verify user type in database matches
      if (user.userType !== 'admin') {
        return errorResponse('Admin access required', 403);
      }

      // Note: 2FA is recommended but not required for basic admin access
      // Sensitive operations should use withAdminAction which can enforce stricter requirements
      // This allows admins to access the dashboard and set up 2FA from there

      // Construct admin user object
      const admin: AdminUser = {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: 'admin',
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorVerified: (token as Record<string, unknown>).twoFactorVerified as boolean,
      };

      // Extract request metadata for logging
      const metadata = extractRequestMetadata(req);

      // Log the admin API access
      await logAdminAction({
        adminId: admin.id,
        action: 'admin.login' as AdminActionType,
        metadata: {
          url: metadata.url,
          method: metadata.method,
        },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });

      // Call the actual handler
      return handler(req, admin, context?.params);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return errorResponse('Internal server error', 500);
    }
  };
}

/**
 * Middleware specifically for admin actions that should be audit logged
 * Wraps the handler and logs the action after successful completion
 */
export function withAdminAction(
  actionType: AdminActionType,
  getTargetInfo?: (
    req: NextRequest,
    result: NextResponse
  ) => { targetType?: string; targetId?: string } | Promise<{ targetType?: string; targetId?: string }>
) {
  return (handler: AdminApiHandler) => {
    return withAdminAccess(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
      const metadata = extractRequestMetadata(req);
      const startTime = Date.now();

      try {
        // Call the actual handler
        const response = await handler(req, admin, params);

        // Get target info if provided
        let targetInfo: { targetType?: string; targetId?: string } = {};
        if (getTargetInfo) {
          targetInfo = await getTargetInfo(req, response);
        }

        // Log the action after successful completion
        const duration = Date.now() - startTime;
        await logAdminAction({
          adminId: admin.id,
          action: actionType,
          targetType: targetInfo.targetType,
          targetId: targetInfo.targetId,
          metadata: {
            url: metadata.url,
            method: metadata.method,
            duration,
            status: response.status,
          },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        });

        return response;
      } catch (error) {
        // Log failed actions too
        const duration = Date.now() - startTime;
        await logAdminAction({
          adminId: admin.id,
          action: actionType,
          metadata: {
            url: metadata.url,
            method: metadata.method,
            duration,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        });

        throw error;
      }
    });
  };
}

/**
 * Check if the current user is an admin (for client-side checks)
 * This is a lighter check that doesn't require database access
 */
export async function isAdminUser(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req });
  return token?.userType === 'admin';
}

/**
 * Get the admin session from a request
 */
export async function getAdminSession(req: NextRequest): Promise<AdminUser | null> {
  const token = await getToken({ req });

  if (!token || token.userType !== 'admin') {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub as string },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userType: true,
      twoFactorEnabled: true,
    },
  });

  if (!user || user.userType !== 'admin') {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: 'admin',
    twoFactorEnabled: user.twoFactorEnabled,
    twoFactorVerified: (token as Record<string, unknown>).twoFactorVerified as boolean,
  };
}
