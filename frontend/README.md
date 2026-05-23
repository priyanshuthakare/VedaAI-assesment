# VedaAI — AI-Powered Assessment Creator

A full-stack application that enables teachers to generate structured question papers using AI (Google Gemma via Gemini API). Features real-time generation progress via WebSocket, PDF export, and a pixel-perfect responsive UI.

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19** with TypeScript
- **Tailwind CSS v4** (CSS-based theme config)
- **Zustand** for state management
- **Axios** for HTTP, native WebSocket for real-time updates

### Backend
- **Express v5** with TypeScript
- **MongoDB** (Mongoose ODM)
- **Redis + BullMQ** for job queue
- **Google Gemini API** (Gemma 2 27B) for AI generation
- **Puppeteer** for PDF rendering
- **WebSocket (ws)** for real-time status

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Next.js   │  REST   │   Express    │  Queue  │  BullMQ    │
│  Frontend   │◄──────►│   Backend    │◄───────►│  Worker    │
│  :3000      │   WS    │   :4000      │         │  (Gemma)   │
└─────────────┘         └──────────────┘         └────────────┘
                               │                        │
                        ┌──────┴──────┐          ┌──────┴──────┐
                        │  MongoDB    │          │    Redis     │
                        └─────────────┘          └─────────────┘
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Empty state dashboard (no assignments) |
| `/assignments` | Filled state — list of created assignments |
| `/create` | Create assignment form with question type config |
| `/status/[id]` | Real-time generation progress (WebSocket) |
| `/output/[id]` | View generated question paper + PDF download |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API key

### Backend Setup

```bash
cd vedaai/backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd vedaai/frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (`vedaai/backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `CORS_ORIGIN` | Frontend origin (default: http://localhost:3000) |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `GEMINI_API_KEY` | Google Gemini API key |

#### Frontend (`vedaai/frontend/.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:4000/api) |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL (default: ws://localhost:4000) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/assignments` | List all assignments |
| POST | `/api/assignments` | Create assignment + enqueue generation |
| GET | `/api/assignments/:id` | Get assignment details |
| GET | `/api/assignments/:id/result` | Get generated question paper |
| POST | `/api/assignments/:id/regenerate` | Re-generate question paper |
| GET | `/api/assignments/:id/pdf` | Download as PDF |

## WebSocket Events

Connect to `ws://localhost:4000/ws?assignmentId=<id>`

| Event | Description |
|-------|-------------|
| `connected` | Initial ack |
| `job:queued` | Assignment is in queue |
| `job:processing` | AI is generating (includes `progress` %) |
| `job:completed` | Generation finished |
| `job:failed` | Generation error |

## Design System

- **Fonts**: Bricolage Grotesque (primary), Inter, Manrope
- **Colors**: #171717 (primary-dark), #2F2F2F (primary-text), #4BC16C (accent-green)
- **Responsive**: Desktop sidebar → Mobile bottom tab navigation
- **Layout**: 304px sidebar + top nav + content area

## Project Structure

```
vedaai/
├── backend/
│   └── src/
│       ├── config/        # DB + Redis config
│       ├── controllers/   # Route handlers
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── services/
│       │   ├── ai/        # Gemma prompt + parser
│       │   └── queue/     # BullMQ worker
│       ├── websocket/     # WS server + room management
│       └── types/         # Shared TypeScript interfaces
├── frontend/
│   └── src/
│       ├── app/           # Next.js pages (App Router)
│       ├── components/    # UI + Layout components
│       ├── hooks/         # WebSocket hook
│       ├── lib/           # Axios client, utils
│       ├── store/         # Zustand stores
│       └── types/         # Frontend types
└── design-specs/          # Figma design spec docs
```

