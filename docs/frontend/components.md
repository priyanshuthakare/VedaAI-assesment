# Frontend Component Library

The frontend is built using Next.js, React, and Tailwind CSS. It follows an atomic design pattern to ensure reusability and strict adherence to the Figma specifications.

## Core UI Components (`/src/components/ui`)

### `Button`
A reusable button component with various states (default, hover, loading, disabled). It utilizes a spinner animation during loading states and accepts standard button HTML attributes.

### `Input` & `Select`
Styled form controls with consistent padding, borders, and focus rings that match the Figma inputs. They are fully responsive and accessible.

### `FileUpload`
A drag-and-drop file upload zone used on the creation page. It handles file selection, size validation, and visual feedback for the user.

### `DatePicker`
A styled wrapper around the native HTML date input, ensuring cross-browser consistency in appearance.

## Layout Components (`/src/components/layout`)

### `Sidebar`
The main navigation menu. It handles active route highlighting, mobile collapsing, and includes the "Coming Soon" placeholders for unimplemented views.

### `DashboardLayout`
The master layout wrapper that combines the Sidebar and the main content area. It provides consistent padding, the top-right user profile header, and breadcrumb navigation.

### `CreateAssignmentDock`
A floating, pill-shaped action dock pinned to the bottom-center of the screen, providing quick access to the "Create Assignment" route from anywhere in the app.

## Feature Components

### `AssignmentCard`
Used on the Dashboard to display existing assignments. It includes a dropdown menu for "View" and "Delete" actions and formats dates dynamically.

### `QuestionCard`
Used on the Output page to render a single AI-generated question. It handles the display of the question text, allocated marks, and the colored visual Difficulty Badges (Easy, Moderate, Hard).
