# Multi-stage build for the api-server
# This Dockerfile builds from the monorepo root

FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy packages directory (for shared dependencies)
COPY packages ./packages

# Copy the api-server app
COPY apps/api-server ./apps/api-server

# Install all dependencies from root
RUN pnpm install --frozen-lockfile

# Build api-server
WORKDIR /app/apps/api-server
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g pnpm@9

WORKDIR /app

# Copy package files for production install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/api-server/package.json ./apps/api-server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder
COPY --from=builder /app/apps/api-server/dist ./apps/api-server/dist
COPY --from=builder /app/apps/api-server/prisma ./apps/api-server/prisma

# Generate Prisma client
WORKDIR /app/apps/api-server
RUN npx prisma generate

EXPOSE 8000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["node", "dist/index.js"]
