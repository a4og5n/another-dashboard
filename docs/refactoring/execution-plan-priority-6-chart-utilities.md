# Execution Plan: Priority 6 - Consolidate Chart Utilities

**GitHub Issue:** [#TBD](https://github.com/a4og5n/another-dashboard/issues/TBD)

**Task Reference:** [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 6

**Estimated Effort:** 1.5-2 hours

**Created:** 2025-10-19

---

## Overview

**Goal:** Consolidate duplicate Recharts tooltip implementations and chart utility functions into a shared utilities module to reduce code duplication and improve consistency.

**Success Criteria:**

- ✅ All duplicate chart utilities consolidated into single module
- ✅ Custom tooltip component created and reused across charts
- ✅ All affected chart components updated to use shared utilities
- ✅ All tests pass
- ✅ No visual regressions in charts
- ✅ Consistent chart styling and behavior

**Context:**

Currently, the codebase has duplicate custom tooltip implementations for Recharts:
- `TimeseriesCard.tsx` has a `CustomTooltip` component (~23 lines)
- `ReportCharts.tsx` has different tooltip formatting logic
- Chart color schemes and formatting utilities are scattered across files

This refactoring will create reusable chart utilities including custom tooltips, color schemes, and formatting helpers.

**Estimated Lines Saved:** 30+ lines across 2 files

---

## Prerequisites

**Required Knowledge:**

- Understand Recharts library and custom tooltip pattern
- Familiarity with chart data formatting and presentation
- Understanding of TypeScript generics for flexible tooltip typing

**Files to Review Before Starting:**

- [src/components/dashboard/reports/TimeseriesCard.tsx](../../src/components/dashboard/reports/TimeseriesCard.tsx) - Current CustomTooltip implementation
- [src/components/dashboard/reports/ReportCharts.tsx](../../src/components/dashboard/reports/ReportCharts.tsx) - Chart rendering patterns
- Recharts documentation for custom tooltips

---

## Files Affected

**Files to Create:**

1. `src/components/dashboard/helpers/chart-utils.tsx` - Chart utilities and custom tooltip
2. `src/components/dashboard/helpers/chart-utils.test.tsx` - Tests for chart utilities
3. `src/components/dashboard/helpers/index.ts` - Barrel export
4. `src/types/components/dashboard/chart-utils.ts` - Type definitions for chart utilities

**Files to Modify:**

1. `src/components/dashboard/reports/TimeseriesCard.tsx` - Remove inline CustomTooltip, use shared
2. `src/components/dashboard/reports/ReportCharts.tsx` - Use shared chart utilities
3. `src/types/components/dashboard/index.ts` - Export chart utility types

**Files to Potentially Review (Usage Verification):**

- Other chart components that might benefit from utilities

---

## Phase 0: Git Setup and Pre-Implementation Validation

**Goal:** Ensure correct git branch setup and verify no work has already been completed

**Estimated Time:** 5-10 minutes

**⚠️ CRITICAL: This phase MUST be completed before any implementation work begins**

### Step 1: Verify Current Branch

```bash
# Check what branch you're currently on
git branch --show-current
```

**Expected outcomes:**

- ✅ **If on feature branch matching this plan:** Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

**Step 1b: Create Feature Branch (if needed)**

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b refactor/chart-utilities

# Verify you're on the correct branch
git branch --show-current
# Should output: refactor/chart-utilities (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to chart utilities
git log --oneline --all --grep="chart"

# Check if key files already exist
ls src/components/dashboard/helpers/chart-utils.tsx
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and files: [list]"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done and what remains
- Ask user how to proceed

### Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

- [ ] Read Priority 6 section in component-dry-refactoring-plan.md
- [ ] Review TimeseriesCard CustomTooltip implementation
- [ ] Review ReportCharts.tsx chart patterns
- [ ] Understand Recharts custom tooltip API
- [ ] Review project architectural standards (CLAUDE.md)
- [ ] Understand import/export patterns

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should match project requirements
pnpm --version  # Should match project requirements

# Ensure dependencies are installed
pnpm install

# Verify tests can run
pnpm test
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for chart utilities consolidation (#TBD)"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Create Type Definitions

**Goal:** Define TypeScript types for chart utilities before implementation

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify type files don't exist yet
- [ ] Review Recharts TooltipProps interface

**Implementation Steps:**

### 1. Create type definition file

```bash
mkdir -p src/types/components/dashboard
```

Create `src/types/components/dashboard/chart-utils.ts`:

```typescript
/**
 * Types for chart utility components and helpers
 *
 * Used for Recharts custom tooltips and chart formatting utilities
 */

/**
 * Props for the CustomChartTooltip component
 * Generic type T represents the data payload structure
 */
export interface CustomChartTooltipProps<T = Record<string, unknown>> {
  /** Whether the tooltip is active (hovering over chart) */
  active?: boolean;
  /** Payload containing the chart data for the hovered point */
  payload?: Array<{
    /** The data point value */
    value: number | string;
    /** Name/key of the data series */
    name?: string;
    /** Color of the data series */
    color?: string;
    /** Full data payload for this point */
    payload?: T;
  }>;
  /** Label for the tooltip (usually x-axis value) */
  label?: string;
  /** Optional formatter function for values */
  valueFormatter?: (value: number | string) => string;
  /** Optional formatter function for labels */
  labelFormatter?: (label: string) => string;
}

/**
 * Chart color scheme configuration
 */
export interface ChartColorScheme {
  /** Primary color for main data series */
  primary: string;
  /** Secondary color for comparison data */
  secondary: string;
  /** Success/positive color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error/negative color */
  error: string;
  /** Neutral/gray color */
  neutral: string;
}
```

### 2. Update barrel exports

Update `src/types/components/dashboard/index.ts`:

```typescript
export * from "@/types/components/dashboard/chart-utils";
// ... existing exports
```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] Types are properly exported
- [ ] JSDoc comments are comprehensive

**Checkpoint: COMMIT**

```bash
git add src/types/components/dashboard/chart-utils.ts src/types/components/dashboard/index.ts
git commit -m "feat(types): add chart utility type definitions (#TBD)

- Add CustomChartTooltipProps for flexible tooltip typing
- Add ChartColorScheme interface
- Add comprehensive JSDoc comments
- Export from dashboard types barrel"
```

---

## Phase 2: Create Chart Utilities Module

**Goal:** Implement chart utilities including custom tooltip component and helpers

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 1 commit exists
- [ ] Review TimeseriesCard CustomTooltip implementation to extract pattern

**Implementation Steps:**

### 1. Create helpers directory and file

```bash
mkdir -p src/components/dashboard/helpers
```

Create `src/components/dashboard/helpers/chart-utils.tsx`:

```typescript
/**
 * Chart utility functions and components for Recharts
 *
 * Provides reusable chart components and helpers to maintain consistency
 * and reduce code duplication across dashboard charts.
 */

import type { CustomChartTooltipProps, ChartColorScheme } from "@/types/components/dashboard";

/**
 * Custom tooltip component for Recharts
 * Provides consistent styling and formatting across all charts
 *
 * @example
 * ```tsx
 * <LineChart data={data}>
 *   <Tooltip content={<CustomChartTooltip />} />
 * </LineChart>
 * ```
 */
export function CustomChartTooltip<T = Record<string, unknown>>({
  active,
  payload,
  label,
  valueFormatter = (value) => String(value),
  labelFormatter = (label) => label,
}: CustomChartTooltipProps<T>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
      {label && (
        <p className="text-sm font-medium mb-2 text-foreground">
          {labelFormatter(label)}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.name}:
            </span>
            <span className="text-sm font-medium text-foreground">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Default chart color scheme matching dashboard theme
 */
export const defaultChartColors: ChartColorScheme = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142, 76%, 36%)", // green-600
  warning: "hsl(38, 92%, 50%)", // orange-500
  error: "hsl(0, 84%, 60%)", // red-500
  neutral: "hsl(215, 16%, 47%)", // gray-600
};

/**
 * Format a number as a localized string with thousand separators
 *
 * @param value - The number to format
 * @returns Formatted number string
 *
 * @example
 * formatChartNumber(1234567) // "1,234,567"
 */
export function formatChartNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString();
}

/**
 * Format a decimal value as a percentage for chart display
 *
 * @param value - The decimal value (e.g., 0.234 for 23.4%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 *
 * @example
 * formatChartPercentage(0.234) // "23.4%"
 */
export function formatChartPercentage(
  value: number | string,
  decimals: number = 1,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format a date for chart axis labels
 *
 * @param date - Date string or Date object
 * @returns Formatted date string (MMM DD)
 *
 * @example
 * formatChartDate("2024-01-15") // "Jan 15"
 */
export function formatChartDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
```

### 2. Create barrel export

Create `src/components/dashboard/helpers/index.ts`:

```typescript
export * from "@/components/dashboard/helpers/chart-utils";
```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] All imports resolve correctly
- [ ] JSDoc comments are comprehensive
- [ ] Component follows project patterns

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/helpers/
git commit -m "feat(dashboard): create chart utility components and helpers (#TBD)

- Add CustomChartTooltip component for Recharts
- Add defaultChartColors scheme matching dashboard theme
- Add formatChartNumber, formatChartPercentage, formatChartDate helpers
- Add comprehensive JSDoc with usage examples
- Create barrel export for helpers"
```

---

## Phase 3: Write Tests for Chart Utilities

**Goal:** Ensure chart utilities work correctly with comprehensive test coverage

**Estimated Time:** 25 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 2 commit exists
- [ ] Review existing test patterns in the project

**Implementation Steps:**

### 1. Create test file

Create `src/components/dashboard/helpers/chart-utils.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CustomChartTooltip,
  defaultChartColors,
  formatChartNumber,
  formatChartPercentage,
  formatChartDate,
} from "./chart-utils";

