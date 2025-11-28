# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Liftout is a team-based hiring marketplace that connects companies seeking intact teams with teams looking to move together (a "liftout"). This is a pnpm monorepo managed by Turborepo.

## Common Commands

```bash
# Install dependencies (use pnpm, not npm)
pnpm install

# Start all apps in development mode
pnpm run dev

# Build all apps
pnpm run build

# Run linting
pnpm run lint

# Type check
pnpm run type-check

# Run tests
pnpm run test

# Format code
pnpm run format

# Database operations (from packages/database or root)
pnpm run db:generate    # Generate Prisma client
pnpm run db:push        # Push schema to database
pnpm run db:migrate     # Run migrations
pnpm run db:studio      # Open Prisma Studio
```

### App-specific commands

```bash
# Web app (Next.js)
cd apps/web-app
pnpm run dev            # Development server on port 3000
pnpm run test           # Jest unit tests
pnpm run test:e2e       # Playwright E2E tests
pnpm run migrate        # Run database migrations (tsx src/scripts/run-migrations.ts)

# API server (Express)
cd apps/api-server
pnpm run dev            # Development server on port 8000
pnpm run test           # Jest tests
```

## Architecture

### Monorepo Structure

```
liftout-platform/
├── apps/
│   ├── web-app/         # Next.js 14 App Router (deployed to Netlify)
│   ├── api-server/      # Express.js API with Socket.IO
│   └── marketing-site/  # Astro marketing site
├── packages/
│   └── database/        # Prisma schema, client, and seed scripts
```

### Web App (apps/web-app)

- **Framework**: Next.js 14 with App Router
- **Auth**: NextAuth.js with credentials provider (bcrypt password hashing)
- **State**: TanStack Query (React Query) + Zustand
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Netlify (serverless functions)

Key directories:
- `src/app/` - Next.js App Router pages
- `src/app/app/` - Authenticated dashboard routes (dashboard, teams, opportunities, etc.)
- `src/app/auth/` - Authentication pages (signin, signup)
- `src/app/api/` - API routes (auth, teams, opportunities, documents, seed)
- `src/components/` - React components organized by feature
- `src/hooks/` - Custom hooks (useTeams, useOpportunities, useAuth, etc.)
- `src/lib/` - Utilities and services
- `src/lib/auth.ts` - NextAuth configuration with Prisma user lookup
- `src/lib/services/` - Business logic services
- `src/types/` - TypeScript type definitions

### API Server (apps/api-server)

- **Framework**: Express.js with TypeScript
- **Realtime**: Socket.IO for messaging
- **Database**: Prisma client from packages/database

Key directories:
- `src/routes/` - API route handlers (auth, teams, companies, opportunities, etc.)
- `src/middleware/` - Express middleware (auth, error handling)

### Database (packages/database)

- **ORM**: Prisma with PostgreSQL
- **Local**: PostgreSQL on localhost:5432/liftout
- **Production**: Neon serverless PostgreSQL
- Schema location: `packages/database/prisma/schema.prisma`
- Seed script: `packages/database/src/seed.ts`
- Utilities: `packages/database/src/utils.ts` (hashPassword, verifyPassword, etc.)

Core entities: User, Team, TeamMember, Company, CompanyUser, Opportunity, TeamApplication, Conversation, Message, IndividualProfile, Skill, UserSkill

### User Types

The platform has two primary user types:
- **Individual/Team** (`userType: 'individual'`): Users who create/manage teams looking for opportunities
- **Company** (`userType: 'company'`): Users who post opportunities and search for teams

## Infrastructure & Deployment

### Production Environment

- **Hosting**: Netlify (web-app deployed as serverless functions)
- **Database**: Neon PostgreSQL (serverless, us-east-1)
- **Domain**: https://liftout.netlify.app

### Environment Variables (Netlify)

Required environment variables in Netlify dashboard:
```
DATABASE_URL=postgresql://...@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://liftout.netlify.app
NEXTAUTH_SECRET=<secure-secret>
JWT_SECRET=<jwt-secret>
```

Firebase variables (for future auth features):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Database Management

```bash
# Push schema to local database
cd packages/database
npx prisma db push

# Push schema to production (Neon)
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require" npx prisma db push

# Seed local database
npx tsx src/seed.ts

# Seed production database
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require" npx tsx src/seed.ts

# Open Prisma Studio (local)
npx prisma studio

# Open Prisma Studio (production)
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require" npx prisma studio
```

### Seed API Endpoint

Production database can also be seeded via API:
```bash
# POST to seed endpoint with secret
curl -X POST "https://liftout.netlify.app/api/seed?secret=liftout-seed-2024"
```

## Key Patterns

### Authentication Flow

1. User submits credentials to `/api/auth/[...nextauth]`
2. NextAuth credentials provider calls `authorize()` in `src/lib/auth.ts`
3. Prisma looks up user by email in PostgreSQL
4. bcrypt compares password against stored hash
5. On success, JWT token created with user data + access token
6. Session stored in cookie, accessible via `useSession()` hook

### Password Hashing

Uses bcryptjs with 12 rounds:
```typescript
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('password', 12);
const isValid = await bcrypt.compare('password', hash);
```

### API Routes

Web app API routes in `src/app/api/` follow Next.js App Router conventions:
- `route.ts` exports GET, POST, PUT, DELETE handlers
- Use `@/lib/auth` for session validation
- Prisma client imported from `@liftout/database`

### Role-Based Access

Use `useRoleAccess` hook to conditionally render based on user type. Team leads have additional permissions via `useTeamPermissions`.

### Real-time Messaging

Socket.IO connections handled by API server. Join/leave conversation rooms for real-time updates.

### UI Patterns

- **Navigation**: Hide-on-scroll-down, show-on-scroll-up header (LandingHeader, AppHeader)
- **Touch targets**: Minimum 48px height for interactive elements
- **Design tokens**: Custom Tailwind classes (bg-bg-surface, text-text-primary, etc.)
- **Icons**: heroicons v2 (`@heroicons/react`) - prefer `*Icon` suffix components

## Demo Credentials

```
Team User: demo@example.com / password
Company User: company@example.com / password
```

These are seeded by `packages/database/src/seed.ts` and work on both local and production.

## Development Notes

### Local Development

- Port 3000: Web app (Next.js) - may use 3001/3002 if 3000 is busy
- Port 8000: API server (Express)
- Port 4321: Marketing site (Astro)
- Port 5555: Prisma Studio

### Troubleshooting

**Login fails with "Invalid credentials":**
1. Check DATABASE_URL is set correctly
2. Run seed script: `npx tsx packages/database/src/seed.ts`
3. Verify user exists: `psql $DATABASE_URL -c "SELECT email FROM users;"`

**Netlify build fails:**
1. Check all env vars are set in Netlify dashboard
2. Ensure `@liftout/database` is transpiled in next.config.js
3. Check Prisma client is generated during build

**Database connection issues:**
1. For Neon: ensure `?sslmode=require` in connection string
2. For local: ensure PostgreSQL is running on port 5432

### Git Workflow

- Main branch: `main`
- Commits auto-deploy to Netlify
- Use conventional commits (feat:, fix:, chore:, etc.)
