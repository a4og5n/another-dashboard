# Phase 1: Create StatCard Component

**Estimated Time:** 45-60 minutes

**Goal:** Create the StatCard component for simple metric display (icon + value + label)

---

## Pre-Phase Checklist

- [ ] Phase 0 completed and on feature branch
- [ ] Verify StatCard doesn't exist: `ls src/components/ui/stat-card.tsx`
- [ ] Review BaseMetricCard for reference patterns

---

## Files to Create

**Types:**

- `src/types/components/ui/stat-card.ts` - StatCard props and types

**Component:**

- `src/components/ui/stat-card.tsx` - Component implementation
- `src/components/ui/stat-card.test.tsx` - Tests

**Modified:**

- `src/types/components/ui/index.ts` - Export StatCard types

---

## Implementation Steps

### Step 1: Create Type Definitions FIRST

```bash
# Create type definition file
touch src/types/components/ui/stat-card.ts
```

Create the following in `src/types/components/ui/stat-card.ts`:

````tsx
/**
 * Types for StatCard component
 *
 * StatCard is a standardized component for displaying simple metrics
 * with an icon, large value, and label.
 */

import type { LucideIcon } from "lucide-react";

/**
 * Trend direction for the stat metric
 */
export type StatTrend = "up" | "down" | "neutral";

/**
 * Props for the StatCard component
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={Mail}
 *   value={12500}
 *   label="Emails Sent"
 *   trend="up"
 *   change={5.2}
 * />
 * ```
 */
export interface StatCardProps {
  /**
   * Lucide icon to display
   */
  icon: LucideIcon;

  /**
   * Primary value to display (will be formatted with toLocaleString if number)
   */
  value: string | number;

  /**
   * Label describing the metric
   */
  label: string;

  /**
   * Optional trend indicator
   */
  trend?: StatTrend;

  /**
   * Optional percentage change value (displayed with trend badge)
   */
  change?: number;

  /**
   * Optional description text below the label
   */
  description?: string;

  /**
   * Icon color (CSS color value or Tailwind class)
   * @default "currentColor"
   */
  iconColor?: string;

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
export * from "@/types/components/ui/stat-card";
```

### Step 3: Create StatCard Component

Create `src/components/ui/stat-card.tsx`:

````tsx
/**
 * StatCard Component
 *
 * Standardized card component for displaying simple metrics with
 * icon, value, label, and optional trend indicators.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={Mail}
 *   value={12500}
 *   label="Emails Sent"
 *   trend="up"
 *   change={5.2}
 * />
 * ```
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/skeletons";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatCardProps, StatTrend } from "@/types/components/ui";

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  change,
  description,
  iconColor = "currentColor",
  className = "",
  loading = false,
}: StatCardProps) {
  const getTrendIcon = (trendValue: StatTrend) => {
    switch (trendValue) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trendValue: StatTrend) => {
    switch (trendValue) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatValue = (val: string | number): string => {
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(change !== undefined || trend) && (
          <div className="flex items-center space-x-2 mt-2">
            {change !== undefined && trend && (
              <Badge variant="outline" className={getTrendColor(trend)}>
                {getTrendIcon(trend)}
                <span className="ml-1">
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              </Badge>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

StatCard.displayName = "StatCard";
````

### Step 4: Create Tests

Create `src/components/ui/stat-card.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatCard } from "@/components/ui/stat-card";
import { Mail } from "lucide-react";

describe("StatCard", () => {
  it("renders with basic props", () => {
    render(<StatCard icon={Mail} value={12500} label="Emails Sent" />);

    expect(screen.getByText("Emails Sent")).toBeInTheDocument();
    expect(screen.getByText("12,500")).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(<StatCard icon={Mail} value={1234567} label="Large Number" />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders string values without formatting", () => {
    render(<StatCard icon={Mail} value="23.4%" label="Open Rate" />);

    expect(screen.getByText("23.4%")).toBeInTheDocument();
  });

  it("renders trend indicator when provided", () => {
    render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        trend="up"
        change={5.2}
      />,
    );

    expect(screen.getByText("+5.2%")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        description="Compared to last month"
      />,
    );

    expect(screen.getByText("Compared to last month")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatCard icon={Mail} value={12500} label="Emails Sent" loading={true} />,
    );

    // Skeleton components should be present
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatCard icon={Mail} value={12500} label="Emails Sent" />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(<StatCard icon={Mail} value={12500} label="Emails Sent" />);

    // Card should have proper data attributes
    const card = screen.getByText("Emails Sent").closest('[data-slot="card"]');
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
pnpm test src/components/ui/stat-card.test.tsx

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
git add src/types/components/ui/stat-card.ts src/types/components/ui/index.ts src/components/ui/stat-card.tsx src/components/ui/stat-card.test.tsx
git commit -m "feat(ui): add StatCard component for simple metric display

- Create StatCard component with icon, value, label
- Support trend indicators and change percentages
- Include loading skeleton state
- Add comprehensive unit and accessibility tests
- Full TypeScript types with JSDoc documentation"
```

---

## ✅ Phase 1 Complete

**Next Step:** Proceed to [Phase 2: Create StatsGridCard Component](./phase-2-stats-grid-card.md)

---

## 💰 Cost Optimization Note

✅ Safe to clear conversation after this commit because:

- Phase 1 is complete and committed
- StatCard is tested and working
- Next phase (StatsGridCard) is independent

📋 What to keep when clearing:

- Main execution plan document
- Phase 2 document (next task)

---

## Troubleshooting

### "Type errors in stat-card.ts"

```bash
# Check if lucide-react is installed
pnpm list lucide-react

# If missing, install it
pnpm add lucide-react
```

### "Tests fail with 'Cannot find module @/test/test-utils'"

```bash
# Verify test utils exist
ls src/test/test-utils.tsx

# Run type check to see all errors
pnpm type-check
```

### "Skeleton not found"

```bash
# Check if skeleton component exists
ls src/skeletons/index.tsx

# If missing, use alternative loading state or create skeleton component
```
