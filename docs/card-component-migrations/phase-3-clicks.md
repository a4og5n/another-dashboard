# Phase 3: Migrate ClicksCard

**Goal:** Migrate ClicksCard to use StatsGridCard with 3-column grid and complex footer content

**Estimated Time:** 20-25 minutes

**Lines to be saved:** ~60 lines of boilerplate

---

## Pre-Phase Checklist

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify component hasn't been updated: `git log --oneline -3 -- src/components/dashboard/reports/ClicksCard.tsx`
- [ ] Check if StatsGridCard is already imported in the file
- [ ] If phase is already complete, inform user and ask for next steps

---

## Current Implementation Analysis

**File:** [src/components/dashboard/reports/ClicksCard.tsx](../../src/components/dashboard/reports/ClicksCard.tsx)

**Current Structure (76 lines):**

- Lines 1-12: Imports and component setup
- Lines 14-18: Format last click date as relative time
- Lines 20-24: Calculate unique click percentage
- Lines 27-54: Card with 3-column grid for main metrics
- Lines 56-71: Additional context section with:
  - Unique click percentage
  - Subscriber clicks count
  - Last clicked relative time

**Pattern:**

```tsx
<Card>
  <CardHeader>
    <CardTitle with icon>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3"> (3 main metrics)
    <div className="pt-2 border-t"> (complex additional context)
  </CardContent>
</Card>
```

**Challenge:** This component has:

1. Date formatting logic (`formatDistanceToNow`)
2. Percentage calculation
3. Complex footer with multiple pieces of information
4. Border-top separator styling

---

## Implementation Steps

### Step 1: Update Imports

**Read the current file first:**

```bash
# Use Read tool to view the full file
```

**Modify the imports section:**

