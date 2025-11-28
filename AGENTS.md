# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed with pnpm workspaces and Turbo (`apps/*`, `packages/*`). Run commands from repo root unless noted.
- `apps/web-app`: Next.js frontend with Tailwind; assets live in `apps/web-app/public`.
- `apps/api-server`: Express/TypeScript API; consumes shared database and email packages.
- `packages/database`: Prisma schema and client; migrations live in `packages/database/prisma`.
- `packages/email`: React Email templates for transactional mail.

## Build, Test, and Development Commands
- Install deps: `pnpm install`. Use `pnpm dev` / `pnpm build` / `pnpm test` / `pnpm lint` to run Turbo across workspaces.
- Targeted runs: `pnpm --filter @liftout/web-app dev` (Next dev server), `pnpm --filter @liftout/api-server dev` (API on :8000).
- Database: `pnpm db:generate`, `pnpm db:push`, `pnpm db:migrate`, `pnpm db:studio` fan out to Prisma in the active package.
- Docker helpers: `pnpm docker:build`, `pnpm docker:up`, `pnpm docker:down` to manage services via `docker-compose.yml`.

## Coding Style & Naming Conventions
- TypeScript-first. Prefer 2-space indentation; avoid unused exports; keep modules focused.
- Formatting via Prettier; linting via ESLint (Next config in `apps/web-app`, custom config in API). Run `pnpm lint` or workspace `lint:fix`.
- Components and React hooks: `PascalCase` files/components, `useCamelCase` hooks. Functions/vars use `camelCase`; constants `SCREAMING_SNAKE_CASE`. Env vars live in `.env*` files and stay out of commits.

## Testing Guidelines
- Web app: Jest for unit tests (`apps/web-app/jest.config.js`) and Playwright for e2e (`apps/web-app/e2e`, `pnpm --filter @liftout/web-app test:e2e`). Keep tests colocated near code or under `__tests__`.
- API: Jest + Supertest for routes (`apps/api-server/jest.config.js`); use `test:coverage` before merging service changes.
- Database: run Prisma migrations before tests that touch data. Seed via `pnpm --filter @liftout/database db:seed` when fixtures are needed.

## Commit & Pull Request Guidelines
- Follow existing history: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, etc. Keep subjects imperative and under ~72 chars.
- PRs should include a concise summary, linked issue/Asana ticket, and a test plan (commands run). Add screenshots/recordings for UI updates and note any schema changes or migrations.
- Keep changes scoped; prefer separate PRs for frontend, API, and database concerns when practical.
