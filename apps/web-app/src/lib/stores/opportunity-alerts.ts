// In-memory storage for opportunity alerts
// TODO: Replace with proper database storage once OpportunityAlert model is in schema

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
