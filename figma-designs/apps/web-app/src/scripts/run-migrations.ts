#!/usr/bin/env node

/**
 * Migration CLI Tool
 * 
 * Usage:
 *   npm run migrate status              - Show migration status
 *   npm run migrate run                 - Run all pending migrations
 *   npm run migrate run <id>            - Run specific migration
 *   npm run migrate rollback <id>       - Rollback specific migration
 *   npm run migrate list                - List all migrations
 */

import { migrationRunner } from './migration-runner';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const migrationId = args[1];

  if (!command) {
    console.log('Usage: npm run migrate <command> [migration-id]');
    console.log('Commands:');
    console.log('  status              - Show migration status');
    console.log('  run                 - Run all pending migrations');
    console.log('  run <id>            - Run specific migration');
    console.log('  rollback <id>       - Rollback specific migration');
    console.log('  list                - List all migrations');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'status':
        await showStatus();
        break;
        
      case 'run':
        if (migrationId) {
          await runSingleMigration(migrationId);
        } else {
          await runAllMigrations();
        }
        break;
        
      case 'rollback':
        if (!migrationId) {
          console.error('Migration ID required for rollback');
          process.exit(1);
        }
        await rollbackMigration(migrationId);
        break;
        
      case 'list':
        await listMigrations();
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration tool error:', error);
    process.exit(1);
  }
}

async function showStatus() {
  console.log('Migration Status:');
  console.log('================');
  
  const status = await migrationRunner.getMigrationStatus();
  
  console.log(`Total migrations: ${status.total}`);
  console.log(`Applied: ${status.applied}`);
  console.log(`Pending: ${status.pending.length}`);
  
  if (status.pending.length > 0) {
    console.log('\nPending migrations:');
    status.pending.forEach(migration => {
      console.log(`  - ${migration}`);
    });
  }
  
  if (status.appliedMigrations.length > 0) {
    console.log('\nApplied migrations:');
    status.appliedMigrations.forEach(id => {
      console.log(`  - ${id}`);
    });
  }
}

async function runAllMigrations() {
  console.log('Running all pending migrations...');
  console.log('=================================');
  
  const results = await migrationRunner.runAllPendingMigrations();
  
  if (results.length === 0) {
    console.log('No pending migrations to run.');
    return;
  }
  
  results.forEach((result, index) => {
    console.log(`\nMigration ${index + 1}:`);
    console.log(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Message: ${result.message}`);
    
    if (result.details.errors.length > 0) {
      console.log('Errors:');
      result.details.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
  });
  
  const allSuccessful = results.every(r => r.success);
  console.log(`\nOverall result: ${allSuccessful ? 'SUCCESS' : 'FAILED'}`);
}

async function runSingleMigration(migrationId: string) {
  console.log(`Running migration ${migrationId}...`);
  console.log('='.repeat(30 + migrationId.length));
  
  const result = await migrationRunner.runMigration(migrationId);
  
  console.log(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Message: ${result.message}`);
  
  if (result.details.totalUsers !== undefined) {
    console.log(`Total users processed: ${result.details.totalUsers}`);
  }
  
  if (result.details.updatedUsers !== undefined) {
    console.log(`Updated users: ${result.details.updatedUsers}`);
  }
  
  if (result.details.errors.length > 0) {
    console.log('Errors:');
    result.details.errors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }
}

async function rollbackMigration(migrationId: string) {
  console.log(`Rolling back migration ${migrationId}...`);
  console.log('='.repeat(35 + migrationId.length));
  
  const result = await migrationRunner.rollbackMigration(migrationId);
  
  console.log(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Message: ${result.message}`);
  
  if (result.details.totalUsers !== undefined) {
    console.log(`Total users processed: ${result.details.totalUsers}`);
  }
  
  if (result.details.updatedUsers !== undefined) {
    console.log(`Updated users: ${result.details.updatedUsers}`);
  }
  
  if (result.details.errors.length > 0) {
    console.log('Errors:');
    result.details.errors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }
}

async function listMigrations() {
  console.log('Available Migrations:');
  console.log('====================');
  
  const migrations = await migrationRunner.listMigrations();
  
  migrations.forEach(migration => {
    const status = migration.applied ? '[APPLIED]' : '[PENDING]';
    console.log(`${migration.id}: ${migration.name} ${status}`);
    console.log(`    ${migration.description}`);
    console.log('');
  });
}

// Run the CLI
if (require.main === module) {
  main();
}