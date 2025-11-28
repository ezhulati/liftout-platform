import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.TWO_FACTOR_ENCRYPTION_KEY || 'liftout-2fa-encryption-key-2024';

/**
 * Encrypt a value for storage
 */
function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
}

/**
 * Decrypt a stored value
 */
function decrypt(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generate a new TOTP secret for 2FA setup
 */
export async function generate2FASecret(userId: string): Promise<{
  secret: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate TOTP secret
  const secret = speakeasy.generateSecret({
    name: `Liftout Admin (${user.email})`,
    issuer: 'Liftout',
    length: 32,
  });

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || '');

  // Generate backup codes (10 codes, 8 characters each)
  const backupCodes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    backupCodes.push(code);
  }

  // Store encrypted secret and hashed backup codes temporarily
  // Final storage happens when user verifies the code
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: encrypt(secret.base32),
      backupCodes: backupCodes.map((code) => CryptoJS.SHA256(code).toString()),
    },
  });

  return {
    secret: secret.base32,
    qrCodeDataUrl,
    backupCodes,
  };
}

/**
 * Verify a TOTP code and enable 2FA
 */
export async function verify2FACode(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user || !user.twoFactorSecret) {
    return { success: false, error: '2FA not set up' };
  }

  const secret = decrypt(user.twoFactorSecret);

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 2, // Allow 1 code before and after for clock drift
  });

  if (verified) {
    // Enable 2FA if this is the first verification
    if (!user.twoFactorEnabled) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true },
      });
    }
    return { success: true };
  }

  return { success: false, error: 'Invalid code' };
}

/**
 * Verify a backup code (one-time use)
 */
export async function verifyBackupCode(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string; remainingCodes?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { backupCodes: true },
  });

  if (!user || !user.backupCodes) {
    return { success: false, error: 'No backup codes found' };
  }

  const hashedCode = CryptoJS.SHA256(code.toUpperCase()).toString();
  const backupCodes = user.backupCodes as string[];
  const codeIndex = backupCodes.indexOf(hashedCode);

  if (codeIndex === -1) {
    return { success: false, error: 'Invalid backup code' };
  }

  // Remove used code
  backupCodes.splice(codeIndex, 1);

  await prisma.user.update({
    where: { id: userId },
    data: { backupCodes },
  });

  return { success: true, remainingCodes: backupCodes.length };
}

/**
 * Disable 2FA for a user (admin action or self-service with verification)
 */
export async function disable2FA(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: Prisma.DbNull,
    },
  });
}

/**
 * Check if user needs 2FA setup or verification
 */
export async function check2FAStatus(userId: string): Promise<{
  enabled: boolean;
  hasSecret: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  });

  return {
    enabled: user?.twoFactorEnabled || false,
    hasSecret: !!user?.twoFactorSecret,
  };
}

/**
 * Suspend a user account
 */
export async function suspendUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: new Date(),
      suspendedBy: adminId,
      suspendedReason: reason,
    },
  });
}

/**
 * Unsuspend a user account
 */
export async function unsuspendUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: null,
      suspendedBy: null,
      suspendedReason: null,
    },
  });
}

/**
 * Ban a user account (permanent)
 */
export async function banUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedAt: new Date(),
      bannedBy: adminId,
      bannedReason: reason,
    },
  });
}

/**
 * Unban a user account
 */
export async function unbanUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedAt: null,
      bannedBy: null,
      bannedReason: null,
    },
  });
}

/**
 * Get dashboard metrics for admin panel
 */
export async function getAdminDashboardMetrics() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersToday,
    newUsersWeek,
    activeUsersWeek,
    totalTeams,
    verifiedTeams,
    pendingTeamVerifications,
    totalCompanies,
    verifiedCompanies,
    pendingCompanyVerifications,
    totalOpportunities,
    activeOpportunities,
    totalApplications,
    pendingModerationFlags,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { lastActive: { gte: weekAgo } } }),
    prisma.team.count(),
    prisma.team.count({ where: { verificationStatus: 'verified' } }),
    prisma.team.count({ where: { verificationStatus: 'pending' } }),
    prisma.company.count(),
    prisma.company.count({ where: { verificationStatus: 'verified' } }),
    prisma.company.count({ where: { verificationStatus: { not: 'verified' } } }),
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: 'active' } }),
    prisma.teamApplication.count(),
    prisma.moderationFlag.count({ where: { status: 'pending' } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      newToday: newUsersToday,
      newThisWeek: newUsersWeek,
      activeThisWeek: activeUsersWeek,
    },
    teams: {
      total: totalTeams,
      verified: verifiedTeams,
      pendingVerification: pendingTeamVerifications,
    },
    companies: {
      total: totalCompanies,
      verified: verifiedCompanies,
      pendingVerification: pendingCompanyVerifications,
    },
    opportunities: {
      total: totalOpportunities,
      active: activeOpportunities,
    },
    applications: {
      total: totalApplications,
    },
    moderation: {
      pendingFlags: pendingModerationFlags,
    },
    recentActivity: recentAuditLogs,
  };
}

/**
 * Search users with filters
 */
export async function searchUsers(filters: {
  query?: string;
  userType?: string;
  status?: 'active' | 'suspended' | 'banned';
  verified?: boolean;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters.query) {
    where.OR = [
      { email: { contains: filters.query, mode: 'insensitive' } },
      { firstName: { contains: filters.query, mode: 'insensitive' } },
      { lastName: { contains: filters.query, mode: 'insensitive' } },
    ];
  }

  if (filters.userType) {
    where.userType = filters.userType;
  }

  if (filters.status === 'suspended') {
    where.suspendedAt = { not: null };
  } else if (filters.status === 'banned') {
    where.bannedAt = { not: null };
  } else if (filters.status === 'active') {
    where.suspendedAt = null;
    where.bannedAt = null;
  }

  if (filters.verified !== undefined) {
    where.emailVerified = filters.verified;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        emailVerified: true,
        createdAt: true,
        lastActive: true,
        suspendedAt: true,
        suspendedReason: true,
        bannedAt: true,
        bannedReason: true,
        profile: {
          select: {
            profilePhotoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}
