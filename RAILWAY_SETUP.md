# Railway Deployment Configuration

## 1. API Server (@liftout/api-server)

### Settings Tab
- **Root Directory:** (leave empty - build from root)
- **Build Command:** `pnpm install && cd packages/database && npx prisma generate && cd ../.. && pnpm --filter @liftout/api-server build`
- **Start Command:** `node apps/api-server/dist/index.js`

### Variables Tab (copy each line)
```
DATABASE_URL=postgresql://neondb_owner:npg_zqGw62WYsoxZ@ep-misty-scene-a4bvtfjr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=liftout-dev-jwt-secret-key-2024
NODE_ENV=production
PORT=8000
LOG_LEVEL=info
```

**Note:** After deploying, get the API server URL and add:
```
ALLOWED_ORIGINS=https://liftout.com,https://<your-web-app>.up.railway.app
```

---

## 2. Web App (@liftout/web-app)

### Settings Tab
- **Root Directory:** (leave empty - build from root)
- **Build Command:** `pnpm install && cd packages/database && npx prisma generate && cd ../.. && pnpm --filter @liftout/web-app build`
- **Start Command:** `pnpm --filter @liftout/web-app start`

### Variables Tab
```
DATABASE_URL=postgresql://neondb_owner:npg_zqGw62WYsoxZ@ep-misty-scene-a4bvtfjr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=liftout-production-secret-2024
NEXTAUTH_URL=https://<your-web-app>.up.railway.app
JWT_SECRET=liftout-dev-jwt-secret-key-2024
```

**Note:** After api-server deploys, add:
```
NEXT_PUBLIC_API_URL=https://<your-api-server>.up.railway.app
```

---

## 3. Optional: Add Redis
1. Click "+ Create" → "Database" → "Redis"
2. Copy the REDIS_URL from the Redis service
3. Add it to api-server variables

---

## Deployment Order
1. Configure api-server settings + variables
2. Configure web-app settings + variables
3. Click "Deploy" button
4. Once deployed, update ALLOWED_ORIGINS and NEXT_PUBLIC_API_URL with actual URLs
5. Redeploy
