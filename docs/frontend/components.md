# Frontend Component Library

All UI components live under `frontend/src/components/`. They are split into two categories: atomic **UI** components, and **Layout** components that compose the page structure.

---

## UI Components (`src/components/ui/`)

### `Button`
The primary action component. Supports loading, disabled, and hover states.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | `() => void` | — | Click handler |
| `isLoading` | `boolean` | `false` | Replaces content with a spinner |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `className` | `string` | — | Additional Tailwind overrides |
| `children` | `ReactNode` | — | Button label / content |

---

### `Input`
A styled text input with consistent focus ring, padding, and placeholder styling to match the Figma design.

**Props:** Extends all standard `HTMLInputElement` attributes (`value`, `onChange`, `placeholder`, `type`, etc.)

---

### `Select`
A styled dropdown selector. Used in the question type rows on the creation form.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Currently selected value |
| `onChange` | `ChangeEventHandler` | Change callback |
| `options` | `{ value: string; label: string }[]` | Dropdown options |
| `className` | `string` | Tailwind overrides |

---

### `DatePicker`
A styled wrapper around the native `<input type="date">`. Ensures cross-browser consistency.

**Props:** `value`, `onChange`, `placeholder` — same interface as `Input`.

---

### `FileUpload`
A drag-and-drop file upload zone. Used on the assignment creation form for uploading reference documents.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `onFileSelect` | `(file: File) => void` | Called when the user selects a file |
| `accept` | `string` | Accepted MIME types, e.g. `"image/jpeg,application/pdf"` |
| `maxSizeMB` | `number` | Maximum file size in megabytes |

---

### `Badge`
A small colored tag used on the Output page to visually indicate question difficulty.

**Color mapping:**
- `easy` → Green (`#4BC16C`)
- `medium` → Orange (`#F59E0B`)
- `hard` → Red (`#E23D3D`)

---

### `Spinner`
A rotating loading indicator used inside `Button` and on the status page.

---

### `ProgressBar`
A horizontal progress bar used on the `/status/[id]` page. Width is driven by the `progress` value (0–100) from the Zustand `generationStore`.

---

### `Card`
A generic white container with a rounded `24px` border-radius and subtle box shadow. Used as a wrapper on the output page sections.

---

### `Toast`
A transient notification component for success/error feedback.

---

## Layout Components (`src/components/layout/`)

### `DashboardLayout`
The root layout wrapper used by every page inside the authenticated section. It renders:
- The `Sidebar` on desktop
- The `MobileBottomNav` on mobile
- The `TopNavBar` with breadcrumb, notifications, and user avatar
- The main scrollable content area

**Props:**
| Prop | Type | Description |
|---|---|---|
| `breadcrumb` | `string` | Text shown in the top nav (e.g., `"Assignment"`) |
| `children` | `ReactNode` | Page content |

---

### `Sidebar`
The left navigation panel, visible on desktop only (`md:` breakpoint and above). It contains:
- The VedaAI logo
- The **"+ Create Assignment"** pill button
- Navigation links: Home, My Groups, Assignments, AI Teacher's Toolkit, My Library
- Settings link at the bottom
- School/institution info card

**Active State Logic:**
- `Home` is only highlighted when the pathname is exactly `/`.
- `Assignments` is highlighted when the pathname starts with `/assignments`, `/create`, `/status`, or `/output`.
- All other links show "Coming Soon" states.

---

### `TopNavBar`
The horizontal bar at the top of the content area. It contains the breadcrumb, notification bell, and user avatar with dropdown.

---

### `MobileBottomNav`
A fixed bottom navigation bar visible only on mobile devices. Provides quick access to the core navigation routes.

---

### `CreateAssignmentDock`
A floating pill-shaped button pinned to the bottom center of the page on the assignments list view. It provides persistent access to the creation flow without cluttering the UI.

> **Note:** This component is conditionally hidden when the assignment list is empty to avoid duplicating the CTA with the empty state's "Create Your First Assignment" button.

---

### `EmptyStateIllustration`
The centered illustration + text + CTA button displayed when the database has no assignments. It renders:
- The `noassignment.png` illustration
- A "No assignments yet" heading
- A descriptive paragraph
- A `Link` to `/create` styled as a black pill button
