# Phase 2: Migrate ForwardsCard

**Goal:** Migrate ForwardsCard to use StatsGridCard with 2-column grid and footer content

**Estimated Time:** 15-20 minutes

**Lines to be saved:** ~42 lines of boilerplate

---

## Pre-Phase Checklist

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify component hasn't been updated: `git log --oneline -3 -- src/components/dashboard/reports/ForwardsCard.tsx`
- [ ] Check if StatsGridCard is already imported in the file
- [ ] If phase is already complete, inform user and ask for next steps

---

## Current Implementation Analysis

**File:** [src/components/dashboard/reports/ForwardsCard.tsx](../../src/components/dashboard/reports/ForwardsCard.tsx)

**Current Structure (50 lines):**

- Lines 1-9: Imports and type definitions
- Lines 10-50: Component implementation
  - Lines 12-15: Calculate engagement rate
  - Lines 18-39: Card with 2-column grid for metrics (Total Forwards, Opens from Forwards)
  - Lines 41-46: Additional context section showing engagement rate

**Pattern:**

```tsx
<Card>
  <CardHeader>
    <CardTitle with icon>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2"> (2 metrics)
    <div> (additional context)
  </CardContent>
</Card>
```

**Challenge:** This component has additional content below the metrics grid that needs to be preserved in the footer prop.

---

## Implementation Steps

### Step 1: Update Imports

**Read the current file first:**

```bash
# Use Read tool to view the full file
```

**Modify the imports section:**

