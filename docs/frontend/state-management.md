# Frontend State Management (Zustand)

The application uses **Zustand** for global state management. There are three stores, each with a single responsibility.

---

## 1. `useAssignmentStore`
**File:** `frontend/src/store/assignmentStore.ts`

Manages the state of the assignment creation form — everything the user enters before clicking "Generate."

### State Shape
```typescript
interface AssignmentStore {
  formData: Partial<AssignmentInput>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

### Default Values
```typescript
{
  topic: "",
  totalQuestions: 10,
  marksPerQuestion: 2,
  questionTypes: [],
  difficulty: { easy: 40, medium: 40, hard: 20 },
  dueDate: "",
  instructions: "",
}
```

### Actions
| Action | Signature | Description |
|---|---|---|
| `setFormData` | `(data: Partial<AssignmentInput>) => void` | Merges partial data into the existing form state |
| `updateField` | `<K>(key: K, value: AssignmentInput[K]) => void` | Type-safe update of a single field |
| `setErrors` | `(errors: Record<string, string>) => void` | Stores field-level validation errors |
| `setSubmitting` | `(submitting: boolean) => void` | Toggles the loading state on the submit button |
| `reset` | `() => void` | Resets all form state back to defaults |

### Usage
```tsx
const { formData, updateField, setSubmitting } = useAssignmentStore();

// Read a value
const topic = formData.topic;

// Update a single field
updateField("topic", "World War II");

// Set submitting on API call
setSubmitting(true);
```

---

## 2. `useGenerationStore`
**File:** `frontend/src/store/generationStore.ts`

Manages the state of the in-flight AI generation job. It is the source of truth for the `/status/[id]` page and the `useWebSocket` hook.

### State Shape
```typescript
interface GenerationStore {
  status: "idle" | "queued" | "processing" | "completed" | "failed";
  progress: number;        // 0–100
  assignmentId: string | null;
  error: string | null;
}
```

### Actions
| Action | Signature | Description |
|---|---|---|
| `setStatus` | `(status: JobStatus | "idle") => void` | Updates the current job status |
| `setProgress` | `(progress: number) => void` | Updates the progress bar value (0–100) |
| `setAssignmentId` | `(id: string) => void` | Stores the ID of the active job |
| `setError` | `(error: string | null) => void` | Stores the failure error message |
| `reset` | `() => void` | Resets to idle state |

### How it connects to WebSocket

The `useWebSocket` hook calls `setStatus` and `setProgress` on every incoming WebSocket message, meaning the status page is entirely reactive — the UI updates automatically without any polling.

```
WebSocket event "job:processing" { progress: 80 }
                    │
                    ▼
        generationStore.setProgress(80)
        generationStore.setStatus("processing")
                    │
                    ▼
        ProgressBar re-renders at 80%
```

---

## 3. `useOutputStore`
**File:** `frontend/src/store/outputStore.ts`

Manages the fetched `QuestionPaper` data displayed on the output page.

### State Shape
```typescript
interface OutputStore {
  questionPaper: QuestionPaper | null;
  isLoading: boolean;
  error: string | null;
}
```

### Actions
| Action | Description |
|---|---|
| `setQuestionPaper` | Stores the fetched AI-generated paper |
| `setLoading` | Toggles the loading skeleton |
| `setError` | Stores any fetch error message |
| `reset` | Clears all output state |

---

## `useWebSocket` Hook
**File:** `frontend/src/hooks/useWebSocket.ts`

A custom React hook that manages the full lifecycle of a WebSocket connection.

### Features
- **Auto-URL Resolution:** If `NEXT_PUBLIC_WS_URL` is not set, it constructs the WebSocket URL from the API URL or `window.location`, ensuring it works in all environments.
- **Exponential Backoff Reconnection:** On unexpected disconnects, it reconnects with delays of 1s, 2s, 4s, 8s... up to a max of 30s.
- **Cleanup:** The connection is closed when the component that calls the hook unmounts.

### Usage
```tsx
// On the /status/[id] page
const { ws } = useWebSocket(assignmentId);

// The hook automatically updates generationStore on every message received
// — no additional wiring needed.
```
