import bcrypt from 'bcryptjs';

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Pagination utilities
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

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// URL utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const BCRYPT_ROUNDS = 12;