describe("CustomChartTooltip", () => {
  it("renders nothing when not active", () => {
    const { container } = render(
      <CustomChartTooltip active={false} payload={[]} label="Test" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when payload is empty", () => {
    const { container } = render(
      <CustomChartTooltip active={true} payload={[]} label="Test" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders tooltip with label and single data point", () => {
    const payload = [
      {
        value: 100,
        name: "Sales",
        color: "#8884d8",
      },
    ];

    render(<CustomChartTooltip active={true} payload={payload} label="Jan 1" />);

    expect(screen.getByText("Jan 1")).toBeInTheDocument();
    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders tooltip with multiple data points", () => {
    const payload = [
      { value: 100, name: "Sales", color: "#8884d8" },
      { value: 200, name: "Revenue", color: "#82ca9d" },
    ];

    render(<CustomChartTooltip active={true} payload={payload} label="Jan 1" />);

    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Revenue:")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("applies custom value formatter", () => {
    const payload = [{ value: 1234, name: "Sales", color: "#8884d8" }];
    const valueFormatter = (value: number | string) =>
      `$${Number(value).toLocaleString()}`;

    render(
      <CustomChartTooltip
        active={true}
        payload={payload}
        label="Jan 1"
        valueFormatter={valueFormatter}
      />,
    );

    expect(screen.getByText("$1,234")).toBeInTheDocument();
  });

  it("applies custom label formatter", () => {
    const payload = [{ value: 100, name: "Sales", color: "#8884d8" }];
    const labelFormatter = (label: string) => `Date: ${label}`;

    render(
      <CustomChartTooltip
        active={true}
        payload={payload}
        label="Jan 1"
        labelFormatter={labelFormatter}
      />,
    );

    expect(screen.getByText("Date: Jan 1")).toBeInTheDocument();
  });

  it("renders without label when not provided", () => {
    const payload = [{ value: 100, name: "Sales", color: "#8884d8" }];

    render(<CustomChartTooltip active={true} payload={payload} />);

    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});

describe("defaultChartColors", () => {
  it("has all required color properties", () => {
    expect(defaultChartColors).toHaveProperty("primary");
    expect(defaultChartColors).toHaveProperty("secondary");
    expect(defaultChartColors).toHaveProperty("success");
    expect(defaultChartColors).toHaveProperty("warning");
    expect(defaultChartColors).toHaveProperty("error");
    expect(defaultChartColors).toHaveProperty("neutral");
  });

  it("has valid color values", () => {
    expect(defaultChartColors.primary).toBeTruthy();
    expect(defaultChartColors.secondary).toBeTruthy();
    expect(defaultChartColors.success).toBeTruthy();
  });
});

describe("formatChartNumber", () => {
  it("formats numbers with thousand separators", () => {
    expect(formatChartNumber(1234567)).toBe("1,234,567");
    expect(formatChartNumber(1000)).toBe("1,000");
    expect(formatChartNumber(999)).toBe("999");
  });

  it("handles string input", () => {
    expect(formatChartNumber("12345")).toBe("12,345");
  });

  it("handles zero", () => {
    expect(formatChartNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatChartNumber(-1234)).toBe("-1,234");
  });

  it("handles invalid input", () => {
    expect(formatChartNumber("invalid")).toBe("invalid");
  });
});

describe("formatChartPercentage", () => {
  it("converts decimal to percentage with default decimals", () => {
    expect(formatChartPercentage(0.234)).toBe("23.4%");
    expect(formatChartPercentage(0.5)).toBe("50.0%");
    expect(formatChartPercentage(1)).toBe("100.0%");
  });

  it("respects custom decimal places", () => {
    expect(formatChartPercentage(0.23456, 2)).toBe("23.46%");
    expect(formatChartPercentage(0.23456, 0)).toBe("23%");
  });

  it("handles string input", () => {
    expect(formatChartPercentage("0.234")).toBe("23.4%");
  });

  it("handles zero", () => {
    expect(formatChartPercentage(0)).toBe("0.0%");
  });

  it("handles invalid input", () => {
    expect(formatChartPercentage("invalid")).toBe("invalid");
  });
});

describe("formatChartDate", () => {
  it("formats date string in MMM DD format", () => {
    expect(formatChartDate("2024-01-15")).toBe("Jan 15");
    expect(formatChartDate("2024-12-25")).toBe("Dec 25");
  });

  it("formats Date object", () => {
    const date = new Date("2024-01-15");
    expect(formatChartDate(date)).toBe("Jan 15");
  });
});
```

### 2. Run tests and verify coverage

```bash
# Run tests
pnpm test src/components/dashboard/helpers/chart-utils.test.tsx

# Check coverage
pnpm test:coverage src/components/dashboard/helpers/chart-utils.test.tsx
```

**Validation:**

- [ ] All tests pass
- [ ] Coverage is high (aim for 90%+ for utilities)
- [ ] All edge cases tested
- [ ] Tests are clear and well-documented

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/helpers/chart-utils.test.tsx
git commit -m "test(dashboard): add comprehensive tests for chart utilities (#TBD)

- Test CustomChartTooltip rendering and formatters
- Test formatChartNumber with various inputs
- Test formatChartPercentage decimal conversion
- Test formatChartDate formatting
- Test defaultChartColors structure
- Cover edge cases and invalid inputs"
```

---

## Phase 4: Refactor TimeseriesCard

**Goal:** Remove inline CustomTooltip from TimeseriesCard and use shared component

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 3 commit exists
- [ ] Read current TimeseriesCard.tsx implementation

**Implementation Steps:**

### 1. Update TimeseriesCard.tsx

Read the file first to understand current implementation:

```bash
# Review current file
cat src/components/dashboard/reports/TimeseriesCard.tsx | grep -A 30 "CustomTooltip"
```

Remove the inline `CustomTooltip` component and import from shared utilities:

**At the top of the file, add import:**

```typescript
import { CustomChartTooltip, formatChartNumber } from "@/components/dashboard/helpers";
```

**Remove the inline CustomTooltip component** (approximately lines with the component definition)

**Update the Tooltip usage in the chart:**

```typescript
// OLD:
<Tooltip content={<CustomTooltip />} />

// NEW (if different formatting needed):
<Tooltip
  content={
    <CustomChartTooltip
      valueFormatter={formatChartNumber}
      labelFormatter={(label) => formatChartDate(label)}
    />
  }
/>
```

**Note:** Adjust based on actual current implementation. The key is to remove the duplicate component definition and use the shared one.

### 2. Run validation

```bash
# Type check
pnpm type-check

# Run tests
pnpm test

# Start dev server to verify visually
pnpm dev
```

**Manual Testing:**

- [ ] Navigate to page with timeseries chart
- [ ] Hover over chart data points
- [ ] Verify tooltip displays correctly
- [ ] Verify tooltip styling matches previous implementation
- [ ] Check for console errors

**Validation:**

- [ ] TypeScript compiles without errors
- [ ] Chart renders correctly
- [ ] Tooltip displays properly on hover
- [ ] No visual regressions
- [ ] Removed ~23 lines of duplicate code

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/reports/TimeseriesCard.tsx
git commit -m "refactor(dashboard): use shared CustomChartTooltip in TimeseriesCard (#TBD)

- Remove inline CustomTooltip component
- Import from @/components/dashboard/helpers
- Use formatChartNumber for value formatting
- Reduces code duplication (~23 lines removed)
- Maintains existing tooltip behavior"
```

---

## Phase 5: Update ReportCharts (if applicable)

**Goal:** Apply chart utilities to ReportCharts component if it has similar patterns

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 4 commit exists
- [ ] Read ReportCharts.tsx to identify opportunities

**Implementation Steps:**

### 1. Review ReportCharts.tsx

```bash
# Check if ReportCharts uses custom tooltips or formatting
cat src/components/dashboard/reports/ReportCharts.tsx | grep -i "tooltip"
```

**If ReportCharts has duplicate patterns:**

1. Import shared utilities
2. Replace inline tooltip or formatting logic
3. Use `CustomChartTooltip` with appropriate formatters

**If ReportCharts doesn't have significant duplication:**

- Document that no changes were needed
- Note any potential future improvements
- Skip to Phase 6

### 2. Run validation (if changes made)

```bash
# Type check
pnpm type-check

# Run tests
pnpm test

# Manual testing in browser
pnpm dev
```

**Validation:**

- [ ] TypeScript compiles without errors
- [ ] Charts render correctly
- [ ] No visual regressions
- [ ] Any duplicate code removed

**Checkpoint: COMMIT** (if changes made)

```bash
git add src/components/dashboard/reports/ReportCharts.tsx
git commit -m "refactor(dashboard): apply chart utilities to ReportCharts (#TBD)

- Use shared chart formatting utilities
- Reduces code duplication
- Improves consistency"
```

**Note:** If no changes needed, document in notes and proceed to Phase 6.

---

## Phase 6: Final Validation and Documentation

**Goal:** Run full validation suite and ensure all changes work correctly

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -10`
- [ ] Verify all previous phases complete
- [ ] Review all changes: `git diff main`

**Implementation Steps:**

### 1. Run full validation suite

```bash
# Run all tests
pnpm test

# Run architectural enforcement tests
pnpm test src/test/architectural-enforcement/

# Type checking
pnpm type-check

# Linting
pnpm lint

# Full validation (includes build)
pnpm validate
```

### 2. Manual testing in browser

```bash
# Start dev server
pnpm dev
```

**Test these components:**

- [ ] Navigate to pages with TimeseriesCard
- [ ] Hover over chart data points to verify tooltips
- [ ] Check for any console errors
- [ ] Verify chart colors render correctly
- [ ] Test on different screen sizes if responsive

### 3. Review all changes

```bash
# Review commit history
git log --oneline main..HEAD

# Review all file changes
git diff main

# Count lines saved
git diff main --stat
```

### 4. Update CLAUDE.md (if establishing new pattern)

If chart utilities represent a new pattern worth documenting:

```markdown
### Chart Utilities

For Recharts components, use shared utilities from `@/components/dashboard/helpers`:

- `CustomChartTooltip` - Consistent tooltip styling
- `defaultChartColors` - Dashboard color scheme
- `formatChartNumber()` - Number formatting
- `formatChartPercentage()` - Percentage formatting
- `formatChartDate()` - Date formatting for axes
```

**Validation:**

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] No console errors in dev server
- [ ] Manual testing shows correct chart behavior
- [ ] ~30+ lines of duplicate code removed

**Checkpoint: COMMIT** (if documentation updated)

```bash
git add CLAUDE.md
git commit -m "docs: add chart utilities usage guidance (#TBD)"
```

**✅ Phase 6 Complete - Ready to create PR**

---

## Manual Review Checklist

**Before Pushing to Origin**

Perform a thorough manual review:

- [ ] **Code Review**
  - [ ] All code follows project patterns and conventions
  - [ ] No commented-out code (unless intentional with explanation)
  - [ ] No console.logs or debug statements
  - [ ] No TODO comments without GitHub issue references
  - [ ] Chart utilities are properly typed with generics

- [ ] **Type Safety & Architecture**
  - [ ] No `any` types used
  - [ ] All imports use path aliases (`@/components`, `@/types`)
  - [ ] Types organized properly in `/src/types`
  - [ ] Generic types used appropriately for flexibility
  - [ ] JSDoc comments on all exported functions/components

- [ ] **Testing**
  - [ ] All new/updated functions have tests
  - [ ] All tests pass: `pnpm test`
  - [ ] High coverage for chart utilities
  - [ ] Type checking passes: `pnpm type-check`
  - [ ] Linting passes: `pnpm lint`

- [ ] **Functionality**
  - [ ] Charts render correctly
  - [ ] Tooltips display properly on hover
  - [ ] Formatting functions work as expected
  - [ ] No visual regressions in charts
  - [ ] Colors match dashboard theme

- [ ] **Git Hygiene**
  - [ ] Review all changes: `git diff main`
  - [ ] Ensure no unintended files are staged
  - [ ] Commit messages follow conventions
  - [ ] Each commit leaves codebase in working state

---

## Push and PR Strategy

### Before Pushing

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Review all changes
git diff main

# Ensure you're on the correct branch
git branch --show-current
```

### Pushing to Origin

```bash
# First push of new branch
git push -u origin refactor/chart-utilities
```

### Creating Pull Request

**Title:** `refactor: consolidate chart utilities for Recharts`

**Description:**

```markdown
## Summary

Consolidates duplicate Recharts tooltip implementations and chart formatting utilities into a shared module.

Closes #TBD

**Lines Saved:** 30+ | **Effort:** Medium | **Impact:** Low

## Problem

The codebase had duplicate custom tooltip implementations:
- `TimeseriesCard.tsx` had inline `CustomTooltip` component (~23 lines)
- Chart formatting utilities scattered across files
- No consistent color scheme for charts

## Changes

- Created `src/components/dashboard/helpers/chart-utils.tsx` with:
  - `CustomChartTooltip` component for Recharts
  - `defaultChartColors` matching dashboard theme
  - `formatChartNumber`, `formatChartPercentage`, `formatChartDate` helpers
- Created comprehensive type definitions in `src/types/components/dashboard/chart-utils.ts`
- Removed duplicate CustomTooltip from TimeseriesCard.tsx
- Updated ReportCharts.tsx to use shared utilities (if applicable)
- Added comprehensive test suite with high coverage

## Testing

- [x] Unit tests pass (25+ tests)
- [x] High coverage for chart utilities
- [x] Type checking passes
- [x] Manual testing completed for all chart components
- [x] No visual regressions in tooltips or charts

## Benefits

- Single source of truth for chart utilities
- Consistent tooltip styling across all charts
- Improved maintainability
- Comprehensive test coverage
- Reusable formatting helpers

## Checklist

- [x] Code follows project patterns
- [x] Tests added with high coverage
- [x] No breaking changes
- [x] JSDoc documentation added
- [x] All affected components updated

## Related

- **Execution Plan:** [docs/refactoring/execution-plan-priority-6-chart-utilities.md](docs/refactoring/execution-plan-priority-6-chart-utilities.md)
- **Parent Epic:** Component DRY Refactoring - Priority 6
```

---

## Rollback Strategy

**If Something Goes Wrong**

**Rollback Last Commit (not pushed):**

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (DANGEROUS)
git reset --hard HEAD~1
```

**Rollback After Pushing:**

```bash
# Create a revert commit (safe, preserves history)
git revert <commit-hash>
git push
```

**Emergency: Discard All Changes**

```bash
# Stash current changes
git stash

# Or discard completely
git checkout .
git clean -fd  # Remove untracked files
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d refactor/chart-utilities`
- [ ] Check off Priority 6 in component-dry-refactoring-plan.md
- [ ] Update refactoring progress metrics (100% complete!)
- [ ] Celebrate completion of entire DRY refactoring initiative! 🎉

---

**End of Execution Plan**