**OLD (Lines 6-7):**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share } from "lucide-react";
```

**NEW:**

```tsx
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share } from "lucide-react";
```

**What changed:**

- Removed: `Card, CardContent, CardHeader, CardTitle` imports
- Added: `StatsGridCard` import

---

### Step 2: Refactor Component Implementation

**OLD Implementation (Lines 10-50):**

```tsx
export function ForwardsCard({ forwards }: ForwardsCardProps) {
  // Calculate engagement rate from forwards (if any)
  const engagementRate =
    forwards.forwards_count > 0
      ? ((forwards.forwards_opens / forwards.forwards_count) * 100).toFixed(1)
      : "0.0";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Share className="h-4 w-4 text-blue-500" />
          <span>Email Forwards</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">
              {forwards.forwards_count.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Forwards</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {forwards.forwards_opens.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Opens from Forwards</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{engagementRate}%</span> of forwarded
            emails were opened
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

**NEW Implementation:**

```tsx
export function ForwardsCard({ forwards }: ForwardsCardProps) {
  // Calculate engagement rate from forwards (if any)
  const engagementRate =
    forwards.forwards_count > 0
      ? ((forwards.forwards_opens / forwards.forwards_count) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Forwards"
      icon={Share}
      iconColor="text-blue-500"
      stats={[
        {
          value: forwards.forwards_count.toLocaleString(),
          label: "Total Forwards",
        },
        {
          value: forwards.forwards_opens.toLocaleString(),
          label: "Opens from Forwards",
        },
      ]}
      columns={2}
      footer={
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{engagementRate}%</span> of forwarded
          emails were opened
        </p>
      }
    />
  );
}
```

**What changed:**

- 41 lines → 28 lines (13 lines saved)
- Kept: `engagementRate` calculation (needed for footer)
- Removed: Manual Card structure
- Added: StatsGridCard with 2-column stats array
- Added: `footer` prop to preserve the engagement rate context
- Set `columns={2}` for side-by-side metrics display

---

### Step 3: Verify Complete File

**Expected final file structure:**

```tsx
/**
 * Campaign Report Forwards Card Component
 * Displays email forwarding statistics
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share } from "lucide-react";
import type { ForwardsCardProps } from "@/types/components/dashboard/reports";

export function ForwardsCard({ forwards }: ForwardsCardProps) {
  // Calculate engagement rate from forwards (if any)
  const engagementRate =
    forwards.forwards_count > 0
      ? ((forwards.forwards_opens / forwards.forwards_count) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Forwards"
      icon={Share}
      iconColor="text-blue-500"
      stats={[
        {
          value: forwards.forwards_count.toLocaleString(),
          label: "Total Forwards",
        },
        {
          value: forwards.forwards_opens.toLocaleString(),
          label: "Opens from Forwards",
        },
      ]}
      columns={2}
      footer={
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{engagementRate}%</span> of forwarded
          emails were opened
        </p>
      }
    />
  );
}
```

**File size:** 50 lines → ~40 lines (10 lines saved)

**Note:** We kept the engagementRate calculation because it's used in the footer. This is a perfect example of how StatsGridCard's footer prop allows us to preserve additional context while still using the standardized component.

---

## Validation

### Step 1: Type Check

```bash
pnpm type-check
```

**Expected:** No TypeScript errors

**If errors occur:**

- Verify StatsGridCard import path
- Check that footer prop accepts ReactNode
- Verify stats array structure

---

### Step 2: Manual Testing

```bash
# Start dev server
pnpm dev
```

**Navigate to:** Campaign report page with forwards data (e.g., `/mailchimp/reports/[id]`)

**Test checklist:**

- [ ] **Card displays:** Email Forwards card appears
- [ ] **Icon visible:** Blue Share icon shows in header
- [ ] **Title correct:** "Email Forwards" title displays
- [ ] **2 metrics show side-by-side:**
  - Total Forwards (left column, formatted number)
  - Opens from Forwards (right column, formatted number)
- [ ] **Footer displays:** Engagement rate text shows below metrics
- [ ] **Footer calculation correct:** Percentage matches forwards_opens / forwards_count \* 100
- [ ] **Edge case:** If forwards_count is 0, shows "0.0%"
- [ ] **Styling intact:** Card styling matches other cards
- [ ] **No console errors:** Check browser console

**Edge cases to test:**

1. Campaign with 0 forwards (should show "0.0% of forwarded emails were opened")
2. Campaign with many forwards (number formatting should work)
3. Campaign with 100% engagement (forwards_opens = forwards_count)

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
git add src/components/dashboard/reports/ForwardsCard.tsx

# Commit with descriptive message
git commit -m "refactor(dashboard): migrate ForwardsCard to StatsGridCard

- Replace custom Card structure with StatsGridCard
- Use 2-column layout for side-by-side metrics display
- Preserve engagement rate context in footer prop
- Reduce boilerplate by ~42 lines
- Maintain all functionality and styling"

# Verify commit
git log --oneline -1
```

---

## Verification Checklist

Before proceeding to Phase 3:

- [ ] ✅ TypeScript compiles without errors
- [ ] ✅ All tests pass
- [ ] ✅ Manual testing confirms card displays correctly
- [ ] ✅ Both metrics show with proper formatting
- [ ] ✅ Footer shows engagement rate correctly
- [ ] ✅ Edge case (0 forwards) handled properly
- [ ] ✅ Icon and styling match original
- [ ] ✅ No console errors in browser
- [ ] ✅ Code committed to git
- [ ] ✅ ~42 lines of boilerplate removed

---

## Key Learnings from This Phase

**Using the footer prop:**

The `footer` prop in StatsGridCard is perfect for:

- Additional context that doesn't fit the stat format
- Calculated values derived from the main metrics
- Explanatory text or insights
- Links to related pages

**Pattern:**

```tsx
<StatsGridCard
  stats={[...]}
  footer={
    <div className="space-y-2">
      {/* Any additional content */}
    </div>
  }
/>
```

This allows us to use standardized components while preserving unique functionality for each card.

---

## 💰 Cost Optimization: CLEAR CONVERSATION

**✅ Safe to clear context now because:**

- Phases 1 & 2 are complete and committed
- Pattern is now well-established
- Next phases (3 & 4) follow the same approach
- You have checkpoints to return to if needed

**📋 What to keep after clearing:**

- Main execution plan: [docs/execution-plan-card-migrations.md](../../execution-plan-card-migrations.md)
- Phase 3 document: [phase-3-clicks.md](phase-3-clicks.md)
- Current task: "Migrate ClicksCard and ListStats components"

**How to resume:** Open the execution plan and Phase 3 document. You're ready to continue with the same pattern.

---

## ✅ Phase 2 Complete

**Achievements:**

- ✅ Successfully migrated ForwardsCard to StatsGridCard
- ✅ Reduced boilerplate by ~42 lines
- ✅ Learned how to use footer prop for additional context
- ✅ Pattern now validated across 2 components

**Progress:**

- 2 of 4 components migrated
- ~80 of ~210 lines saved (38%)
- Pattern proven and ready to scale

**Next Steps:**

Continue with [Phase 3: Migrate ClicksCard](phase-3-clicks.md)

---

**Previous:** [Phase 1: Social Engagement](phase-1-social-engagement.md) | **Next:** [Phase 3: Migrate ClicksCard](phase-3-clicks.md)
