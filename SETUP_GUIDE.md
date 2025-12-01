# Liftout Platform - Production Setup Guide

This guide covers setting up all production services for the Liftout platform.

## Quick Start Checklist

- [ ] **Sentry** - Error tracking (code ready, needs DSN)
- [ ] **Google OAuth** - Social login
- [ ] **LinkedIn OAuth** - Social login
- [ ] **Redis** - Caching & real-time scaling
- [ ] **Environment Variables** - Configure in Netlify

---

## 1. Sentry Error Tracking

Sentry is fully integrated. Just add your DSN.

### Setup Steps:

1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new project → Select "Next.js"
3. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)
4. Add to Netlify environment variables:

```
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=liftout-web
```

### What's Already Configured:
- `sentry.client.config.ts` - Client-side error capture
- `sentry.server.config.ts` - Server-side error capture
- `sentry.edge.config.ts` - Edge runtime error capture
- `src/instrumentation.ts` - Next.js instrumentation
- `src/app/global-error.tsx` - Global error boundary
- `src/lib/monitoring.ts` - Custom error capture utilities
- `next.config.js` - Sentry webpack plugin (conditional)

### Features Enabled:
- Automatic error capture
- Performance monitoring (10% sample rate)
- Session replay on errors
- Source map upload (in CI)
- Ad-blocker circumvention via `/monitoring` tunnel

---

## 2. Google OAuth

### Setup Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   ```
   https://liftout.netlify.app/api/auth/callback/google
   https://liftout.com/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google (for dev)
   ```
7. Copy Client ID and Client Secret
8. Add to Netlify environment variables:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Enable Required APIs:
- Google+ API (for profile info)
- People API (optional, for additional profile data)

---

## 3. LinkedIn OAuth

### Setup Steps:

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add products: **Sign In with LinkedIn using OpenID Connect**
4. Go to **Auth** tab
5. Add OAuth 2.0 redirect URLs:
   ```
   https://liftout.netlify.app/api/auth/callback/linkedin
   https://liftout.com/api/auth/callback/linkedin
   http://localhost:3000/api/auth/callback/linkedin (for dev)
   ```
6. Copy Client ID and Client Secret
7. Add to Netlify environment variables:

```
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### Required Scopes (auto-configured):
- `r_liteprofile` - Basic profile info
- `r_emailaddress` - Email address

---

## 4. Redis (Upstash)

Redis enables real-time Socket.IO scaling and caching.

### Setup Steps:

1. Go to [Upstash](https://upstash.com) and create a free account
2. Create a new Redis database
   - Region: Select closest to your users (e.g., us-east-1)
   - Type: Regional (free tier) or Global (paid)
3. Copy the Redis URL from the dashboard
4. Add to Netlify environment variables:

```
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

### What Redis Enables:
- Socket.IO horizontal scaling (multiple server instances)
- API response caching (future)
- Session storage (future)
- Rate limiting persistence (future)

### Current Integration:
The API server (`apps/api-server/src/index.ts`) already supports Redis:
```typescript
// Line 68-100: Redis adapter setup
const setupRedisAdapter = async () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    logger.info('No REDIS_URL provided, using in-memory adapter');
    return;
  }
  // ... connects and enables horizontal scaling
};
```

---

## 5. Complete Environment Variables

### Netlify Dashboard Configuration

Go to **Site settings** → **Environment variables** and add:

#### Required (Core)
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_URL=https://liftout.netlify.app
NEXTAUTH_SECRET=<generate-secure-random-string>
JWT_SECRET=<generate-secure-random-string>
```

#### Sentry (Error Tracking)
```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=liftout-web
SENTRY_AUTH_TOKEN=<from-sentry-settings>
```

#### OAuth Providers
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
```

#### Redis (Real-time & Caching)
```
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

#### Optional (Future)
```
# Stripe Payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (SendGrid/Resend)
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@liftout.com

# Zoom Integration
ZOOM_CLIENT_ID=xxx
ZOOM_CLIENT_SECRET=xxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxx
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxx
```

---

## 6. Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 7. Verification

After configuring, verify everything works:

### Test OAuth
1. Go to https://liftout.netlify.app/auth/signin
2. You should see Google and LinkedIn buttons
3. Test each provider login flow

### Test Sentry
1. Trigger a test error in development:
   ```typescript
   throw new Error('Test Sentry integration');
   ```
2. Check Sentry dashboard for the error

### Test Redis
1. Check API server logs for:
   ```
   Socket.IO Redis adapter connected - horizontal scaling enabled
   ```
2. Or if not configured:
   ```
   No REDIS_URL provided, using in-memory adapter (single instance mode)
   ```

---

## 8. Local Development

Create `.env.local` in `apps/web-app/`:

```bash
# Database
DATABASE_URL=postgresql://liftout:liftout123@localhost:5432/liftout

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
JWT_SECRET=dev-jwt-secret-change-in-production

# OAuth (optional for local dev)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Redis (use docker-compose)
REDIS_URL=redis://localhost:6379

# Sentry (optional for local dev)
# SENTRY_DSN=
# NEXT_PUBLIC_SENTRY_DSN=
```

Start local services:
```bash
# Start PostgreSQL, Redis, Elasticsearch
docker-compose up -d

# Start web app
pnpm run dev
```

---

## Support

- **Sentry Issues**: Check [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- **OAuth Issues**: Verify redirect URIs match exactly
- **Redis Issues**: Check Upstash dashboard for connection logs
- **General**: Open an issue in the repository
