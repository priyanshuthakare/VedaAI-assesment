# Architecture

## System Diagram
```text
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Frontend   │◄────────►│   Backend    │◄────────►│  Databases  │
│  Vercel     │  REST    │   Render     │         │  MongoDB    │
│  Next.js    │          │   Express    │         │  Redis      │
└─────────────┘          └──────────────┘         └─────────────┘
                               │
                               ├─► Gemini API
                               ├─► BullMQ Jobs
                               └─► WebSocket
```

## Flow
1. User creates assignment form and submits via frontend.
2. Frontend `POST` → Backend API (`/api/assignments`).
3. Backend validates input, saves a "Pending" record to MongoDB, and queues a job in **BullMQ**.
4. The Backend responds immediately with the Assignment ID to prevent HTTP timeouts.
5. The BullMQ Worker picks up the job and processes it via the **Gemini AI API**.
6. The structured result is parsed, validated, and stored in **MongoDB**.
7. The Backend emits a `generation_completed` event via **WebSocket**.
8. The Frontend receives the event, redirects the user, and renders the structured Question Paper (with an option to generate a PDF).
