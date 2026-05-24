# AI Service Integration (Google Gemini)

The backend utilizes the **Google Gemini API** (`gemini-2.5-flash` model) to generate the question papers.

## Prompt Engineering & Structured Output
To adhere to the requirement of *not rendering raw LLM responses*, the integration leverages Gemini's structured output capabilities.

We define a strict JSON schema using the Generative AI SDK's `Schema` object. The prompt includes the user's form inputs (Topic, Question Types, Constraints) and explicitly asks the model to return a structured JSON object containing:
- Document Title and Subject
- An array of `sections` (e.g., Section A, Section B).
- An array of `questions` within each section.
- Explicit attributes for each question: `text`, `type`, `difficulty` (easy/medium/hard), and `marks`.

## The Worker Flow (`src/services/queue/worker.ts`)
1. **BullMQ** pulls a job containing the assignment configuration from Upstash Redis.
2. The worker extracts the payload and builds the prompt.
3. The `generateQuestionPaper()` function calls the Gemini API.
4. Because we enforce `responseMimeType: "application/json"`, the API returns a stringified JSON object.
5. The worker parses the JSON, stores it in MongoDB as a `Result` document, and marks the BullMQ job as complete.
6. If the Gemini API fails or times out, the worker throws an error, marking the job as failed and triggering a failure notification over the WebSocket.
