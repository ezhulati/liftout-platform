// In-memory storage for opportunity alerts
// NOTE: OpportunityAlert model exists in database schema but web-app schema is out of sync
// TODO: Sync web-app/prisma/schema.prisma with packages/database/prisma/schema.prisma

export interface OpportunityAlert {
  id: string;
  userId: string;
  name: string;
  filters: Record<string, unknown>;
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  matchCount: number;
  lastSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const alertsStore = new Map<string, OpportunityAlert[]>();
