# Dashboard Inline Error Component

Displays a styled inline error message for dashboard sections, following PRD guidelines for clarity, accessibility, and visual feedback.

## Usage

Import and use in any dashboard section where you want to show an inline error:

```tsx
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

<DashboardInlineError error={errorMessage} />;
```

- Only renders if `error` is truthy.
- Uses accessible ARIA roles and color contrast for visibility.

## Props

| Name  | Type   | Description                   |
| ----- | ------ | ----------------------------- |
| error | string | The error message to display. |

## Accessibility

- Uses `role="alert"` and `aria-live="assertive"` for screen readers.
- Icon is marked as decorative (`aria-hidden="true"`).
- Text color meets contrast requirements.

## Design

- Follows PRD requirements for clarity, feedback, and accessibility.
- Uses shadcn/ui Card and Lucide icon for consistency.

## Example

```tsx
<DashboardInlineError error="API request failed. Please try again." />
```
