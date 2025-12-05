# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Liftout is a team-based hiring marketplace that connects companies seeking intact teams with teams looking to move together (a "liftout"). This is a pnpm monorepo managed by Turborepo.

### What is a Liftout?

A **liftout** is hiring an entire high-performing team from another company—not just individuals who used to work together, but the whole team with their trust, chemistry, and track record intact.

**Key characteristics:**
- Team-based hiring (2+ people as a unit)
- Established relationships and proven collaboration
- Immediate productivity—skip the team formation phase
- Common in law, banking, consulting, tech, healthcare

**Value for companies:** Proven chemistry, day-one productivity, lower risk than M&A
**Value for teams:** Move together, strength in numbers, navigate change with people you trust

### Target Industries
Investment Banking, Law Firms, Consulting, Technology/AI, Healthcare, Private Equity

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

# Database operations
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

# API server (Express)
cd apps/api-server
pnpm run dev            # Development server on port 8000
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
- **Auth**: NextAuth.js with credentials provider (bcrypt)
- **State**: TanStack Query + Zustand
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod
- **Deployment**: Netlify (serverless)

Key directories:
- `src/app/` - Next.js App Router pages
- `src/app/app/` - Authenticated dashboard routes
- `src/app/auth/` - Authentication pages
- `src/app/api/` - API routes
- `src/components/` - React components by feature
- `src/components/landing/` - Landing page sections
- `src/hooks/` - Custom hooks
- `src/lib/` - Utilities and services

### Database (packages/database)

- **ORM**: Prisma with PostgreSQL
- **Local**: localhost:5432/liftout
- **Production**: Neon serverless PostgreSQL
- Schema: `packages/database/prisma/schema.prisma`

Core entities: User, Team, TeamMember, Company, Opportunity, TeamApplication, Conversation, Message

### User Types

- **Individual/Team** (`userType: 'individual'`): Create/manage teams looking for opportunities
- **Company** (`userType: 'company'`): Post opportunities and search for teams

## Infrastructure & Deployment

- **Hosting**: Netlify (web-app as serverless functions)
- **Database**: Neon PostgreSQL (serverless, us-east-1)
- **Domain**: https://liftout.com
- **Auto-deploy**: Commits to main deploy automatically

### Environment Variables (Netlify)

```
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://liftout.com
NEXTAUTH_SECRET=<secret>
JWT_SECRET=<secret>
```

### Database Management

```bash
# Push schema to production
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require" npx prisma db push

# Seed production
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require" npx tsx src/seed.ts

# Seed via API
curl -X POST "https://liftout.com/api/seed?secret=liftout-seed-2024"
```

## Demo Credentials

```
Team User: demo@example.com / password
Company User: company@example.com / password
```

## UI Patterns

- **Navigation**: Hide-on-scroll-down, show-on-scroll-up header
- **Touch targets**: Minimum 48px height
- **Design tokens**: Custom Tailwind (bg-bg-surface, text-text-primary, etc.)
- **Icons**: heroicons v2 (`@heroicons/react`)
- **Colors**: Deep purple (#4C1D95) + amber gold palette

## Development Notes

### Local Ports
- 3000: Web app (Next.js)
- 8000: API server (Express)
- 4321: Marketing site (Astro)
- 5555: Prisma Studio

### Troubleshooting

**Login fails with "Invalid credentials":**
1. Check DATABASE_URL is set
2. Run seed: `npx tsx packages/database/src/seed.ts`
3. Verify user: `psql $DATABASE_URL -c "SELECT email FROM users;"`

**Netlify build fails:**
1. Don't add `packageManager` to root package.json
2. Let Netlify auto-detect pnpm from lockfile
3. Ensure Prisma generates during build

**Netlify CLI + Node.js 25:**
Use git push to deploy instead of `netlify deploy` (CLI has compatibility issues with Node 25)

### Git Workflow
- Main branch: `main`
- Auto-deploy to Netlify on push
- Use conventional commits (feat:, fix:, chore:)
