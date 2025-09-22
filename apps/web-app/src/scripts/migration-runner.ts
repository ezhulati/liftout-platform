import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Import migration functions
import { 
  migration001AddUserTypes, 
  rollback001AddUserTypes 
} from './migrations/001-add-user-types';

export interface Migration {
  id: string;
  name: string;
  description: string;
  run: () => Promise<MigrationResult>;
  rollback: () => Promise<MigrationResult>;
}

export interface MigrationResult {
  success: boolean;
  message: string;
  details: {
    totalUsers?: number;
    updatedUsers?: number;
    errors: string[];
  };
}

export interface MigrationRecord {
  id: string;
  name: string;
  runAt: Timestamp;
  success: boolean;
  details: any;
}

// Define all available migrations
export const MIGRATIONS: Migration[] = [
  {
    id: '001',
    name: 'Add User Types',
    description: 'Add type field to existing users (individual/company)',
    run: migration001AddUserTypes,
    rollback: rollback001AddUserTypes,
  },
];

export class MigrationRunner {
  private migrationsCollection = 'migrations';

  async getAppliedMigrations(): Promise<string[]> {
    try {
      const migrationDoc = await getDoc(doc(db, this.migrationsCollection, 'applied'));
      if (migrationDoc.exists()) {
        return migrationDoc.data().migrationIds || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting applied migrations:', error);
      return [];
    }
  }

  async markMigrationAsApplied(migrationId: string, result: MigrationResult): Promise<void> {
    try {
      const appliedDoc = doc(db, this.migrationsCollection, 'applied');
      const appliedSnapshot = await getDoc(appliedDoc);
      
      let migrationIds: string[] = [];
      if (appliedSnapshot.exists()) {
        migrationIds = appliedSnapshot.data().migrationIds || [];
      }

      if (!migrationIds.includes(migrationId)) {
        migrationIds.push(migrationId);
      }

      await setDoc(appliedDoc, {
        migrationIds,
        lastUpdated: Timestamp.now(),
      });

      // Store detailed migration record
      const migrationRecord: MigrationRecord = {
        id: migrationId,
        name: MIGRATIONS.find(m => m.id === migrationId)?.name || 'Unknown',
        runAt: Timestamp.now(),
        success: result.success,
        details: result.details,
      };

      await setDoc(doc(db, this.migrationsCollection, migrationId), migrationRecord);
      
    } catch (error) {
      console.error('Error marking migration as applied:', error);
      throw error;
    }
  }

  async markMigrationAsRolledBack(migrationId: string): Promise<void> {
    try {
      const appliedDoc = doc(db, this.migrationsCollection, 'applied');
      const appliedSnapshot = await getDoc(appliedDoc);
      
      if (appliedSnapshot.exists()) {
        const migrationIds: string[] = appliedSnapshot.data().migrationIds || [];
        const updatedIds = migrationIds.filter(id => id !== migrationId);
        
        await updateDoc(appliedDoc, {
          migrationIds: updatedIds,
          lastUpdated: Timestamp.now(),
        });
      }

      // Update migration record
      const migrationDocRef = doc(db, this.migrationsCollection, migrationId);
      const migrationDoc = await getDoc(migrationDocRef);
      
      if (migrationDoc.exists()) {
        await updateDoc(migrationDocRef, {
          rolledBackAt: Timestamp.now(),
        });
      }

    } catch (error) {
      console.error('Error marking migration as rolled back:', error);
      throw error;
    }
  }

  async runMigration(migrationId: string): Promise<MigrationResult> {
    const migration = MIGRATIONS.find(m => m.id === migrationId);
    if (!migration) {
      return {
        success: false,
        message: `Migration ${migrationId} not found`,
        details: { errors: ['Migration not found'] },
      };
    }

    console.log(`Running migration ${migrationId}: ${migration.name}`);
    
    try {
      const result = await migration.run();
      
      if (result.success) {
        await this.markMigrationAsApplied(migrationId, result);
        console.log(`Migration ${migrationId} completed successfully`);
      } else {
        console.error(`Migration ${migrationId} failed:`, result.message);
      }
      
      return result;
    } catch (error) {
      const errorResult: MigrationResult = {
        success: false,
        message: `Migration ${migrationId} failed: ${error}`,
        details: { errors: [String(error)] },
      };
      
      console.error(`Migration ${migrationId} failed:`, error);
      return errorResult;
    }
  }

  async rollbackMigration(migrationId: string): Promise<MigrationResult> {
    const migration = MIGRATIONS.find(m => m.id === migrationId);
    if (!migration) {
      return {
        success: false,
        message: `Migration ${migrationId} not found`,
        details: { errors: ['Migration not found'] },
      };
    }

    console.log(`Rolling back migration ${migrationId}: ${migration.name}`);
    
    try {
      const result = await migration.rollback();
      
      if (result.success) {
        await this.markMigrationAsRolledBack(migrationId);
        console.log(`Migration ${migrationId} rolled back successfully`);
      } else {
        console.error(`Migration ${migrationId} rollback failed:`, result.message);
      }
      
      return result;
    } catch (error) {
      const errorResult: MigrationResult = {
        success: false,
        message: `Migration ${migrationId} rollback failed: ${error}`,
        details: { errors: [String(error)] },
      };
      
      console.error(`Migration ${migrationId} rollback failed:`, error);
      return errorResult;
    }
  }

  async runAllPendingMigrations(): Promise<MigrationResult[]> {
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = MIGRATIONS.filter(m => !appliedMigrations.includes(m.id));
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    const results: MigrationResult[] = [];
    
    for (const migration of pendingMigrations) {
      const result = await this.runMigration(migration.id);
      results.push(result);
      
      // Stop if a migration fails
      if (!result.success) {
        console.error(`Stopping migration process due to failure in ${migration.id}`);
        break;
      }
    }
    
    return results;
  }

  async getMigrationStatus(): Promise<{
    total: number;
    applied: number;
    pending: string[];
    appliedMigrations: string[];
  }> {
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = MIGRATIONS.filter(m => !appliedMigrations.includes(m.id));
    
    return {
      total: MIGRATIONS.length,
      applied: appliedMigrations.length,
      pending: pendingMigrations.map(m => `${m.id}: ${m.name}`),
      appliedMigrations,
    };
  }

  async listMigrations(): Promise<Array<Migration & { applied: boolean }>> {
    const appliedMigrations = await this.getAppliedMigrations();
    
    return MIGRATIONS.map(migration => ({
      ...migration,
      applied: appliedMigrations.includes(migration.id),
    }));
  }
}

// Singleton instance
export const migrationRunner = new MigrationRunner();