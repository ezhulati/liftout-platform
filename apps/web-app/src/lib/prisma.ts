import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Lazy initialization to avoid errors during build
function createPrismaClient() {
  // During build time, don't instantiate if DATABASE_URL contains 'placeholder'
  if (process.env.DATABASE_URL?.includes('placeholder')) {
    return null as unknown as PrismaClient;
  }
  return new PrismaClient();
}

export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalThis.prisma = prisma;
}

export default prisma;
