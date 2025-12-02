import { NextRequest, NextResponse } from 'next/server';
import { migrationRunner } from '@/scripts/migration-runner';
import { withAuth } from '@/lib/api-middleware';

export const dynamic = 'force-dynamic';

// GET /api/admin/migrations - Get migration status
export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // Only allow admin users (you might want to add an admin role check here)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await migrationRunner.getMigrationStatus();
    const migrations = await migrationRunner.listMigrations();
    
    return NextResponse.json({
      status,
      migrations,
    });
  } catch (error) {
    console.error('Error getting migration status:', error);
    return NextResponse.json(
      { error: 'Failed to get migration status' },
      { status: 500 }
    );
  }
});

// POST /api/admin/migrations - Run migrations
export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    // Only allow admin users (you might want to add an admin role check here)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, migrationId } = body;

    let result;

    switch (action) {
      case 'run-all':
        result = await migrationRunner.runAllPendingMigrations();
        break;
        
      case 'run-single':
        if (!migrationId) {
          return NextResponse.json(
            { error: 'Migration ID required for single migration' },
            { status: 400 }
          );
        }
        result = await migrationRunner.runMigration(migrationId);
        break;
        
      case 'rollback':
        if (!migrationId) {
          return NextResponse.json(
            { error: 'Migration ID required for rollback' },
            { status: 400 }
          );
        }
        result = await migrationRunner.rollbackMigration(migrationId);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: run-all, run-single, or rollback' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error running migration:', error);
    return NextResponse.json(
      { error: 'Failed to run migration' },
      { status: 500 }
    );
  }
});