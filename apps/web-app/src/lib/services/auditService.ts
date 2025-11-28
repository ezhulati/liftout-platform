import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export type AdminActionType =
  | 'user.view'
  | 'user.edit'
  | 'user.suspend'
  | 'user.unsuspend'
  | 'user.ban'
  | 'user.unban'
  | 'user.impersonate'
  | 'user.password_reset'
  | 'user.note_add'
  | 'verification.company.approve'
  | 'verification.company.reject'
  | 'verification.team.approve'
  | 'verification.team.reject'
  | 'moderation.approve'
  | 'moderation.reject'
  | 'moderation.escalate'
  | 'billing.subscription.view'
  | 'billing.subscription.cancel'
  | 'billing.subscription.modify'
  | 'billing.refund.process'
  | 'gdpr.export.request'
  | 'gdpr.export.complete'
  | 'gdpr.delete.request'
  | 'gdpr.delete.complete'
  | 'admin.login'
  | 'admin.logout'
  | 'admin.2fa.setup'
  | 'admin.2fa.verify'
  | 'admin.settings.update';

interface AuditLogData {
  adminId: string;
  action: AdminActionType;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

/**
 * Log an admin action to the audit trail
 */
export async function logAdminAction(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.adminId,
        action: data.action,
        resourceType: data.targetType || 'unknown',
        resourceId: data.targetId || null,
        newValues: JSON.parse(JSON.stringify({
          ...data.metadata,
          previousValue: data.previousValue,
          newValue: data.newValue,
        })),
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  } catch (error) {
    // Log error but don't fail the main operation
    console.error('Failed to log admin action:', error);
  }
}

/**
 * Extract request metadata for audit logging
 */
export function extractRequestMetadata(req: NextRequest): {
  ipAddress: string;
  userAgent: string;
  url: string;
  method: string;
} {
  return {
    ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    url: req.url,
    method: req.method,
  };
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters: {
  adminId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters.adminId) {
    where.userId = filters.adminId;
  }

  if (filters.action) {
    where.action = { contains: filters.action };
  }

  if (filters.targetType) {
    where.entityType = filters.targetType;
  }

  if (filters.targetId) {
    where.entityId = filters.targetId;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as Record<string, Date>).gte = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as Record<string, Date>).lte = filters.endDate;
    }
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

/**
 * Get audit logs for a specific entity (user, team, company, etc.)
 */
export async function getEntityAuditTrail(resourceType: string, resourceId: string) {
  return prisma.auditLog.findMany({
    where: {
      resourceType,
      resourceId,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}
