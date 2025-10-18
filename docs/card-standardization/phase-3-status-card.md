# Phase 3: Create StatusCard Component

**Estimated Time:** 45-60 minutes

**Goal:** Create the StatusCard component for displaying status with badge and metrics

---

## Pre-Phase Checklist

- [ ] Phase 2 completed
- [ ] Check git log to verify Phase 3 isn't already done
- [ ] Verify StatusCard doesn't exist: `ls src/components/ui/status-card.tsx`

---

## Files to Create

**Types:**

- `src/types/components/ui/status-card.ts` - StatusCard props

**Component:**

- `src/components/ui/status-card.tsx` - Component implementation
- `src/components/ui/status-card.test.tsx` - Tests

**Modified:**

- `src/types/components/ui/index.ts` - Export StatusCard types

---

## Implementation Steps

### Step 1: Create Type Definitions

Create `src/types/components/ui/status-card.ts`:

````tsx
/**
 * Types for StatusCard component
 *
 * StatusCard displays a status with badge and associated metrics
 */

import type { ReactNode } from "react";

/**
 * Badge variant for status display
 */
export type StatusVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Metric item for status card
 */
export interface StatusMetric {
  /**
   * Metric label
   */
  label: string;

  /**
   * Metric value (number or formatted string)
   */
  value: string | number;

  /**
   * Optional text color for the value
   */
  valueColor?: string;
}

/**
 * Props for the StatusCard component
 *
 * @example
 * ```tsx
 * <StatusCard
 *   title="Delivery Status"
 *   status="delivered"
 *   statusVariant="default"
 *   description="Campaign delivery information"
 *   metrics={[
 *     { label: "Emails Sent", value: 5000 },
 *     { label: "Emails Canceled", value: 0 }
 *   ]}
 * />
 * ```
 */
export interface StatusCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Status text to display in badge
   */
  status: string;

  /**
   * Badge variant for status
   * @default "default"
   */
  statusVariant?: StatusVariant;

  /**
   * Optional description text below title
   */
  description?: string;

  /**
   * Array of metrics to display
   */
  metrics?: StatusMetric[];

  /**
   * Optional progress value (0-100)
   */
  progress?: number;

  /**
   * Optional action buttons or content
   */
  actions?: ReactNode;

  /**
   * Optional footer content
   */
  footer?: ReactNode;

  /**
   * Optional additional CSS classes
   */
  className?: string;

  /**
   * Loading state - shows skeleton
   * @default false
   */
  loading?: boolean;
}
````

### Step 2: Update Type Exports

Add to `src/types/components/ui/index.ts`:

```tsx
export * from "@/types/components/ui/status-card";
```

### Step 3: Create Component

Create `src/components/ui/status-card.tsx`:

````tsx
/**
 * StatusCard Component
 *
 * Displays status information with badge, metrics, and optional
 * progress indicator. Commonly used for delivery status, connection
 * status, and other state displays.
 *
 * @example
 * ```tsx
 * <StatusCard
 *   title="Delivery Status"
 *   status="delivered"
 *   statusVariant="default"
 *   description="Campaign delivery information"
 *   metrics={[
 *     { label: "Emails Sent", value: 5000 },
 *     { label: "Emails Canceled", value: 0 }
 *   ]}
 *   progress={100}
 * />
 * ```
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/skeletons";
import type { StatusCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";

export function StatusCard({
  title,
  status,
  statusVariant = "default",
  description,
  metrics = [],
  progress,
  actions,
  footer,
  className = "",
  loading = false,
}: StatusCardProps) {
  const formatValue = (val: string | number): string => {
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          {description && <Skeleton className="h-4 w-full mt-2" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress !== undefined && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Metrics Grid */}
          {metrics.length > 0 && (
            <div
              className={cn(
                "grid gap-4 pt-2",
                metrics.length === 1
                  ? "grid-cols-1"
                  : metrics.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3",
              )}
            >
              {metrics.map((metric, index) => (
                <div key={index} className="rounded-lg bg-muted p-3">
                  <div className="text-muted-foreground text-sm">
                    {metric.label}
                  </div>
                  <div
                    className="text-2xl font-bold mt-1"
                    style={
                      metric.valueColor
                        ? { color: metric.valueColor }
                        : undefined
                    }
                  >
                    {formatValue(metric.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 pt-2">{actions}</div>
          )}

          {/* Footer */}
          {footer && <div className="pt-2 border-t">{footer}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

StatusCard.displayName = "StatusCard";
````

### Step 4: Create Tests

Create `src/components/ui/status-card.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatusCard } from "@/components/ui/status-card";
import { Button } from "@/components/ui/button";

describe("StatusCard", () => {
  const mockMetrics = [
    { label: "Emails Sent", value: 5000 },
    { label: "Emails Canceled", value: 0 },
  ];

  it("renders with basic props", () => {
    render(<StatusCard title="Delivery Status" status="delivered" />);

    expect(screen.getByText("Delivery Status")).toBeInTheDocument();
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        description="Campaign delivery information"
      />,
    );

    expect(
      screen.getByText("Campaign delivery information"),
    ).toBeInTheDocument();
  });

  it("renders with metrics", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );

    expect(screen.getByText("Emails Sent")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
    expect(screen.getByText("Emails Canceled")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with progress bar", () => {
    render(
      <StatusCard title="Delivery Status" status="delivering" progress={75} />,
    );

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders with actions", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        actions={<Button size="sm">Cancel</Button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        footer={<div>Footer content</div>}
      />,
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies different badge variants", () => {
    const { rerender } = render(
      <StatusCard title="Status" status="active" statusVariant="default" />,
    );

    let badge = screen.getByText("active");
    expect(badge).toBeInTheDocument();

    rerender(
      <StatusCard title="Status" status="error" statusVariant="destructive" />,
    );

    badge = screen.getByText("error");
    expect(badge).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(
      <StatusCard
        title="Status"
        status="active"
        metrics={[{ label: "Total", value: 1234567 }]}
      />,
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
        loading={true}
      />,
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );

    const card = screen
      .getByText("Delivery Status")
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });
});
```

---

## Validation Steps

```bash
# Run type checking
pnpm type-check

# Run tests
pnpm test src/components/ui/status-card.test.tsx

# Run linting
pnpm lint
```

### Validation Checklist

- [ ] TypeScript compiles without errors
- [ ] All tests pass (unit + accessibility)
- [ ] No linting errors
- [ ] Component renders correctly in isolation

---

## Checkpoint: COMMIT

```bash
git add src/types/components/ui/status-card.ts src/types/components/ui/index.ts src/components/ui/status-card.tsx src/components/ui/status-card.test.tsx
git commit -m "feat(ui): add StatusCard component for status display

- Create StatusCard with status badge and metrics
- Support progress indicators and actions
- Include loading skeleton state
- Add comprehensive unit and accessibility tests
- Full TypeScript types with JSDoc documentation"
```

---

## ✅ Phase 3 Complete

**Next Step:** Proceed to [Phase 4: Migrate Example Components](./phase-4-migrations.md)

---

## 💰 Cost Optimization Note

✅ Safe to clear conversation after this commit because:

- Phase 3 is complete and committed
- All three Card components are created and tested
- Next phase is independent (migrating existing components)

📋 What to keep when clearing:

- Main execution plan document
- Phase 4 document (next task)
