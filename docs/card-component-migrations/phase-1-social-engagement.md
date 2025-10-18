# Phase 1: Migrate SocialEngagementCard

**Goal:** Migrate SocialEngagementCard to use StatsGridCard (simplest component - proof of concept)

**Estimated Time:** 15-20 minutes

**Lines to be saved:** ~38 lines of boilerplate

---

## Pre-Phase Checklist

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify component hasn't been updated: `git log --oneline -3 -- src/components/dashboard/reports/SocialEngagementCard.tsx`
- [ ] Check if StatsGridCard is already imported in the file
- [ ] If phase is already complete, inform user and ask for next steps

---

## Current Implementation Analysis

**File:** [src/components/dashboard/reports/SocialEngagementCard.tsx](../../src/components/dashboard/reports/SocialEngagementCard.tsx)

**Current Structure (48 lines):**

- Lines 1-12: Imports and type definitions
- Lines 13-16: Component function signature
- Lines 17-47: Custom Card with 3 metrics displayed as rows
  - Facebook Likes
  - Unique Likes
  - Recipient Likes

**Pattern:**

```tsx
<Card>
  <CardHeader>
    <CardTitle with icon>
  </CardHeader>
  <CardContent>
    <div> (3 rows of metric + value)
  </CardContent>
</Card>
```

**Target:** Replace with StatsGridCard with 3 stats in a grid layout

---

## Implementation Steps

### Step 1: Update Imports

**Read the current file first:**

```bash
# Use Read tool to view the full file
```

**Modify the imports section:**

