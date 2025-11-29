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

/**
 * Get a single user by ID with full details
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      teamMemberships: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
              verificationStatus: true,
            },
          },
        },
      },
      companyMemberships: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              verificationStatus: true,
            },
          },
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Update user details
 */
export async function updateUser(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: 'individual' | 'company' | 'admin';
    emailVerified?: boolean;
  },
  adminId: string
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return user;
}

/**
 * Soft delete a user (sets deletedAt)
 */
export async function softDeleteUser(
  userId: string,
  adminId: string,
  reason?: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      deletedBy: adminId,
    },
  });
}

/**
 * Hard delete a user (permanent - requires confirmation)
 */
export async function hardDeleteUser(
  userId: string,
  adminId: string,
  confirmationEmail: string
): Promise<void> {
  // Verify the confirmation email matches
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.email.toLowerCase() !== confirmationEmail.toLowerCase()) {
    throw new Error('Confirmation email does not match');
  }

  // Delete related records first (cascade doesn't handle all)
  await prisma.$transaction([
    // Delete team memberships
    prisma.teamMember.deleteMany({ where: { userId } }),
    // Delete company memberships
    prisma.companyUser.deleteMany({ where: { userId } }),
    // Delete the user
    prisma.user.delete({ where: { id: userId } }),
  ]);
}

/**
 * Restore a soft-deleted user
 */
export async function restoreUser(userId: string, adminId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: null,
      deletedBy: null,
    },
  });
}

/**
 * Force password reset for a user
 */
export async function forcePasswordReset(userId: string, adminId: string): Promise<void> {
  const resetToken = CryptoJS.lib.WordArray.random(32).toString();
  const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    },
  });

  // In production, you'd send an email here
  // For now, just set the token
}

/**
 * Get admin notes for an entity
 */
export async function getAdminNotes(entityType: string, entityId: string) {
  const notes = await prisma.adminNote.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get admin user details for each note
  const adminIds = [...new Set(notes.map((n: { createdBy: string }) => n.createdBy))];
  const admins = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  const adminMap = new Map(admins.map((a: { id: string; firstName: string; lastName: string; email: string }) => [a.id, a]));

  return notes.map((note: { createdBy: string }) => ({
    ...note,
    createdByUser: adminMap.get(note.createdBy) || null,
  }));
}

/**
 * Create an admin note for an entity
 */
export async function createAdminNote(
  entityType: string,
  entityId: string,
  note: string,
  adminId: string
) {
  return prisma.adminNote.create({
    data: {
      entityType,
      entityId,
      note,
      createdBy: adminId,
    },
  });
}

/**
 * Delete an admin note
 */
export async function deleteAdminNote(noteId: string, adminId: string): Promise<void> {
  await prisma.adminNote.delete({
    where: { id: noteId },
  });
}

/**
 * Start an impersonation session
 */
export async function startImpersonation(
  adminId: string,
  targetUserId: string,
  reason: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<{ token: string; expiresAt: Date }> {
  // Don't allow impersonating other admins
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { userType: true, deletedAt: true, bannedAt: true },
  });

  if (!targetUser) {
    throw new Error('Target user not found');
  }

  if (targetUser.userType === 'admin') {
    throw new Error('Cannot impersonate admin users');
  }

  if (targetUser.deletedAt) {
    throw new Error('Cannot impersonate deleted users');
  }

  if (targetUser.bannedAt) {
    throw new Error('Cannot impersonate banned users');
  }

  // Generate unique token
  const token = CryptoJS.lib.WordArray.random(32).toString();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.impersonationSession.create({
    data: {
      adminId,
      targetUserId,
      reason,
      token,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    },
  });

  return { token, expiresAt };
}

/**
 * End an impersonation session
 */
export async function endImpersonation(token: string): Promise<void> {
  await prisma.impersonationSession.update({
    where: { token },
    data: { endedAt: new Date() },
  });
}

/**
 * Validate an impersonation token and get session details
 */
export async function validateImpersonation(token: string) {
  const session = await prisma.impersonationSession.findUnique({
    where: { token },
    include: {
      admin: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      targetUser: {
        select: { id: true, firstName: true, lastName: true, email: true, userType: true },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.endedAt) {
    return null; // Session already ended
  }

  if (session.expiresAt < new Date()) {
    return null; // Session expired
  }

  return session;
}

/**
 * Get active impersonation sessions for an admin
 */
export async function getActiveImpersonationSessions(adminId: string) {
  return prisma.impersonationSession.findMany({
    where: {
      adminId,
      endedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      targetUser: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { startedAt: 'desc' },
  });
}

// ==================== TEAM MANAGEMENT ====================

/**
 * Get all teams with filters
 */
export async function getTeams(filters?: {
  query?: string;
  verificationStatus?: string;
  status?: 'active' | 'deleted';
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  // Handle soft delete filter
  if (filters?.status === 'deleted') {
    where.deletedAt = { not: null };
  } else if (filters?.status === 'active') {
    where.deletedAt = null;
  }

  // Search by name or description
  if (filters?.query) {
    where.OR = [
      { name: { contains: filters.query, mode: 'insensitive' } },
      { description: { contains: filters.query, mode: 'insensitive' } },
    ];
  }

  // Filter by verification status
  if (filters?.verificationStatus) {
    where.verificationStatus = filters.verificationStatus;
  }

  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where,
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        _count: {
          select: { members: true, applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
    }),
    prisma.team.count({ where }),
  ]);

  return { teams, total };
}

/**
 * Get a single team by ID with full details
 */
export async function getTeamById(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      creator: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: { select: { profilePhotoUrl: true } },
            },
          },
        },
      },
      applications: {
        include: {
          opportunity: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { members: true, applications: true },
      },
    },
  });

  if (!team) {
    throw new Error('Team not found');
  }

  return team;
}

