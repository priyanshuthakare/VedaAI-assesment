# Local Setup Guide

## Prerequisites

Ensure the following are installed and available:

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | v18.0.0 | `node --version` |
| npm | v9.0.0 | `npm --version` |
| Git | any | `git --version` |

You also need:
- A **MongoDB** connection URI (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Redis** instance (local or [Upstash](https://upstash.com))
- A **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

---

## 1. Clone the Repository

```bash
git clone https://github.com/priyanshuthakare/VedaAI-assesment.git
cd VedaAI-assesment/vedaai
```

---

## 2. Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# ── Server ────────────────────────────────────────────────────
NODE_ENV=development
PORT=4000

# ── CORS ──────────────────────────────────────────────────────
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000

# ── MongoDB ───────────────────────────────────────────────────
# Local:   mongodb://localhost:27017/vedaai
# Atlas:   mongodb+srv://<user>:<pass>@cluster.mongodb.net/vedaai
MONGODB_URI=mongodb://localhost:27017/vedaai

# ── Redis ─────────────────────────────────────────────────────
# Local:   redis://localhost:6379
# Upstash: Use UPSTASH_REDIS_REST_URL + TOKEN instead (see deployment.md)
REDIS_URL=redis://localhost:6379

# ── AI Integration ────────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ── Optional: Override the Gemini model ───────────────────────
# GEMINI_MODEL=gemini-2.5-flash
```

### Run the Development Server
```bash
npm run dev
```

The backend will start on **http://localhost:4000**. You should see:
```
✅ Connected to MongoDB
✅ Redis connected
✅ BullMQ worker started
🚀 Server running on port 4000
```

---

## 3. Frontend Setup

Open a **new terminal** and navigate to the `frontend/` directory:

### Install Dependencies
```bash
cd frontend
npm install
```

### Configure Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```env
# Points to the running backend API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Points to the backend WebSocket server
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

### Run the Development Server
```bash
npm run dev
```

The frontend will be available at **http://localhost:3000**.

---

## Available Scripts

### Backend (`backend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start server with hot-reload (ts-node-dev) |
| `npm run build` | Compile TypeScript to `dist/` + install Chrome |
| `npm start` | Run the compiled production build |

### Frontend (`frontend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server (port 3000) |
| `npm run build` | Create optimized production build |
| `npm start` | Serve the production build |

---

## Verifying the Setup

1. Open **http://localhost:3000/assignments** — you should see the empty state with "No assignments yet."
2. Click **"+ Create Your First Assignment"** and fill in the form.
3. Click **"Generate Question Paper"** — you should be redirected to the status page.
4. Watch the progress bar fill up in real time via WebSocket.
5. On completion, you are redirected to the output page.
6. Click **"Download PDF"** — a formatted PDF should download.
