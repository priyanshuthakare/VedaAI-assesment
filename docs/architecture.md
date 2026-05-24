# Architecture

## Overview

The VedaAI system is split into two independently deployed services that communicate over REST and WebSocket protocols. Heavy AI computation is offloaded to a background worker, meaning the HTTP API never blocks waiting for Gemini.

---

## System Diagram

```
                           ┌────────────────────────────────────────────────┐
                           │             FRONTEND  (Vercel)                 │
                           │              Next.js App Router                │
                           │                                                │
                           │  ┌─────────────┐     ┌──────────────────────┐ │
                           │  │  Zustand    │     │   useWebSocket hook  │ │
                           │  │  Stores     │     │   (Native WS client) │ │
                           │  └──────┬──────┘     └──────────┬───────────┘ │
                           └─────────┼───────────────────────┼─────────────┘
                                     │  REST (Axios)         │  WebSocket
                                     ▼                       ▼
                     ┌───────────────────────────────────────────────────────┐
                     │                  BACKEND  (Render)                    │
                     │                                                       │
                     │  ┌────────────┐  ┌─────────────┐  ┌───────────────┐  │
                     │  │  Express   │  │  WebSocket  │  │  PDF Engine  │  │
                     │  │  REST API  │  │  Server     │  │  (Puppeteer) │  │
                     │  └─────┬──────┘  └──────┬──────┘  └───────────────┘  │
                     │        │                │                             │
                     │        ▼                │                             │
                     │  ┌──────────────────────┴──────────────────────────┐  │
                     │  │              BullMQ Worker                       │  │
                     │  │  (concurrency: 2, queue: assignment-generation)  │  │
                     │  └──────────────────┬────────────────────────────┬─┘  │
                     └─────────────────────┼────────────────────────────┼────┘
                                           │                            │
                    ┌──────────────────────▼──────┐   ┌────────────────▼────────┐
                    │    Upstash Redis             │   │   Google Gemini API     │
                    │    - BullMQ Job Queue        │   │   Model: gemma-4-26b    │
                    │    - General caching         │   │   JSON Schema Output    │
                    └─────────────────────────────┘   └─────────────────────────┘
                                           │
                    ┌──────────────────────▼──────┐
                    │    MongoDB Atlas             │
                    │    - Assignment collection   │
                    │    - Result collection       │
                    └─────────────────────────────┘
```

---

## Request Flow — Creating an Assignment

```
1. User fills form → clicks "Generate Question Paper"
      │
      ▼
2. Frontend POSTs to POST /api/assignments
   Payload: { topic, questionTypes, difficulty, dueDate, instructions }
      │
      ▼
3. createAssignment controller:
   a. Saves Assignment doc to MongoDB (status: "queued")
   b. Adds job to BullMQ queue with { assignmentId, input }
   c. Responds immediately with { assignmentId }   ← no blocking!
      │
      ▼
4. Frontend navigates to /status/:assignmentId
   Establishes WebSocket connection:
   ws://backend/ws?assignmentId=<id>
      │
      ▼
5. BullMQ Worker picks up the job (concurrency: 2):
   a. Updates Assignment.status = "processing"
   b. Emits job:processing { progress: 10 } → WebSocket room
   c. Calls generateQuestionPaper(input) via Gemini API
   d. Emits job:processing { progress: 30 } → WebSocket room
   e. Gemini returns structured JSON (QuestionPaper)
   f. Emits job:processing { progress: 80 } → WebSocket room
   g. Creates Result document in MongoDB
   h. Updates Assignment.status = "completed", Assignment.resultId
   i. Emits job:completed { resultId } → WebSocket room
      │
      ▼
6. Frontend receives job:completed event
   Redirects to /output/:assignmentId
      │
      ▼
7. Output page fetches GET /api/assignments/:id/result
   Renders the QuestionPaper as a structured React component
   (Sections → Questions → Difficulty Badges)
```

---

## PDF Generation Flow

```
User clicks "Download PDF"
      │
      ▼
Frontend calls GET /api/assignments/:id/pdf
      │
      ▼
generatePdf controller:
  a. Fetches Result + Assignment from MongoDB
  b. Calls buildPdfHtml() → Injects data into HTML template
  c. puppeteer.launch() → Headless Chrome
  d. page.setContent(html)
  e. page.pdf({ format: "A4", ... }) → Binary Buffer
  f. res.setHeader("Content-Type", "application/pdf")
  g. res.send(pdfBuffer)
      │
      ▼
Browser downloads the PDF file
```

---

## Key Design Decisions

| Decision | Reasoning |
|---|---|
| **BullMQ over direct API calls** | Gemini generation takes 5–15s. Synchronous calls would timeout HTTP connections. |
| **Separate Assignment + Result collections** | Keeps input config independent from AI output. Allows regeneration without data loss. |
| **Upstash REST vs TLS Redis** | BullMQ requires binary ioredis protocol; Upstash REST API is incompatible. We use REST for caching and TLS endpoint for BullMQ. |
| **Server-side PDF (Puppeteer)** | `window.print()` produces inconsistent layouts. Server-side rendering gives pixel-perfect, styled PDFs. |
| **Zustand over Redux** | The app's state needs are minimal. Zustand provides the same predictability with 80% less boilerplate. |
