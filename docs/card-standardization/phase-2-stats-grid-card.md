# Phase 2: Create StatsGridCard Component

**Estimated Time:** 45-60 minutes

**Goal:** Create the StatsGridCard component for displaying multiple stats in a grid layout

---

## Pre-Phase Checklist

- [ ] Phase 1 completed
- [ ] Check git log to verify Phase 2 isn't already done
- [ ] Verify StatsGridCard doesn't exist: `ls src/components/ui/stats-grid-card.tsx`

---

## Files to Create

**Types:**

- `src/types/components/ui/stats-grid-card.ts` - StatsGridCard props

**Component:**

- `src/components/ui/stats-grid-card.tsx` - Component implementation
- `src/components/ui/stats-grid-card.test.tsx` - Tests

**Modified:**

- `src/types/components/ui/index.ts` - Export StatsGridCard types

---

## Implementation Steps

### Step 1: Create Type Definitions

Create `src/types/components/ui/stats-grid-card.ts`:

````tsx
/**
 * Types for StatsGridCard component
 *
 * StatsGridCard displays multiple statistics in a grid layout
 * with a header and optional footer actions.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Individual stat item in the grid
 */
export interface StatGridItem {
  /**
   * The primary value to display (number or formatted string)
   */
  value: string | number;

  /**
   * Label describing what the value represents
   */
  label: string;

  /**
   * Optional text color for the value (CSS color or Tailwind class)
   */
  valueColor?: string;
}

/**
 * Props for the StatsGridCard component
 *
 * @example
 * ```tsx
 * <StatsGridCard
 *   title="Email Opens"
 *   icon={MailOpen}
 *   iconColor="text-blue-500"
 *   stats={[
 *     { value: 1250, label: "Total Opens" },
 *     { value: 980, label: "Unique Opens" },
 *     { value: "23.4%", label: "Open Rate" }
 *   ]}
 * />
 * ```
 */
export interface StatsGridCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Optional Lucide icon for the header
   */
  icon?: LucideIcon;

  /**
   * Icon color (CSS color value or Tailwind class)
   * @default "currentColor"
   */
  iconColor?: string;

  /**
   * Array of statistics to display in grid
   * Typically 2-4 items for best layout
   */
  stats: StatGridItem[];

  /**
   * Optional footer content (e.g., buttons, links)
   */
  footer?: ReactNode;

  /**
   * Optional header actions (e.g., toggle switches)
   */
  headerAction?: ReactNode;

  /**
   * Number of columns in the grid
   * @default 3
   */
  columns?: 2 | 3 | 4;

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
export * from "@/types/components/ui/stats-grid-card";
```

### Step 3: Create Component

Create `src/components/ui/stats-grid-card.tsx`:

````tsx
/**
 * StatsGridCard Component
 *
 * Displays multiple statistics in a grid layout with a header
 * and optional footer. Commonly used for metrics dashboards.
 *
 * @example
 * ```tsx
 * <StatsGridCard
 *   title="Email Opens"
 *   icon={MailOpen}
 *   iconColor="text-blue-500"
 *   stats={[
 *     { value: 1250, label: "Total Opens" },
 *     { value: 980, label: "Unique Opens" },
 *     { value: "23.4%", label: "Open Rate" }
 *   ]}
 *   footer={<Button>View Details</Button>}
 * />
 * ```
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";
import type { StatsGridCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";

export function StatsGridCard({
  title,
  icon: Icon,
  iconColor = "currentColor",
  stats,
  footer,
  headerAction,
  columns = 3,
  className = "",
  loading = false,
}: StatsGridCardProps) {
  const formatValue = (val: string | number): string => {
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  const getGridCols = () => {
    switch (columns) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-3";
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            {headerAction && <Skeleton className="h-8 w-24" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("grid gap-4", getGridCols())}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            {Icon && <Icon className="h-4 w-4" style={{ color: iconColor }} />}
            <span>{title}</span>
          </CardTitle>
          {headerAction && <div>{headerAction}</div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("grid gap-4", getGridCols())}>
          {stats.map((stat, index) => (
            <div key={index}>
              <p
                className="text-2xl font-bold"
                style={stat.valueColor ? { color: stat.valueColor } : undefined}
              >
                {formatValue(stat.value)}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        {footer && <div className="pt-2 border-t">{footer}</div>}
      </CardContent>
    </Card>
  );
}

StatsGridCard.displayName = "StatsGridCard";
````

### Step 4: Create Tests

Create `src/components/ui/stats-grid-card.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

describe("StatsGridCard", () => {
  const mockStats = [
    { value: 1250, label: "Total Opens" },
    { value: 980, label: "Unique Opens" },
    { value: "23.4%", label: "Open Rate" },
  ];

  it("renders with basic props", () => {
    render(<StatsGridCard title="Email Opens" stats={mockStats} />);

    expect(screen.getByText("Email Opens")).toBeInTheDocument();
    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("Total Opens")).toBeInTheDocument();
    expect(screen.getByText("980")).toBeInTheDocument();
    expect(screen.getByText("Unique Opens")).toBeInTheDocument();
    expect(screen.getByText("23.4%")).toBeInTheDocument();
    expect(screen.getByText("Open Rate")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    const { container } = render(
      <StatsGridCard title="Email Opens" icon={MailOpen} stats={mockStats} />,
    );

    // Icon should be rendered
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        footer={<Button>View Details</Button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "View Details" }),
    ).toBeInTheDocument();
  });

  it("renders with header action", () => {
    render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        headerAction={
          <Button variant="outline" size="sm">
            Toggle
          </Button>
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  it("supports different column layouts", () => {
    const { container } = render(
      <StatsGridCard
        title="Two Columns"
        stats={[
          { value: 100, label: "Stat 1" },
          { value: 200, label: "Stat 2" },
        ]}
        columns={2}
      />,
    );

    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(
      <StatsGridCard
        title="Large Numbers"
        stats={[{ value: 1234567, label: "Big Number" }]}
      />,
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatsGridCard title="Email Opens" stats={mockStats} loading={true} />,
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatsGridCard title="Email Opens" stats={mockStats} />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(<StatsGridCard title="Email Opens" stats={mockStats} />);

    const card = screen.getByText("Email Opens").closest('[data-slot="card"]');
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
pnpm test src/components/ui/stats-grid-card.test.tsx

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
git add src/types/components/ui/stats-grid-card.ts src/types/components/ui/index.ts src/components/ui/stats-grid-card.tsx src/components/ui/stats-grid-card.test.tsx
git commit -m "feat(ui): add StatsGridCard component for multi-stat display

- Create StatsGridCard with grid layout support
- Support 2-4 column layouts
- Include header actions and footer content
- Add loading skeleton state
- Add comprehensive unit and accessibility tests
- Full TypeScript types with JSDoc documentation"
```

---

## ✅ Phase 2 Complete

**Next Step:** Proceed to [Phase 3: Create StatusCard Component](./phase-3-status-card.md)

---

## 💰 Cost Optimization Note

✅ Safe to clear conversation after this commit because:

- Phase 2 is complete and committed
- StatsGridCard is tested and working
- Next phase (StatusCard) is independent

📋 What to keep when clearing:

- Main execution plan document
- Phase 3 document (next task)
