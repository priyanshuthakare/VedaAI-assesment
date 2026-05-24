# Cloud Deployment Guide

The app is deployed across two platforms optimized for each service's needs.

| Service | Platform | URL |
|---|---|---|
| Frontend (Next.js) | Vercel | veda-ai-assesment-drab.vercel.app |
| Backend (Express + Workers) | Render | vedaai-assesment.onrender.com |

---

## Backend — Render

### Service Configuration
| Setting | Value |
|---|---|
| **Service Type** | Web Service |
| **Runtime** | Node.js |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Root Directory** | `vedaai/backend` (or `backend/` depending on repo layout) |

### How the Build Works
The `package.json` `postinstall` script automatically runs after `npm install`:
```json
"postinstall": "npm run build"
"build": "tsc && npx puppeteer browsers install chrome"
```
This means a single `npm install` on Render will:
1. Install all `node_modules`
2. Compile TypeScript → `dist/`
3. Download the Headless Chrome binary to `.cache/puppeteer/`

The `.puppeteerrc.cjs` config file pins the Chrome cache to the project directory:
```js
const { join } = require("path");
module.exports = { cacheDirectory: join(__dirname, ".cache", "puppeteer") };
```

### Required Environment Variables

Set these in the Render dashboard under **Environment → Environment Variables**:

```env
# Server
NODE_ENV=production
PORT=4000

# CORS — set to your Vercel frontend URL
ALLOWED_ORIGINS=https://veda-ai-assesment-drab.vercel.app

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/vedaai?retryWrites=true&w=majority

# Upstash Redis REST API (for general caching)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Upstash Redis TLS endpoint (for BullMQ — MUST use rediss:// protocol)
REDIS_TLS_URL=rediss://default:<password>@xxx.upstash.io:6379

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: override AI model
# GEMINI_MODEL=gemini-2.5-flash
```

> ⚠️ **Important:** BullMQ requires the binary `ioredis` protocol. It cannot use the Upstash REST API. Always use the `rediss://` TLS endpoint for `REDIS_TLS_URL`.

---

## Frontend — Vercel

### Service Configuration
| Setting | Value |
|---|---|
| **Framework Preset** | Next.js |
| **Build Command** | `next build` (default) |
| **Root Directory** | `vedaai/frontend` (or `frontend/`) |
| **Node.js Version** | 18.x or higher |

### Required Environment Variables

Set these in the Vercel dashboard under **Project Settings → Environment Variables**:

```env
# The full URL of your Render backend (no trailing slash)
NEXT_PUBLIC_API_URL=https://vedaai-assesment.onrender.com/api

# The WebSocket URL of your Render backend (wss:// for HTTPS backends)
NEXT_PUBLIC_WS_URL=wss://vedaai-assesment.onrender.com
```

### Image Optimization Note
The `next.config.ts` includes `images: { unoptimized: true }`. This is necessary because the VedaAI logo is stored as `logo11.avif` — Vercel's image optimizer returned `400 Bad Request` when processing `.avif` source files. Setting `unoptimized: true` serves images directly from `/public`, bypassing the optimizer.

---

## Deployment Checklist

### Before First Deploy
- [ ] MongoDB Atlas cluster created and connection string available
- [ ] Upstash Redis database created — copy both REST URL/Token AND TLS URL
- [ ] Google Gemini API key generated
- [ ] GitHub repository pushed with all latest changes

### Backend (Render)
- [ ] Render Web Service created, pointed at the repo
- [ ] Root directory set to the backend folder
- [ ] All 7 environment variables set
- [ ] First deploy completed — confirm Chrome download in build logs
- [ ] Test: `GET https://your-backend.onrender.com/health` returns `{ status: "ok" }`

### Frontend (Vercel)
- [ ] Vercel project created, pointed at the repo
- [ ] Root directory set to the frontend folder
- [ ] `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` set to the Render URL
- [ ] First deploy completed
- [ ] Update Render's `ALLOWED_ORIGINS` to include the Vercel URL

### End-to-End Test
- [ ] Open the Vercel URL
- [ ] Create a new assignment and click Generate
- [ ] Verify the status page shows real-time progress
- [ ] Verify the output page renders the question paper
- [ ] Verify PDF download works
