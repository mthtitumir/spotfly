# Deployment Guide

## Deploy to Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Manual Deploy

1. **Push to GitHub/GitLab/Bitbucket**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     AMADEUS_API_KEY=your_key
     AMADEUS_API_SECRET=your_secret
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Environment Variables

Required variables:

```env
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
```

Optional:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api/v1
```

---

## Deploy to Netlify

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build**

   ```bash
   pnpm build
   ```

3. **Deploy**

   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add Amadeus credentials

---

## Deploy to Railway

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login & Init**

   ```bash
   railway login
   railway init
   ```

3. **Add Environment Variables**

   ```bash
   railway variables set AMADEUS_API_KEY=your_key
   railway variables set AMADEUS_API_SECRET=your_secret
   ```

4. **Deploy**
   ```bash
   railway up
   ```

---

## Self-Hosted (Docker)

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.ts

```typescript
const nextConfig = {
  output: "standalone",
};
```

### Build & Run

```bash
docker build -t spotfly .
docker run -p 3000:3000 \
  -e AMADEUS_API_KEY=your_key \
  -e AMADEUS_API_SECRET=your_secret \
  spotfly
```

---

## Production Checklist

Before deploying:

- [ ] Test with production Amadeus API (not test)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure analytics (Google Analytics, Plausible)
- [ ] Add rate limiting
- [ ] Set up CDN for static assets
- [ ] Enable compression
- [ ] Configure security headers
- [ ] Add CSP (Content Security Policy)
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy

---

## Environment-Specific Config

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Staging

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://staging.spotfly.app
```

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://spotfly.app
```

---

## Performance Tips

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Caching Strategy

- API routes: Cache for 5 minutes
- Static assets: Cache indefinitely
- Flight data: Cache for 5 minutes
- Location data: Cache for 1 hour

---

## Monitoring

### Recommended Tools

1. **Vercel Analytics** - Built-in performance monitoring
2. **Sentry** - Error tracking
3. **LogRocket** - Session replay
4. **Plausible** - Privacy-friendly analytics
5. **Uptime Robot** - Uptime monitoring

### Key Metrics to Track

- Page load time
- API response time
- Error rate
- User engagement
- Search conversion rate
- Filter usage
- Mobile vs desktop traffic

---

## Troubleshooting

### Build Errors

**"Module not found"**

```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

**TypeScript errors**

- Check all imports are correct
- Verify all types are exported
- Run `pnpm tsc --noEmit`

### Runtime Errors

**API not working**

- Verify environment variables are set
- Check Amadeus API status
- Review API route logs

**Slow performance**

- Enable caching in production
- Check network requests
- Optimize images
- Enable compression

---

## Support

If you encounter deployment issues:

1. Check Vercel/Netlify logs
2. Verify environment variables
3. Test locally with `pnpm build && pnpm start`
4. Review Next.js deployment docs

---

**Recommended**: Deploy to Vercel for best Next.js experience with zero configuration! 🚀
