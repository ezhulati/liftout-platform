# Netlify Environment Variables Setup

Set these environment variables in the Netlify dashboard:
**Site Settings > Environment Variables**

## Required Variables:

```
NEXTAUTH_URL=https://liftout.netlify.app
NEXTAUTH_SECRET=secure-production-secret-key-for-liftout-platform-2024
AUTH_TRUST_HOST=true
NEXT_PUBLIC_API_URL=https://liftout.netlify.app/api
NODE_ENV=production
```

## Instructions:

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings > Environment Variables**
3. Add each variable above using the "Add environment variable" button
4. Set the key/value pairs exactly as shown
5. Deploy the site again

This will fix the "Configuration" error and prevent redirect loops.