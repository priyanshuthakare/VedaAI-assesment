# Frontend State Management (Zustand)

The frontend uses **Zustand** for global state management. Zustand was chosen over Redux because it provides a lightweight, hook-based API without the massive boilerplate, which is ideal for this application's scope.

## Stores

### 1. `useAssignmentStore`
Manages the state of the Assignment Creation form (the input phase).
- **File:** `src/store/assignmentStore.ts`
- **State:** Tracks the `topic`, `instructions`, `dueDate`, `difficulty` configuration, and the `isSubmitting` boolean flag.
- **Actions:** Includes methods like `updateField()` to dynamically update form values and `setSubmitting()` to handle UI loading states during the API POST request.

### 2. `useGenerationStore`
Manages the state of the active AI Generation job (the waiting/processing phase).
- **File:** `src/store/generationStore.ts`
- **State:** Tracks the active `assignmentId` and the current `status` of the background job (`idle`, `queued`, `processing`, `completed`, `failed`).
- **Actions:** `setAssignmentId()` and `setStatus()`.
- **Usage:** This store is heavily utilized by the `/status/[id]/page.tsx` view and the `useWebSocket` hook to determine when to show the loading spinner and when to redirect the user to the final output page.
