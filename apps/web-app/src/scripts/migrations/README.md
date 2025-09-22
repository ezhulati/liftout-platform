# Database Migrations

This directory contains database migration scripts for the Liftout platform. Migrations are used to safely update the database schema and data structure as the application evolves.

## Migration System

The migration system provides:
- ✅ **Sequential execution** - Migrations run in order
- ✅ **Rollback support** - Ability to undo migrations
- ✅ **Tracking** - Record of which migrations have been applied
- ✅ **Error handling** - Graceful failure and reporting
- ✅ **CLI interface** - Command-line tools for developers
- ✅ **API interface** - Admin API for production deployments

## Available Migrations

### 001 - Add User Types
**File:** `001-add-user-types.ts`
**Purpose:** Adds the `type` field to existing users, categorizing them as either `individual` or `company`.

**What it does:**
- Scans all existing users in the database
- Determines appropriate user type based on existing data (company name, position, etc.)
- Defaults to `individual` type for users without company indicators
- Updates the `updatedAt` timestamp

**Rollback:** Removes the `type` field from all users

## Usage

### Command Line Interface

```bash
# Show migration status
npm run migrate status

# Run all pending migrations
npm run migrate run

# Run a specific migration
npm run migrate run 001

# Rollback a migration
npm run migrate rollback 001

# List all available migrations
npm run migrate list
```

### API Interface

For production deployments, use the admin API:

```bash
# Get migration status
GET /api/admin/migrations

# Run all pending migrations
POST /api/admin/migrations
{
  "action": "run-all"
}

# Run specific migration
POST /api/admin/migrations
{
  "action": "run-single",
  "migrationId": "001"
}

# Rollback migration
POST /api/admin/migrations
{
  "action": "rollback",
  "migrationId": "001"
}
```

## Migration Development

### Creating a New Migration

1. **Create the migration file:**
   ```typescript
   // src/scripts/migrations/XXX-migration-name.ts
   import { Timestamp } from 'firebase/firestore';
   import { db } from '@/lib/firebase';

   export async function migrationXXXMigrationName(): Promise<MigrationResult> {
     // Migration logic here
   }

   export async function rollbackXXXMigrationName(): Promise<MigrationResult> {
     // Rollback logic here
   }
   ```

2. **Add to migration runner:**
   ```typescript
   // src/scripts/migration-runner.ts
   import { migrationXXXMigrationName, rollbackXXXMigrationName } from './migrations/XXX-migration-name';

   export const MIGRATIONS: Migration[] = [
     // ... existing migrations
     {
       id: 'XXX',
       name: 'Migration Name',
       description: 'Description of what this migration does',
       run: migrationXXXMigrationName,
       rollback: rollbackXXXMigrationName,
     },
   ];
   ```

### Migration Best Practices

1. **Always include rollback logic** - Every migration should be reversible
2. **Test thoroughly** - Test both migration and rollback on sample data
3. **Use transactions** - Wrap database operations in transactions when possible
4. **Handle errors gracefully** - Provide detailed error messages
5. **Document changes** - Include clear descriptions and comments
6. **Backup first** - Always backup production data before running migrations

### Migration Structure

Each migration should return a `MigrationResult`:

```typescript
interface MigrationResult {
  success: boolean;
  message: string;
  details: {
    totalUsers?: number;
    updatedUsers?: number;
    errors: string[];
  };
}
```

### Error Handling

- Individual record errors are collected but don't stop the migration
- Fatal errors (connection issues, permission problems) stop the migration
- All errors are logged and returned in the result
- Failed migrations are not marked as applied

## Production Deployment

### Pre-deployment Checklist

1. ✅ **Backup database** - Always backup before running migrations
2. ✅ **Test on staging** - Run migrations on staging environment first
3. ✅ **Review migration code** - Code review for all migration changes
4. ✅ **Check dependencies** - Ensure all required packages are available
5. ✅ **Plan rollback** - Have rollback plan ready if needed

### Deployment Process

1. **Deploy application code** (without running migrations)
2. **Run migrations via API** or CLI
3. **Verify results** - Check migration status and logs
4. **Monitor application** - Watch for issues after migration
5. **Rollback if needed** - Use rollback commands if problems occur

### Monitoring

Monitor migrations through:
- Application logs
- Migration API responses  
- Database query performance
- Application error rates

## Troubleshooting

### Common Issues

**Migration fails with "Authentication required"**
- Check Firebase configuration
- Verify environment variables
- Ensure proper permissions

**Migration partially completes**
- Check individual error messages
- Re-run migration (it will skip already-processed records)
- Consider manual data fixes for failed records

**Rollback needed**
- Use rollback command immediately
- Check rollback result for completeness
- Manual cleanup may be needed for complex cases

### Getting Help

1. Check migration logs for specific errors
2. Verify database connectivity and permissions
3. Review migration code for logic issues
4. Test on development environment first
5. Contact development team for complex issues

## History

- **001** - Initial user type categorization (Phase 1.1.5)

---

*For technical questions about the migration system, see the development team or check the main project documentation.*