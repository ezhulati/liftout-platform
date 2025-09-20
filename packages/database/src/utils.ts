import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Pagination utilities
export const calculatePagination = (page: number, limit: number, total: number) => {
  const pages = Math.ceil(total / limit);
  const hasNext = page < pages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    pages,
    hasNext,
    hasPrev,
    offset: (page - 1) * limit
  };
};

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number
) => {
  const pageNum = Number(page) || 1;
  const limitNum = Math.min(Number(limit) || 20, 100); // Max 100 items per page
  
  return {
    page: Math.max(pageNum, 1),
    limit: limitNum,
    skip: (Math.max(pageNum, 1) - 1) * limitNum,
    take: limitNum
  };
};

// Search utilities
export const buildSearchQuery = (searchTerm?: string) => {
  if (!searchTerm) return undefined;
  
  return {
    search: searchTerm,
    mode: 'insensitive' as Prisma.QueryMode
  };
};

export const buildFullTextSearch = (searchTerm?: string, fields: string[] = []) => {
  if (!searchTerm || fields.length === 0) return undefined;
  
  const searchConditions = fields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: 'insensitive' as Prisma.QueryMode
    }
  }));
  
  return { OR: searchConditions };
};

// Date utilities
export const getDateRange = (period: '7d' | '30d' | '90d' | '1y') => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return { startDate, endDate: now };
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const generateUniqueSlug = async (
  text: string,
  checkFunction: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = generateSlug(text);
  let counter = 1;
  
  while (await checkFunction(slug)) {
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
  }
  
  return slug;
};

// JSON utilities
export const safeJsonParse = <T = any>(
  json: string | null | undefined,
  defaultValue: T
): T => {
  if (!json) return defaultValue;
  
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

// Array utilities
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Error utilities
export const isPrismaError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

export const handlePrismaError = (error: any): { message: string; code?: string } => {
  if (isPrismaError(error)) {
    switch (error.code) {
      case 'P2002':
        return { message: 'A record with this value already exists', code: 'UNIQUE_VIOLATION' };
      case 'P2025':
        return { message: 'Record not found', code: 'NOT_FOUND' };
      case 'P2003':
        return { message: 'Foreign key constraint failed', code: 'FOREIGN_KEY_VIOLATION' };
      case 'P2014':
        return { message: 'Invalid ID provided', code: 'INVALID_ID' };
      default:
        return { message: 'Database error occurred', code: error.code };
    }
  }
  
  return { message: 'An unexpected error occurred' };
};

// Validation schemas (basic - you might want to use Zod for more complex validation)
export const createTeamSchema = {
  name: { required: true, minLength: 2, maxLength: 200 },
  description: { required: false, maxLength: 2000 },
  industry: { required: false, maxLength: 100 },
  size: { required: true, min: 1, max: 100 },
  location: { required: false, maxLength: 200 }
};

export const createOpportunitySchema = {
  title: { required: true, minLength: 5, maxLength: 300 },
  description: { required: true, minLength: 50, maxLength: 5000 },
  industry: { required: false, maxLength: 100 },
  location: { required: false, maxLength: 200 },
  compensationMin: { required: false, min: 0 },
  compensationMax: { required: false, min: 0 }
};

// Constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const BCRYPT_ROUNDS = 12;

export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM_LEAD: 'team_lead',
  TEAM_MEMBER: 'team_member',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_RECRUITER: 'company_recruiter'
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

export const NOTIFICATION_TYPES = {
  TEAM_INVITE: 'team_invite',
  COMPANY_INTEREST: 'company_interest',
  MESSAGE: 'message',
  MATCH: 'match',
  APPLICATION_UPDATE: 'application_update'
} as const;