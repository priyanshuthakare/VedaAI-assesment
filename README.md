# VedaAI — AI Assessment Creator

> **Full Stack Engineering Assignment** | Role: Full Stack Engineer

A production-ready AI-powered assessment generation platform that allows educators to dynamically create structured question papers using Google Gemini AI. The system processes generation in the background via a job queue and delivers real-time status updates to the client over WebSockets.

**Live Demo:** [veda-ai-assesment-drab.vercel.app](https://veda-ai-assesment-drab.vercel.app/)  
**Documentation:** [aethellabs.gitbook.io/vedaai](https://aethellabs.gitbook.io/vedaai/)  
**Backend API:** [vedaai-assesment.onrender.com](https://vedaai-assesment.onrender.com)

---

## Features

| Feature | Details |
|---|---|
| 🤖 AI Question Generation | Prompts Google Gemini with a strict JSON schema; never renders raw LLM output |
| ⏱ Async Job Queue | BullMQ + Upstash Redis keeps generation off the main thread |
| 🔌 Real-time Updates | Native WebSockets push progress events (`10%` → `30%` → `80%` → `100%`) to the UI |
| 📄 Server-side PDF Export | Headless Chrome (Puppeteer) generates a properly formatted A4 PDF |
| 🎙 Voice-to-Text | Web Speech API integration for dictating additional instructions |
| 📱 Fully Responsive | Dedicated mobile layouts, collapsible sidebar, bottom navigation |
| 🎨 Pixel-perfect UI | Strictly replicates the provided Figma design with Bricolage Grotesque + Inter typography |

---

## Approach

The system is designed with a **decoupled, asynchronous architecture** to ensure reliability and a seamless user experience during long-running AI operations.
- **Non-blocking API:** Heavy AI computations are offloaded to a background worker (BullMQ + Redis), ensuring the HTTP API remains fast and responsive.
- **Real-time Feedback:** Instead of long-polling, a native WebSocket connection pushes granular progress updates (`10%`, `30%`, `100%`) directly to the client.
- **Data Integrity:** Assignment inputs and AI-generated results are stored in separate MongoDB collections, allowing for safe regeneration without data loss.
- **Deterministic Output:** We strictly prompt Google Gemini to return a specific JSON schema, which is parsed and mapped directly to our internal React components, avoiding brittle raw-text parsing.
- **Server-Side PDF Rendering:** To guarantee layout consistency, PDFs are generated on the server using headless Chrome (Puppeteer) rather than relying on inconsistent browser-side `window.print()`.

---

## Architecture Overview

> See [docs/architecture.md](docs/architecture.md) for full system diagrams and request flows.

The platform is split into two independently deployed services:

1. **Frontend (Next.js App Router):** Manages the user interface, routing, and global state (Zustand). It communicates with the backend via REST for CRUD operations and establishes a WebSocket connection for real-time job status.
2. **Backend (Express + Node.js):** Handles API requests, WebSocket room management, and PDF generation.
3. **Background Worker (BullMQ):** A dedicated worker process that pulls jobs from Upstash Redis, communicates with the Google Gemini API, and emits progress events back to the WebSocket server.
4. **Database (MongoDB):** Provides persistent storage for assignment configurations and the final generated question papers.

---

## Tech Stack

### Frontend — `vedaai/frontend/`
| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 15.x | React framework, SSR, routing |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Zustand | 4.x | Lightweight global state management |
| Native WebSocket API | — | Real-time communication |

### Backend — `vedaai/backend/`
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | HTTP server & REST API |
| TypeScript | 6.x | Type safety |
| MongoDB + Mongoose | 9.x | Persistent data storage |
| Redis (Upstash) | — | Job queue backing store + caching |
| BullMQ | 5.x | Background job queue for AI generation |
| Google Generative AI SDK | 0.24.x | Gemini AI integration |
| Puppeteer | 25.x | Headless Chrome PDF generation |
| ws | 8.x | WebSocket server |

---

## Repository Structure

```
vedaai/
├── frontend/                 # Next.js App
│   ├── src/
│   │   ├── app/              # Pages (create, status, output, assignments)
│   │   ├── components/       # UI & layout components
│   │   ├── hooks/            # useWebSocket custom hook
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # API client (axios)
│   │   └── types/            # Shared TypeScript interfaces
│   └── next.config.ts
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # Redis, Database connection setup
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose schemas (Assignment, Result)
│   │   ├── routes/           # Express router
│   │   ├── services/
│   │   │   ├── ai/           # Gemini client + prompt generator
│   │   │   └── queue/        # BullMQ queue + worker
│   │   ├── types/            # Shared TypeScript interfaces
│   │   └── websocket/        # WebSocket server + room management
│   └── .puppeteerrc.cjs      # Puppeteer Chrome cache configuration
│
└── docs/                     # Full project documentation
```

---

## Getting Started

> See [docs/setup.md](docs/setup.md) for full instructions.

### Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/priyanshuthakare/VedaAI-assesment.git
cd VedaAI-assesment/vedaai

# 2. Backend
cd backend && cp .env.example .env   # fill in your values
npm install && npm run dev

# 3. Frontend (new terminal)
cd frontend && cp .env.example .env.local  # fill in your values
npm install && npm run dev
```

---

## Documentation

| File | Description |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Full system diagram and request flow |
| [docs/setup.md](docs/setup.md) | Copy-paste local setup guide |
| [docs/deployment.md](docs/deployment.md) | Render + Vercel cloud deployment |
| [docs/frontend/components.md](docs/frontend/components.md) | Every UI component documented |
| [docs/frontend/state-management.md](docs/frontend/state-management.md) | All Zustand stores |
| [docs/backend/api.md](docs/backend/api.md) | All REST endpoints with request/response shapes |
| [docs/backend/ai-service.md](docs/backend/ai-service.md) | Gemini integration, prompt design, worker flow |
| [docs/backend/database.md](docs/backend/database.md) | MongoDB schemas with field-level documentation |

---

## Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

---

*Built by Priyanshu Thakare for the VedaAI Full Stack Engineering Assessment.*
