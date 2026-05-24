# Cloud Deployment Guide

The application is deployed across two platforms to optimize for cost, performance, and scaling: **Vercel** for the Next.js Frontend, and **Render** for the Express Backend.

## Backend Deployment (Render)

The backend is deployed as a Web Service on Render, leveraging a native Node.js environment.

1. **Service Type:** Web Service
2. **Build Command:** `npm install`
   - *Note:* The `package.json` contains a `postinstall` script (`npm run build`). This automatically compiles the TypeScript files (`tsc`) and runs `npx puppeteer browsers install chrome` to ensure the Headless Chrome binary is downloaded into the cache directory configured in `.puppeteerrc.cjs`.
3. **Start Command:** `npm start`
4. **Environment Variables:**
   - `NODE_ENV=production`
   - `MONGODB_URI`: Connection string to MongoDB Atlas.
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: For general-purpose Redis caching via Upstash.
   - `REDIS_TLS_URL`: A dedicated `rediss://` endpoint required by BullMQ for background worker communication.
   - `GEMINI_API_KEY`: API key for Google Gemini.
   - `ALLOWED_ORIGINS`: Set to the Vercel URL to secure CORS policy.

## Frontend Deployment (Vercel)

The frontend is deployed to Vercel for edge caching and fast global delivery.

1. **Framework Preset:** Next.js
2. **Build Command:** (Default) `next build`
   - *Note:* The `next.config.ts` includes `images: { unoptimized: true }` to bypass Next.js image optimization for the `.avif` logo file, preventing 400 Bad Request errors on Vercel.
3. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Points to the Render backend URL (e.g., `https://vedaai-api.onrender.com/api`).
   - `NEXT_PUBLIC_WS_URL`: Points to the Render backend WebSocket URL (e.g., `wss://vedaai-api.onrender.com`).
