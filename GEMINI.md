# Gemini Code Understanding

This document provides a comprehensive overview of the Liftout platform's codebase, intended to be used as a context for AI-powered development assistance.

## Project Overview

Liftout is a team-based hiring marketplace that connects companies with teams looking for new opportunities. The project is a monorepo built with pnpm and contains three main applications: a web app, a marketing site, and an API server.

- **Web App (`apps/web-app`):** A Next.js 14 application that serves as the main platform for users to interact with the marketplace. It uses Next-Auth for authentication, TanStack React Query for data fetching, and Tailwind CSS for styling.

- **API Server (`apps/api-server`):** An Express.js server that provides the backend services for the platform. It uses Prisma as an ORM to interact with a PostgreSQL database, Bull for background jobs, and Stripe for payments.

- **Marketing Site (`apps/marketing-site`):** An Astro 5 website for marketing and promotional content.

## Building and Running

The project uses `turbo` to manage the monorepo scripts. The following commands are available in the root `package.json`:

- `pnpm install`: Install dependencies for all packages.
- `pnpm dev`: Start all applications in development mode.
- `pnpm build`: Build all applications for production.
- `pnpm test`: Run tests for all packages.
- `pnpm lint`: Lint all packages.

### Running the Web App

The web app is a Next.js application located in `apps/web-app`. To run it in development mode, use the following command:

```bash
pnpm dev --filter=@liftout/web-app
```

This will start the web app on `http://localhost:3000`.

### Running the API Server

The API server is an Express.js application located in `apps/api-server`. To run it in development mode, use the following command:

```bash
pnpm dev --filter=@liftout/api-server
```

This will start the API server on `http://localhost:8000`.

## Development Conventions

- **Code Style:** The project uses Prettier for code formatting and ESLint for linting.
- **Testing:** The project uses Jest for unit testing and Playwright for end-to-end testing.
- **Database:** The project uses Prisma to manage the database schema and migrations. The schema is located in `packages/database/prisma/schema.prisma`.
- **Authentication:** The web app uses Next-Auth for authentication, with the configuration located in `apps/web-app/src/pages/api/auth/[...nextauth].ts`.
- **State Management:** The web app uses a combination of TanStack React Query for server state and Zustand for client state.

## Key Files

- `pnpm-workspace.yaml`: Defines the monorepo structure.
- `turbo.json`: Configures the `turbo` command.
- `package.json`: Contains the scripts and dependencies for the entire project.
- `apps/web-app/next.config.js`: The Next.js configuration for the web app.
- `apps/web-app/package.json`: The dependencies for the web app.
- `apps/api-server/src/index.ts`: The entry point for the API server.
- `apps/api-server/package.json`: The dependencies for the API server.
- `packages/database/prisma/schema.prisma`: The Prisma schema for the database.
