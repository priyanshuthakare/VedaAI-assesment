# Backend API Reference

All endpoints are prefixed with `/api`. Responses follow the format `{ data }` on success or `{ error: string }` on failure.

---

## Assignments

### `GET /api/assignments`
Returns a list of all assignments, sorted by creation date (newest first).

**Response `200`:**
```json
{
  "assignments": [
    {
      "_id": "664f3a...",
      "input": {
        "topic": "World War II",
        "totalQuestions": 10,
        "marksPerQuestion": 5,
        "questionTypes": [
          { "type": "mcq", "count": 5, "marksEach": 2 },
          { "type": "short", "count": 5, "marksEach": 8 }
        ],
        "difficulty": { "easy": 40, "medium": 40, "hard": 20 },
        "dueDate": "25-06-2025",
        "instructions": "Focus on European theater."
      },
      "status": "completed",
      "resultId": "664f3b...",
      "createdAt": "2025-05-24T14:30:00.000Z"
    }
  ]
}
```

---

### `POST /api/assignments`
Creates a new assignment record, queues the AI generation job, and immediately returns the `assignmentId`.

**Request Body:**
```json
{
  "topic": "Photosynthesis",
  "totalQuestions": 10,
  "marksPerQuestion": 2,
  "questionTypes": [
    { "type": "mcq", "count": 5, "marksEach": 2 },
    { "type": "short", "count": 3, "marksEach": 4 },
    { "type": "long", "count": 2, "marksEach": 8 }
  ],
  "difficulty": { "easy": 40, "medium": 40, "hard": 20 },
  "dueDate": "25-06-2025",
  "instructions": "Include diagram-based questions."
}
```

**Response `201`:**
```json
{
  "message": "Assignment created",
  "assignmentId": "664f3a..."
}
```

> The job is now in the BullMQ queue. Connect to the WebSocket to receive real-time updates.

---

### `GET /api/assignments/:id`
Fetches a single assignment's metadata and current status.

**Response `200`:**
```json
{
  "_id": "664f3a...",
  "status": "processing",
  "input": { ... },
  "createdAt": "2025-05-24T14:30:00.000Z"
}
```

**Status values:** `queued` | `processing` | `completed` | `failed`

---

### `GET /api/assignments/:id/result`
Returns the full generated `QuestionPaper` once the job is complete. If still processing, `questionPaper` is `null`.

**Response `200`:**
```json
{
  "status": "completed",
  "questionPaper": {
    "title": "Photosynthesis Assessment",
    "subject": "Biology",
    "totalMarks": 50,
    "duration": "60 minutes",
    "sections": [
      {
        "id": "A",
        "label": "Section A",
        "instruction": "Attempt all questions. Each question carries 2 marks.",
        "questions": [
          {
            "id": "q1",
            "number": 1,
            "text": "Which organelle is responsible for photosynthesis?",
            "difficulty": "easy",
            "marks": 2,
            "type": "mcq",
            "options": ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
            "answer": "Chloroplast"
          }
        ]
      }
    ]
  }
}
```

---

### `DELETE /api/assignments/:id`
Permanently removes the assignment and its associated result from MongoDB.

**Response `200`:**
```json
{ "message": "Deleted successfully" }
```

---

### `POST /api/assignments/:id/regenerate`
Queues a fresh AI generation job for an existing assignment (uses the same original `input`). This overwrites the previous result.

**Response `200`:**
```json
{ "message": "Regeneration queued" }
```

---

### `GET /api/assignments/:id/pdf`
Triggers the Puppeteer engine to render and return a formatted PDF. The response is a binary PDF stream.

**Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="assignment_<id>.pdf"
```

---

## WebSocket Protocol

Connect to: `ws://backend-host/ws?assignmentId=<id>`

Once connected, the server emits the following events as JSON messages:

| Event | Payload | Description |
|---|---|---|
| `connected` | `{ event, assignmentId }` | Confirms the room subscription |
| `job:queued` | `{ event, assignmentId }` | Job is in the queue |
| `job:processing` | `{ event, assignmentId, progress: 10|30|80 }` | Worker is actively processing |
| `job:completed` | `{ event, assignmentId, resultId }` | Generation finished |
| `job:failed` | `{ event, assignmentId, error }` | Generation failed |

The client disconnects after receiving `job:completed` or `job:failed`, with exponential backoff reconnection on unexpected drops.
