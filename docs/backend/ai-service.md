# AI Service — Google Gemini Integration

## Model Configuration

**File:** `backend/src/services/ai/client.ts`

The Gemini client is initialized once at startup and reused across all worker jobs:

```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generativeModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemma-4-26b-a4b-it",
  generationConfig: {
    temperature: 0.7,  // Balanced creativity
    topP: 0.9,         // Nucleus sampling
    maxOutputTokens: 8192,
  },
});
```

The model can be overridden via the `GEMINI_MODEL` environment variable without code changes.

---

## Prompt Engineering

**File:** `backend/src/services/ai/generator.ts`

The prompt is dynamically constructed from the `AssignmentInput` object. It instructs the model to:

1. Generate exactly the number of questions per type requested.
2. Distribute difficulty according to the percentages provided (e.g., 40% easy, 40% medium, 20% hard).
3. Group questions into labeled sections (Section A, Section B, etc.) by question type.
4. Return **only** a valid JSON object matching the `QuestionPaper` schema — no markdown, no commentary.

### Why Structured Output?
The prompt enforces `responseMimeType: "application/json"` and includes the full JSON schema in the system prompt. This prevents the model from wrapping output in markdown code fences or adding conversational text, which would break the JSON parser.

---

## The Worker Flow

**File:** `backend/src/services/queue/worker.ts`

The BullMQ worker processes the `assignment-generation` queue with `concurrency: 2`, meaning up to two assignments can be generated simultaneously.

### Step-by-step execution:

```
Job received { assignmentId, input }
      │
      ▼
1. Assignment.findByIdAndUpdate(id, { status: "processing" })
2. emitToRoom(id, { event: "job:processing", progress: 10 })
      │
      ▼
3. emitToRoom(id, { event: "job:processing", progress: 30 })
4. questionPaper = await generateQuestionPaper(input)
   └─ Calls Gemini API → returns structured JSON
      │
      ▼
5. emitToRoom(id, { event: "job:processing", progress: 80 })
6. result = await Result.create({ assignmentId, questionPaper })
7. Assignment.findByIdAndUpdate(id, { status: "completed", resultId })
8. emitToRoom(id, { event: "job:completed", resultId })
      │
      ▼ (on error)
9. Assignment.findByIdAndUpdate(id, { status: "failed", error })
10. emitToRoom(id, { event: "job:failed", error })
    throw error  ← BullMQ marks job as failed, enables retry policy
```

---

## Data Types

The `QuestionPaper` TypeScript interface is the contract between the AI output and the frontend renderer:

```typescript
interface QuestionPaper {
  title: string;       // e.g., "Photosynthesis Assessment"
  subject: string;     // e.g., "Biology"
  totalMarks: number;
  duration: string;    // e.g., "60 minutes"
  sections: Section[];
}

interface Section {
  id: string;          // e.g., "A"
  label: string;       // e.g., "Section A"
  instruction: string; // e.g., "Attempt all questions."
  questions: Question[];
}

interface Question {
  id: string;
  number: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  type: "mcq" | "short" | "long" | "truefalse";
  options?: string[];  // Only for MCQ
  answer?: string;     // Included in the PDF answer key
}
```