/**
 * Update team details
 */
export async function updateTeam(
  teamId: string,
  data: {
    name?: string;
    description?: string;
    industry?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
  },
  adminId: string
) {
  const updateData: any = { ...data };

  // Handle verification status changes
  if (data.verificationStatus === 'verified') {
    updateData.verifiedAt = new Date();
    updateData.verifiedBy = adminId;
  } else if (data.verificationStatus === 'rejected' || data.verificationStatus === 'pending') {
    updateData.verifiedAt = null;
    updateData.verifiedBy = null;
  }

  return prisma.team.update({
    where: { id: teamId },
    data: updateData,
  });
}

/**
 * Verify a team
 */
export async function verifyTeam(teamId: string, adminId: string) {
  return prisma.team.update({
    where: { id: teamId },
    data: {
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      verifiedBy: adminId,
    },
  });
}

/**
 * Reject team verification
 */
export async function rejectTeamVerification(teamId: string, adminId: string, reason?: string) {
  return prisma.team.update({
    where: { id: teamId },
    data: {
      verificationStatus: 'rejected',
      verifiedAt: null,
      verifiedBy: null,
    },
  });
}

/**
 * Soft delete a team
 */
export async function softDeleteTeam(teamId: string, adminId: string): Promise<void> {
  await prisma.team.update({
    where: { id: teamId },
    data: {
      deletedAt: new Date(),
      deletedBy: adminId,
    },
  });
}

/**
 * Restore a soft-deleted team
 */
export async function restoreTeam(teamId: string): Promise<void> {
  await prisma.team.update({
    where: { id: teamId },
    data: {
      deletedAt: null,
      deletedBy: null,
    },
  });
}

/**
 * Hard delete a team (permanent)
 */
export async function hardDeleteTeam(
  teamId: string,
  adminId: string,
  confirmationName: string
): Promise<void> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Error('Team not found');
  }

  if (team.name.toLowerCase() !== confirmationName.toLowerCase()) {
    throw new Error('Confirmation name does not match');
  }

  // Delete in order to respect foreign key constraints
  await prisma.$transaction([
    prisma.teamMember.deleteMany({ where: { teamId } }),
    prisma.teamApplication.deleteMany({ where: { teamId } }),
    prisma.team.delete({ where: { id: teamId } }),
  ]);
}

// ==================== COMPANY MANAGEMENT ====================

/**
 * Get all companies with filters
 */
export async function getCompanies(filters?: {
  query?: string;
  verificationStatus?: string;
  status?: 'active' | 'deleted';
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  // Handle soft delete filter
  if (filters?.status === 'deleted') {
    where.deletedAt = { not: null };
  } else if (filters?.status === 'active') {
    where.deletedAt = null;
  }

  // Search by name
  if (filters?.query) {
    where.OR = [
      { name: { contains: filters.query, mode: 'insensitive' } },
      { description: { contains: filters.query, mode: 'insensitive' } },
    ];
  }

  // Filter by verification status
  if (filters?.verificationStatus) {
    where.verificationStatus = filters.verificationStatus;
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { users: true, opportunities: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
    }),
    prisma.company.count({ where }),
  ]);

  return { companies, total };
}

/**
 * Get a single company by ID with full details
 */
export async function getCompanyById(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: { select: { profilePhotoUrl: true } },
            },
          },
        },
      },
      opportunities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { users: true, opportunities: true },
      },
    },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  return company;
}

/**
 * Update company details
 */
export async function updateCompany(
  companyId: string,
  data: {
    name?: string;
    description?: string;
    industry?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
  },
  adminId: string
) {
  const updateData: any = { ...data };

  // Handle verification status changes
  if (data.verificationStatus === 'verified') {
    updateData.verifiedAt = new Date();
    updateData.verifiedBy = adminId;
  } else if (data.verificationStatus === 'rejected' || data.verificationStatus === 'pending') {
    updateData.verifiedAt = null;
    updateData.verifiedBy = null;
  }

  return prisma.company.update({
    where: { id: companyId },
    data: updateData,
  });
}

/**
 * Verify a company
 */
export async function verifyCompany(companyId: string, adminId: string) {
  return prisma.company.update({
    where: { id: companyId },
    data: {
      verificationStatus: 'verified',
      verifiedAt: new Date(),
      verifiedBy: adminId,
    },
  });
}

/**
 * Reject company verification
 */
export async function rejectCompanyVerification(companyId: string, adminId: string, reason?: string) {
  return prisma.company.update({
    where: { id: companyId },
    data: {
      verificationStatus: 'rejected',
      verifiedAt: null,
      verifiedBy: null,
    },
  });
}

/**
 * Soft delete a company
 */
export async function softDeleteCompany(companyId: string, adminId: string): Promise<void> {
  await prisma.company.update({
    where: { id: companyId },
    data: {
      deletedAt: new Date(),
      deletedBy: adminId,
    },
  });
}

/**
 * Restore a soft-deleted company
 */
export async function restoreCompany(companyId: string): Promise<void> {
  await prisma.company.update({
    where: { id: companyId },
    data: {
      deletedAt: null,
      deletedBy: null,
    },
  });
}

/**
 * Hard delete a company (permanent)
 */
export async function hardDeleteCompany(
  companyId: string,
  adminId: string,
  confirmationName: string
): Promise<void> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { name: true },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  if (company.name.toLowerCase() !== confirmationName.toLowerCase()) {
    throw new Error('Confirmation name does not match');
  }

  // Delete in order to respect foreign key constraints
  await prisma.$transaction([
    prisma.companyUser.deleteMany({ where: { companyId } }),
    prisma.opportunity.deleteMany({ where: { companyId } }),
    prisma.company.delete({ where: { id: companyId } }),
  ]);
}