**OLD (Lines 9-10):**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
```

**NEW:**

```tsx
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share2 } from "lucide-react";
```

**What changed:**

- Removed: `Card, CardContent, CardHeader, CardTitle` imports
- Added: `StatsGridCard` import

---

### Step 2: Simplify Component Implementation

**OLD Implementation (Lines 17-47):**

```tsx
return (
  <Card className={className}>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center space-x-2">
        <Share2 className="h-4 w-4 text-purple-600" />
        <span>Social Engagement</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Facebook Likes</span>
        <span className="font-medium">
          {facebookLikes.facebook_likes.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Unique Likes</span>
        <span className="font-medium">
          {facebookLikes.unique_likes.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Recipient Likes</span>
        <span className="font-medium">
          {facebookLikes.recipient_likes.toLocaleString()}
        </span>
      </div>
    </CardContent>
  </Card>
);
```

**NEW Implementation:**

```tsx
return (
  <StatsGridCard
    title="Social Engagement"
    icon={Share2}
    iconColor="text-purple-600"
    stats={[
      {
        value: facebookLikes.facebook_likes.toLocaleString(),
        label: "Facebook Likes",
      },
      {
        value: facebookLikes.unique_likes.toLocaleString(),
        label: "Unique Likes",
      },
      {
        value: facebookLikes.recipient_likes.toLocaleString(),
        label: "Recipient Likes",
      },
    ]}
    columns={1}
    className={className}
  />
);
```

**What changed:**

- 31 lines → 20 lines (11 lines saved in component)
- Removed: Manual Card structure
- Added: StatsGridCard with declarative stats array
- Set `columns={1}` to maintain vertical layout (like original row-based display)
- All functionality preserved (icon, formatting, styling)

---

### Step 3: Verify Complete File

**Expected final file structure (Lines 1-36):**

```tsx
/**
 * Social Engagement Card Component
 * Displays social media engagement metrics for email campaigns
 *
 * Issue #135: Campaign report detail UI components - Social Engagement Card
 * Following established patterns from existing dashboard components
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share2 } from "lucide-react";
import type { SocialEngagementCardProps } from "@/types/components/dashboard/reports";

export function SocialEngagementCard({
  facebookLikes,
  className,
}: SocialEngagementCardProps) {
  return (
    <StatsGridCard
      title="Social Engagement"
      icon={Share2}
      iconColor="text-purple-600"
      stats={[
        {
          value: facebookLikes.facebook_likes.toLocaleString(),
          label: "Facebook Likes",
        },
        {
          value: facebookLikes.unique_likes.toLocaleString(),
          label: "Unique Likes",
        },
        {
          value: facebookLikes.recipient_likes.toLocaleString(),
          label: "Recipient Likes",
        },
      ]}
      columns={1}
      className={className}
    />
  );
}
```

**File size:** 48 lines → ~36 lines (12 lines saved including import reduction)

---

## Validation

### Step 1: Type Check

```bash
pnpm type-check
```

**Expected:** No TypeScript errors

**If errors occur:**

- Verify StatsGridCard import path is correct
- Verify stats array structure matches `StatGridItem[]` type
- Check that all required props are provided

---

### Step 2: Manual Testing

```bash
# Start dev server
pnpm dev
```

**Navigate to:** Any campaign report page that shows social engagement (e.g., `/mailchimp/reports/[id]`)

**Test checklist:**

- [ ] **Card displays:** Social Engagement card appears
- [ ] **Icon visible:** Purple Share2 icon shows in header
- [ ] **Title correct:** "Social Engagement" title displays
- [ ] **All 3 metrics show:**
  - Facebook Likes (with number formatted)
  - Unique Likes (with number formatted)
  - Recipient Likes (with number formatted)
- [ ] **Layout correct:** Metrics display in vertical layout (1 column)
- [ ] **Styling intact:** Card styling matches other cards on page
- [ ] **No console errors:** Check browser console for errors

**Visual comparison:**

- Compare with other cards on the page (e.g., EmailsSentCard which uses StatCard)
- Verify consistent spacing and alignment
- Verify hover states work (if applicable)

---

### Step 3: Accessibility Check

```bash
# Run accessibility tests
pnpm test:a11y
```

**Expected:** All accessibility tests pass

**If failures occur:**

- Check that semantic HTML is preserved
- Verify ARIA labels if present
- Ensure keyboard navigation works

---

### Step 4: Run All Tests

```bash
# Run all tests to ensure nothing broke
pnpm test
```

**Expected:** All tests pass

**If failures occur:**

- Check if there are specific tests for SocialEngagementCard
- Review error messages to identify the issue
- Fix and re-test

---

## Checkpoint: COMMIT

Once all validation passes:

```bash
# Stage the changed file
git add src/components/dashboard/reports/SocialEngagementCard.tsx

# Commit with descriptive message
git commit -m "refactor(dashboard): migrate SocialEngagementCard to StatsGridCard

- Replace custom Card structure with StatsGridCard
- Reduce boilerplate by ~38 lines
- Maintain all functionality and styling
- Use 1-column layout to match original vertical display
- Improve consistency with other dashboard cards"

# Verify commit
git log --oneline -1
```

**Expected output:** Commit created with message starting with "refactor(dashboard): migrate SocialEngagementCard..."

---

## Verification Checklist

Before proceeding to Phase 2:

- [ ] ✅ TypeScript compiles without errors
- [ ] ✅ All tests pass (unit + accessibility)
- [ ] ✅ Manual testing confirms card displays correctly
- [ ] ✅ All 3 metrics show with proper formatting
- [ ] ✅ Icon and styling match original implementation
- [ ] ✅ No console errors in browser
- [ ] ✅ Code committed to git
- [ ] ✅ ~38 lines of boilerplate removed

---

## Troubleshooting

**Issue: StatsGridCard not found**

- Verify import path: `@/components/ui/stats-grid-card`
- Check that StatsGridCard was created in PR #192
- Run `ls src/components/ui/stats-grid-card.tsx` to confirm file exists

**Issue: TypeScript errors about stats prop**

- Verify stats array structure matches:
  ```tsx
  stats: Array<{ value: string | number; label: string }>;
  ```
- Check that all properties are provided

**Issue: Layout looks wrong**

- Verify `columns={1}` is set (for vertical layout like original)
- Try `columns={3}` if you want horizontal layout
- Check that className prop is passed through

**Issue: Numbers not formatting**

- Verify `.toLocaleString()` is called on numeric values
- Check that values aren't undefined

---

## ✅ Phase 1 Complete

**Achievements:**

- ✅ Successfully migrated SocialEngagementCard to StatsGridCard
- ✅ Reduced boilerplate by ~38 lines
- ✅ All functionality preserved
- ✅ Pattern validated for next migrations

**Next Steps:**

Continue with [Phase 2: Migrate ForwardsCard](phase-2-forwards.md)

---

**Previous:** [Phase 0: Git Setup](phase-0-setup.md) | **Next:** [Phase 2: Migrate ForwardsCard](phase-2-forwards.md)