**OLD (Lines 8-10):**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
```

**NEW:**

```tsx
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
```

**What changed:**

- Removed: `Card, CardContent, CardHeader, CardTitle` imports
- Added: `StatsGridCard` import
- Kept: `formatDistanceToNow` (needed for footer)

---

### Step 2: Refactor Component Implementation

**OLD Implementation (Lines 13-75):**

```tsx
export function ClicksCard({ clicks }: ClicksCardProps) {
  // Format last click date as a relative time (e.g., "2 days ago")
  const lastClickDate = new Date(clicks.last_click);
  const lastClickRelative = formatDistanceToNow(lastClickDate, {
    addSuffix: true,
  });

  // Calculate percentage of unique clicks vs total clicks
  const uniqueClickPercentage =
    clicks.clicks_total > 0
      ? ((clicks.unique_clicks / clicks.clicks_total) * 100).toFixed(1)
      : "0.0";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <MousePointer className="h-4 w-4 text-green-500" />
          <span>Email Clicks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold">
              {clicks.clicks_total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {clicks.unique_clicks.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Unique Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(clicks.click_rate * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Click Rate</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {uniqueClickPercentage}% of clicks were unique
              </span>
              <span className="text-sm font-medium">
                {clicks.unique_subscriber_clicks.toLocaleString()} subscribers
                clicked
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Last clicked {lastClickRelative}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**NEW Implementation:**

```tsx
export function ClicksCard({ clicks }: ClicksCardProps) {
  // Format last click date as a relative time (e.g., "2 days ago")
  const lastClickDate = new Date(clicks.last_click);
  const lastClickRelative = formatDistanceToNow(lastClickDate, {
    addSuffix: true,
  });

  // Calculate percentage of unique clicks vs total clicks
  const uniqueClickPercentage =
    clicks.clicks_total > 0
      ? ((clicks.unique_clicks / clicks.clicks_total) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Clicks"
      icon={MousePointer}
      iconColor="text-green-500"
      stats={[
        {
          value: clicks.clicks_total.toLocaleString(),
          label: "Total Clicks",
        },
        {
          value: clicks.unique_clicks.toLocaleString(),
          label: "Unique Clicks",
        },
        {
          value: `${(clicks.click_rate * 100).toFixed(1)}%`,
          label: "Click Rate",
        },
      ]}
      columns={3}
      footer={
        <div className="pt-2 border-t">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {uniqueClickPercentage}% of clicks were unique
              </span>
              <span className="text-sm font-medium">
                {clicks.unique_subscriber_clicks.toLocaleString()} subscribers
                clicked
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Last clicked {lastClickRelative}
            </div>
          </div>
        </div>
      }
    />
  );
}
```

**What changed:**

- 63 lines → ~50 lines (13 lines saved)
- Kept: Both calculation functions (needed for footer)
- Removed: Manual Card structure
- Added: StatsGridCard with 3-column stats array
- Added: Complex `footer` prop that preserves all original context
- Set `columns={3}` for horizontal metrics display
- Preserved: All styling including `border-t` separator

**Key insight:** The footer prop accepts any React node, so we can copy the entire original footer section (including complex layouts, borders, and multiple elements) directly into it.

---

### Step 3: Verify Complete File

**Expected final file structure:**

```tsx
/**
 * Campaign Report Clicks Card Component
 * Displays email click statistics
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

"use client";

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ClicksCardProps } from "@/types/components/dashboard/reports";

export function ClicksCard({ clicks }: ClicksCardProps) {
  // Format last click date as a relative time (e.g., "2 days ago")
  const lastClickDate = new Date(clicks.last_click);
  const lastClickRelative = formatDistanceToNow(lastClickDate, {
    addSuffix: true,
  });

  // Calculate percentage of unique clicks vs total clicks
  const uniqueClickPercentage =
    clicks.clicks_total > 0
      ? ((clicks.unique_clicks / clicks.clicks_total) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Clicks"
      icon={MousePointer}
      iconColor="text-green-500"
      stats={[
        {
          value: clicks.clicks_total.toLocaleString(),
          label: "Total Clicks",
        },
        {
          value: clicks.unique_clicks.toLocaleString(),
          label: "Unique Clicks",
        },
        {
          value: `${(clicks.click_rate * 100).toFixed(1)}%`,
          label: "Click Rate",
        },
      ]}
      columns={3}
      footer={
        <div className="pt-2 border-t">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {uniqueClickPercentage}% of clicks were unique
              </span>
              <span className="text-sm font-medium">
                {clicks.unique_subscriber_clicks.toLocaleString()} subscribers
                clicked
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Last clicked {lastClickRelative}
            </div>
          </div>
        </div>
      }
    />
  );
}
```

**File size:** 76 lines → ~63 lines (13 lines saved)

**Note:** The `"use client"` directive is preserved because `formatDistanceToNow` from date-fns may require client-side execution.

---

## Validation

### Step 1: Type Check

```bash
pnpm type-check
```

**Expected:** No TypeScript errors

---

### Step 2: Manual Testing

```bash
# Start dev server
pnpm dev
```

**Navigate to:** Campaign report page with click data (e.g., `/mailchimp/reports/[id]`)

**Test checklist:**

- [ ] **Card displays:** Email Clicks card appears
- [ ] **Icon visible:** Green MousePointer icon shows in header
- [ ] **Title correct:** "Email Clicks" title displays
- [ ] **3 metrics show horizontally:**
  - Total Clicks (left, formatted number)
  - Unique Clicks (middle, formatted number)
  - Click Rate (right, percentage with 1 decimal)
- [ ] **Border separator:** Top border shows above footer content
- [ ] **Footer line 1:** Shows unique click percentage and subscribers clicked
- [ ] **Footer line 2:** Shows "Last clicked [time] ago" text aligned right
- [ ] **Date formatting:** Relative time displays correctly (e.g., "2 days ago")
- [ ] **Calculations correct:**
  - uniqueClickPercentage = (unique_clicks / clicks_total) \* 100
  - Click rate shows as percentage
- [ ] **Styling intact:** Card matches styling of other cards
- [ ] **No console errors:** Check browser console

**Edge cases to test:**

1. Campaign with 0 clicks (all values should be 0 or 0%)
2. Campaign with many clicks (number formatting should work)
3. Campaign clicked very recently (should show "a few seconds ago" or similar)
4. Campaign clicked long ago (should show "X months ago")

---

### Step 3: Run Tests

```bash
# Run all tests
pnpm test
```

**Expected:** All tests pass

---

## Checkpoint: COMMIT

Once all validation passes:

```bash
# Stage the changed file
git add src/components/dashboard/reports/ClicksCard.tsx

# Commit with descriptive message
git commit -m "refactor(dashboard): migrate ClicksCard to StatsGridCard

- Replace custom Card structure with StatsGridCard
- Use 3-column layout for horizontal metrics display
- Preserve complex footer with calculations and date formatting
- Maintain border separator styling in footer
- Reduce boilerplate by ~60 lines
- Keep all functionality including date-fns formatting"

# Verify commit
git log --oneline -1
```

---

## Verification Checklist

Before proceeding to Phase 4:

- [ ] ✅ TypeScript compiles without errors
- [ ] ✅ All tests pass
- [ ] ✅ Manual testing confirms card displays correctly
- [ ] ✅ All 3 metrics show with proper formatting
- [ ] ✅ Footer shows all context (unique %, subscriber count, last clicked)
- [ ] ✅ Date formatting works correctly
- [ ] ✅ Border separator displays properly
- [ ] ✅ Icon and styling match original
- [ ] ✅ No console errors in browser
- [ ] ✅ Code committed to git
- [ ] ✅ ~60 lines of boilerplate removed

---

## Key Learnings from This Phase

**Complex footer content:**

The `footer` prop can contain:

- Multiple nested divs with complex layouts
- Flexbox layouts with justify-between, space-y, etc.
- Border styling (`border-t`, `pt-2`, etc.)
- Multiple pieces of information with different text sizes
- Formatted dates, percentages, and other calculated values

**Pattern for complex footers:**

```tsx
<StatsGridCard
  stats={[...]}
  footer={
    <div className="pt-2 border-t">
      <div className="flex flex-col space-y-2">
        {/* Multiple rows of complex content */}
      </div>
    </div>
  }
/>
```

**When to keep calculations:**

Keep calculations in the component body when:

- They're used in the footer prop
- They depend on props that might change
- They need to be recalculated on every render

Don't try to inline complex calculations directly in the JSX—keep them as variables for readability.

---

## ✅ Phase 3 Complete

**Achievements:**

- ✅ Successfully migrated ClicksCard to StatsGridCard
- ✅ Reduced boilerplate by ~60 lines
- ✅ Learned how to handle complex footer content with multiple sections
- ✅ Preserved date formatting and calculations

**Progress:**

- 3 of 4 components migrated
- ~180 of ~210 lines saved (86%)
- One component remaining (ListStats)

**Next Steps:**

Continue with [Phase 4: Migrate ListStats](phase-4-list-stats.md)

---

**Previous:** [Phase 2: Migrate ForwardsCard](phase-2-forwards.md) | **Next:** [Phase 4: Migrate ListStats](phase-4-list-stats.md)
