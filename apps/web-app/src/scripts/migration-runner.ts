// Migration runner stub
// Database migrations are handled via Prisma migrate

interface MigrationStatus {
  total: number;
  pending: string[];
  applied: number;
  failed: number;
  appliedMigrations: string[];
}

interface MigrationInfo {
  id: string;
  name: string;
  description: string;
  applied: boolean;
  appliedAt?: Date;
}

interface MigrationResult {
  success: boolean;
  message: string;
  details: {
    totalUsers?: number;
    updatedUsers?: number;
    errors: string[];
  };
}

export const migrationRunner = {
  async getMigrationStatus(): Promise<MigrationStatus> {
    return {
      total: 0,
      pending: [],
      applied: 0,
      failed: 0,
      appliedMigrations: [],
    };
  },

  async listMigrations(): Promise<MigrationInfo[]> {
    return [];
  },

  async runAllPendingMigrations(): Promise<MigrationResult[]> {
    return [{
      success: true,
      message: 'Migrations are handled via Prisma. Use `pnpm run db:migrate` instead.',
      details: { errors: [] },
    }];
  },

  async runMigration(migrationId: string): Promise<MigrationResult> {
    return {
      success: false,
      message: 'Migrations are handled via Prisma. Use `pnpm run db:migrate` instead.',
      details: { errors: [] },
    };
  },

  async rollbackMigration(migrationId: string): Promise<MigrationResult> {
    return {
      success: false,
      message: 'Migrations are handled via Prisma. Manual rollback required.',
      details: { errors: [] },
    };
  },
};
