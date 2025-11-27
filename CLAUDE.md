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
│   ├── web-app/         # Next.js 14 App Router (app.liftout.com)
│   ├── api-server/      # Express.js API with Socket.IO
│   └── marketing-site/  # Astro marketing site
├── packages/
│   └── database/        # Prisma schema and client
```

### Web App (apps/web-app)

- **Framework**: Next.js 14 with App Router
- **Auth**: NextAuth.js + Firebase
- **State**: TanStack Query (React Query) + Zustand
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation

Key directories:
- `src/app/` - Next.js App Router pages
- `src/app/app/` - Authenticated dashboard routes (dashboard, teams, opportunities, etc.)
- `src/app/auth/` - Authentication pages (signin, signup)
- `src/app/api/` - API routes (auth, teams, opportunities, documents)
- `src/components/` - React components organized by feature
- `src/hooks/` - Custom hooks (useTeams, useOpportunities, useAuth, etc.)
- `src/lib/` - Utilities and services
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
- Schema location: `packages/database/prisma/schema.prisma`

Core entities: User, Team, TeamMember, Company, CompanyUser, Opportunity, TeamApplication, Conversation, Message

### User Types

The platform has two primary user types:
- **Individual/Team**: Users who create/manage teams looking for opportunities
- **Company**: Users who post opportunities and search for teams

## Key Patterns

### Authentication Flow

Uses NextAuth.js with credentials provider + Firebase for enhanced auth features. Session contains user type and company/team associations.

### API Routes

Web app API routes in `src/app/api/` follow Next.js App Router conventions. Use `@/lib/auth` for session validation.

### Role-Based Access

Use `useRoleAccess` hook to conditionally render based on user type. Team leads have additional permissions via `useTeamPermissions`.

### Real-time Messaging

Socket.IO connections handled by API server. Join/leave conversation rooms for real-time updates.

## Demo Credentials

```
Team User: demo@example.com / password
Company User: company@example.com / password
```

## Development Notes

- Port 3000: Web app (Next.js)
- Port 8000: API server (Express)
- Port 4321: Marketing site (Astro)
- Uses heroicons v2 (`@heroicons/react`) - prefer `*Icon` suffix components
