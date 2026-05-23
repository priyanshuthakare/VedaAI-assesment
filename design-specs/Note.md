# Note

## Overview

- **Screen name**: Note
- **Node ID**: `2:9859`
- **Dimensions**: 727.0px × 243.0px
- **Screenshot**:

![Note screenshot](https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7feb275d-0ae6-436b-9b67-51888d7627a8)

- **Description**: Small informational note card — appears as a tooltip or inline hint indicating 'Created Assignments will appear here'. Used as a contextual helper in the empty/zero state.

## Layout

- **Frame dimensions**: 727.0px × 243.0px
- **Layout type**: Free / Absolute
- **Constraints**: horizontal=LEFT, vertical=TOP
- **Background**: none

## Color Tokens

| Token Name | Hex | Usage |
|---|---|---|
| `color-ffffff` | `#FFFFFF` | Rectangle 12 fill |
| `color-000000d8` | `#000000D8` | Created Assignments will appear here fill |

## Typography

| Element | Font Family | Weight | Size | Line Height | Letter Spacing | Color | Sample Text |
|---|---|---|---|---|---|---|---|
| Created Assignments will appear here | Manrope | 600 | 40.0px | 56.0px | -1.2px | `#000000D8` | Created  Assignments will appear here |

## Spacing & Sizing

### Unique Spacing Values (padding/gap)
- Values: none

### Border Radii
- Values: 64px

### Borders
| Element | Width | Color |
|---|---|---|
| Note | 1.0px | `` |

### Shadows
| Element | Type | X | Y | Blur | Spread | Color |
|---|---|---|---|---|---|---|

## Components Breakdown

### Component: Rectangle 12

- **NodeId**: `2:9860`
- **Type**: RECTANGLE
- **Position**: x=-2048.0, y=-421.0
- **Dimensions**: 727.0px × 243.0px
- **Background**: #FFFFFF
- **Border**: radius:64.0px, width:1.0px, color:
- **Shadow**: none
- **Padding**: 0
- **Corner Radius**: 64.0px
- **Layout**: NONE (gap: 0px)
- **Opacity**: 1.0
- **Visible**: True

### Component: Created Assignments will appear here

- **NodeId**: `2:9861`
- **Type**: TEXT
- **Position**: x=-1959.0, y=-355.0
- **Dimensions**: 549.0px × 112.0px
- **Background**: #000000D8
- **Border**: radius:0px, width:1.0px, color:
- **Shadow**: none
- **Padding**: 0
- **Corner Radius**: 0px
- **Layout**: NONE (gap: 0px)
- **Opacity**: 1.0
- **Visible**: True
- **Text Content**: "Created  Assignments will appear here"

## Interactive Elements

| Element | Type | Trigger | Action | Target / Notes |
|---|---|---|---|---|
| **Note card** | `Tooltip / Info Card` | `hover` or `auto-display` | Shows contextual information | Appears near the assignments area in empty state |
| **Dismiss** (inferred) | `Close action` | `click` or `auto-hide` | Hides the note | Tooltip may auto-dismiss after delay |


## Assets

| Asset Name | Type | NodeId | Dimensions | Image Ref |
|---|---|---|---|---|

## CSS / Style Rules

```css
/* === Note Card === */
.note-card {
  width: 727px;
  height: 243px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.note-card__text {
  font-family: 'Bricolage Grotesque', serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22.4px;
  letter-spacing: -0.64px;
  color: var(--color-secondary-text);
  text-align: center;
}
```

### Tailwind Class Mappings

```
.note-card → "w-[727px] h-[243px] bg-white rounded-xl p-6 flex items-center justify-center shadow-sm"
.note-card__text → "font-['Bricolage_Grotesque'] text-base leading-[22.4px] tracking-[-0.64px] text-[#5D5D5DCC] text-center"
```


## React Component Sketch

```tsx
interface NoteCardProps {
  message: string;
  visible?: boolean;
  onDismiss?: () => void;
}

export const NoteCard = ({ message, visible = true, onDismiss }: NoteCardProps) => {
  if (!visible) return null;

  return (
    <div className="note-card" role="status" aria-live="polite">
      <p className="note-card__text">{message}</p>
    </div>
  );
};
```


## Notes & Edge Cases

- **Usage Context**: This note is a small standalone component, likely used as a placeholder/hint within the assignments area when empty.
- **Not a Full Screen**: Unlike other specs, this is a component (727×243px), not a full screen layout. It may overlay or sit within the dashboard content area.
- **Auto-dismiss**: Consider auto-hiding after the first assignment is created or after a timeout.
- **Accessibility**: Uses `role="status"` and `aria-live="polite"` for screen reader announcement.

