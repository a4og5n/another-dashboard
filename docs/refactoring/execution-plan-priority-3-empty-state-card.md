# Execution Plan: Create Generic Empty State Card Component (Priority 3)

**Task Reference:** [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 3
**Estimated Effort:** 2-3 hours
**Created:** 2025-10-19

---

## Overview

**Goal:** Create a reusable `EmptyStateCard` component to eliminate duplicate empty state implementations across the dashboard, reducing code duplication and ensuring consistent UX patterns.

**Success Criteria:**

- [ ] Generic `EmptyStateCard` component created and tested
- [ ] 3 empty state components refactored to use the new component
- [ ] ~100 lines of duplicate code removed
- [ ] All tests pass
- [ ] No visual regressions
- [ ] Component supports multiple variants (empty, success, error)

**Files to Create:**

**Types:**

- `src/types/components/ui/empty-state-card.ts` - EmptyStateCard prop types with JSDoc
- Update `src/types/components/ui/index.ts` - Export empty state card types

**Implementation:**

- `src/components/ui/empty-state-card.tsx` - Generic empty state card component
- Update `src/components/ui/index.ts` - Export EmptyStateCard component

**Files to Modify:**

- `src/components/dashboard/reports/CampaignOpensEmpty.tsx` - Use EmptyStateCard (~50 lines reduced)
- `src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx` - Use EmptyStateCard (~45 lines reduced)
- `src/components/dashboard/shared/dashboard-error.tsx` - Use EmptyStateCard (~35 lines reduced)

**Note:** `mailchimp-empty-state.tsx` is NOT included in this refactoring as it has unique OAuth flow logic, feature cards, and complex state management that don't fit the simple empty state pattern.

---

## Pre-Implementation Checklist

Before starting:

- [ ] Review [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) Priority 3 section
- [ ] Understand current empty state implementations (read 3 target files)
- [ ] Review project Card component patterns (`Card`, `CardContent` from shadcn/ui)
- [ ] Review project Button component (`Button` from shadcn/ui)
- [ ] Understand Lucide React icon usage patterns
- [ ] Verify environment setup (dependencies installed, dev server can start)

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

- ✅ **If on `main` branch:** Proceed to Step 1b to create feature branch
- ❌ **If on different feature branch:** Confirm with user before proceeding

**Step 1b: Create Feature Branch**

**Run these commands:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b refactor/empty-state-card

# Verify you're on the correct branch
git branch --show-current
# Should output: refactor/empty-state-card (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to empty state
git log --oneline --all --grep="empty"
git log --oneline --all --grep="EmptyStateCard"

# Check if key files already exist
ls src/components/ui/empty-state-card.tsx 2>/dev/null && echo "File exists!" || echo "File doesn't exist"
ls src/types/components/ui/empty-state-card.ts 2>/dev/null && echo "File exists!" || echo "File doesn't exist"
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

- [ ] Reviewed Priority 3 section in component-dry-refactoring-plan.md
- [ ] Understand the common empty state pattern to extract
- [ ] Know which 3 files need to be refactored
- [ ] Understand the import pattern to use (`@/components/ui/empty-state-card`)
- [ ] Know where to define types (`src/types/components/ui/`)

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version
pnpm --version

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (don't keep running)
pnpm dev
# Press Ctrl+C to stop after confirming it starts
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for empty state card refactoring"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Create EmptyStateCard Component and Types

**Goal:** Create the reusable EmptyStateCard component with full TypeScript typing and variant support

**Estimated Time:** 45 minutes

**Pre-Phase Checklist:**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify empty-state-card.tsx doesn't exist: `ls src/components/ui/empty-state-card.tsx`
- [ ] If phase is already complete, inform user and ask for next steps

**Implementation Steps:**

### Step 1: Analyze Current Implementations

Read the three target files to identify the common pattern:

```bash
# Use Read tool to examine:
# - src/components/dashboard/reports/CampaignOpensEmpty.tsx
# - src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx
# - src/components/dashboard/shared/dashboard-error.tsx
```

**Common Pattern Identified:**

- Card wrapper with `CardContent`
- Centered flex column layout (`flex flex-col items-center justify-center py-12`)
- Icon container with rounded background and color variants
- Title (h3 with `text-lg font-semibold mb-2`)
- Message paragraph (muted text, centered, max-width)
- Action buttons in flex row

**Variants Needed:**

- **Default/Empty:** Muted background, muted icon (CampaignOpensEmpty)
- **Success:** Green background, green icon (CampaignAbuseReportsEmpty)
- **Error:** Destructive background, destructive icon (DashboardError)

### Step 2: Create Type Definitions

Create `src/types/components/ui/empty-state-card.ts`:

```typescript
/**
 * Types for EmptyStateCard component
 *
 * Generic empty state card component for consistent empty/error states across the dashboard
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Visual variant for the empty state card
 * - empty: Default muted styling for empty states
 * - success: Green styling for positive empty states (e.g., no spam reports)
 * - error: Red styling for error states
 */
export type EmptyStateVariant = "empty" | "success" | "error";

/**
 * Props for the EmptyStateCard component
 */
export interface EmptyStateCardProps {
  /**
   * Lucide icon component to display in the icon container
   * @example Mail, ShieldCheck, AlertCircle
   */
  icon: LucideIcon;

  /**
   * Title text displayed prominently
   */
  title: string;

  /**
   * Descriptive message text
   */
  message: string;

  /**
   * Visual variant of the card
   * @default "empty"
   */
  variant?: EmptyStateVariant;

  /**
   * Optional action elements (buttons, links) displayed at the bottom
   * @example <Button>Try Again</Button>
   */
  actions?: ReactNode;

  /**
   * Optional additional CSS classes for the card wrapper
   */
  className?: string;
}
```

Update `src/types/components/ui/index.ts` to export the new types:

```typescript
/**
 * UI component types
 */
export * from "@/types/components/ui/card";
export * from "@/types/components/ui/empty-state-card";
```

### Step 3: Create EmptyStateCard Component

Create `src/components/ui/empty-state-card.tsx`:

```typescript
/**
 * EmptyStateCard Component
 * Generic empty state card for consistent empty/error states across the dashboard
 *
 * Features:
 * - Multiple visual variants (empty, success, error)
 * - Icon with colored background
 * - Title and message
 * - Optional action buttons/links
 *
 * Usage:
 * @example
 * ```tsx
 * <EmptyStateCard
 *   icon={Mail}
 *   variant="empty"
 *   title="No Data Available"
 *   message="There's no data to display at this time."
 *   actions={
 *     <>
 *       <Button onClick={handleRetry}>Try Again</Button>
 *       <Button variant="outline">Go Back</Button>
 *     </>
 *   }
 * />
 * ```
 */

import { Card, CardContent } from "@/components/ui/card";
import type { EmptyStateCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";

/**
 * Get variant-specific styling for icon container and icon
 */
function getVariantStyles(variant: "empty" | "success" | "error") {
  const styles = {
    empty: {
      container: "bg-muted",
      icon: "text-muted-foreground",
    },
    success: {
      container: "bg-green-100 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
    },
    error: {
      container: "bg-destructive/10",
      icon: "text-destructive",
    },
  };

  return styles[variant];
}

/**
 * Generic empty state card component
 */
export function EmptyStateCard({
  icon: Icon,
  title,
  message,
  variant = "empty",
  actions,
  className,
}: EmptyStateCardProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {/* Icon Container */}
        <div
          className={cn(
            "rounded-full p-3 mb-4",
            variantStyles.container
          )}
        >
          <Icon className={cn("h-8 w-8", variantStyles.icon)} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>

        {/* Message */}
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message}
        </p>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

Update `src/components/ui/index.ts` to export the component:

```typescript
/**
 * UI components barrel export
 */
export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./empty-state-card";
export * from "./stat-card";
export * from "./stats-grid-card";
export * from "./status-card";
// ... other exports
```

### Step 4: Validation

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Check for any issues
```

**Expected:** No errors, all checks pass

**Checkpoint: COMMIT**

```bash
git add src/components/ui/empty-state-card.tsx src/types/components/ui/empty-state-card.ts src/types/components/ui/index.ts src/components/ui/index.ts
git commit -m "feat(ui): create EmptyStateCard component with variants

- Add EmptyStateCard component for consistent empty states
- Support 3 variants: empty, success, error
- Add TypeScript types with JSDoc documentation
- Include icon, title, message, and actions support
- Variant-specific styling for icon container"
```

---

## Phase 2: Refactor Empty State Components

**Goal:** Update 3 existing empty state components to use the new EmptyStateCard

**Estimated Time:** 45 minutes

**Pre-Phase Checklist:**

- [ ] Phase 1 complete (EmptyStateCard component exists and is committed)
- [ ] Check git log to see if this phase is already done

**Implementation Steps:**

We'll update each component one at a time to make the changes manageable and testable.

### Step 1: Refactor CampaignOpensEmpty

**File:** `src/components/dashboard/reports/CampaignOpensEmpty.tsx`

**Current:** 74 lines with full Card/CardContent implementation

**Target:** ~20-30 lines using EmptyStateCard

**Changes:**

1. Import `EmptyStateCard` from `@/components/ui`
2. Import type from `@/types/components/ui` if needed
3. Replace Card implementation with EmptyStateCard
4. Pass icon, title, message as props
5. Pass buttons as `actions` prop (wrapped in fragment)

**New Implementation:**

```typescript
/**
 * Campaign Opens Empty Component
 * Empty state component for when campaign opens data is not available
 */

import { EmptyStateCard } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CampaignOpensEmptyProps {
  /** Campaign ID for navigation links */
  campaignId: string;
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
  /** Optional retry handler */
  onRetry?: () => void;
}

export function CampaignOpensEmpty({
  campaignId,
  title,
  message,
  onRetry,
}: CampaignOpensEmptyProps) {
  return (
    <EmptyStateCard
      icon={Mail}
      variant="empty"
      title={title || "No Opens Data Available"}
      message={
        message ||
        "There's no opens data available for this campaign. This could mean the campaign hasn't been opened yet, or there might be an issue loading the data."
      }
      actions={
        <>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/mailchimp/campaigns/${campaignId}/report`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/mailchimp/campaigns">View All Campaigns</Link>
          </Button>
        </>
      }
    />
  );
}
```

**Lines reduced:** ~74 → ~30 = **44 lines saved**

### Step 2: Refactor CampaignAbuseReportsEmpty

**File:** `src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx`

**Current:** 64 lines with Card implementation

**Target:** ~20-25 lines using EmptyStateCard

**New Implementation:**

```typescript
/**
 * Campaign Abuse Reports Empty Component
 * Empty state component for when campaign has no abuse/spam complaints
 */

import { EmptyStateCard } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CampaignAbuseReportsEmptyProps {
  /** Campaign ID for navigation links */
  campaignId: string;
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
}

export function CampaignAbuseReportsEmpty({
  campaignId,
  title,
  message,
}: CampaignAbuseReportsEmptyProps) {
  return (
    <EmptyStateCard
      icon={ShieldCheck}
      variant="success"
      title={title || "No Abuse Reports"}
      message={
        message ||
        "Great news! This campaign has no spam complaints. Your subscribers are engaging positively with your content."
      }
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/mailchimp/reports/${campaignId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/mailchimp/reports">View All Reports</Link>
          </Button>
        </>
      }
    />
  );
}
```

**Lines reduced:** ~64 → ~25 = **39 lines saved**

### Step 3: Refactor DashboardError

**File:** `src/components/dashboard/shared/dashboard-error.tsx`

**Current:** 58 lines with Card implementation and wrapper div

**Target:** ~30 lines using EmptyStateCard

**Note:** This component has a wrapper div for centering that we should preserve.

**New Implementation:**

```typescript
/**
 * Dashboard Error Component
 * Generic error state for dashboard pages
 */

import { EmptyStateCard } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import React from "react";

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
  onGoHome: () => void;
  isRefreshing?: boolean;
}

export function DashboardError({
  error,
  onRetry,
  onGoHome,
  isRefreshing,
}: DashboardErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <EmptyStateCard
        icon={RefreshCw}
        variant="error"
        title="Dashboard Error"
        message={error}
        className="w-full max-w-md mx-4"
        actions={
          <>
            <Button
              onClick={onRetry}
              variant="default"
              className="gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Button>
            <Button onClick={onGoHome} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Button>
          </>
        }
      />
    </div>
  );
}
```

**Lines reduced:** ~58 → ~30 = **28 lines saved**

### Validation After Each Update

After updating each file:

```bash
# Type check to ensure no TypeScript errors
pnpm type-check

# Quick lint check
pnpm lint
```

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/reports/CampaignOpensEmpty.tsx src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx src/components/dashboard/shared/dashboard-error.tsx
git commit -m "refactor(components): use EmptyStateCard in empty state components

- Refactor CampaignOpensEmpty to use EmptyStateCard (~44 lines saved)
- Refactor CampaignAbuseReportsEmpty to use EmptyStateCard (~39 lines saved)
- Refactor DashboardError to use EmptyStateCard (~28 lines saved)
- Total: ~111 lines of duplicate code removed
- All components now use centralized empty state pattern"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phase 1 & 2 are complete and committed
- EmptyStateCard component is created and being used
- Next phase is independent validation and testing

📋 What to keep:

- This execution plan document
- Current task: "Phase 3 - Validation and testing"

---

## Phase 3: Validation and Testing

**Goal:** Ensure all components render correctly with no visual regressions

**Estimated Time:** 30 minutes

**Implementation Steps:**

### Step 1: Run Full Type Check and Linting

```bash
# Full type check
pnpm type-check

# Full lint check
pnpm lint

# Fix any auto-fixable issues
pnpm lint:fix
```

**Expected:** All checks pass

### Step 2: Run Tests

```bash
# Run all tests
pnpm test

# Run architectural enforcement tests
pnpm test src/test/architectural-enforcement/
```

**Expected:** All tests pass

### Step 3: Manual Testing in Browser

**Start the development server:**

```bash
pnpm dev
```

**Test each refactored component:**

1. **CampaignOpensEmpty - Campaign Opens Page:**
   - Navigate to: `/mailchimp/reports/[campaign-id]/opens`
   - Test with campaign that has no opens data
   - Verify:
     - [ ] Icon (Mail) displays with muted background
     - [ ] Title shows "No Opens Data Available"
     - [ ] Message text displays correctly
     - [ ] "Try Again" button works (if onRetry provided)
     - [ ] "Back to Report" button links correctly
     - [ ] "View All Campaigns" button links correctly
     - [ ] Layout is centered and matches previous design

2. **CampaignAbuseReportsEmpty - Abuse Reports Page:**
   - Navigate to: `/mailchimp/reports/[campaign-id]/abuse-reports`
   - Test with campaign that has no abuse reports
   - Verify:
     - [ ] Icon (ShieldCheck) displays with green background
     - [ ] Title shows "No Abuse Reports"
     - [ ] Positive message displays correctly
     - [ ] "Back to Report" button links correctly
     - [ ] "View All Reports" button links correctly
     - [ ] Success styling (green) is applied

3. **DashboardError - Error States:**
   - Trigger error state on dashboard (simulate API error)
   - Verify:
     - [ ] Icon (RefreshCw) displays with red/destructive background
     - [ ] Title shows "Dashboard Error"
     - [ ] Error message displays correctly
     - [ ] "Try Again" button works and shows loading state
     - [ ] "Go Home" button works
     - [ ] Error styling (red) is applied
     - [ ] Wrapper div centers component correctly

### Step 4: Check for Console Errors

Open browser DevTools console and verify:

- [ ] No React errors
- [ ] No import errors
- [ ] No runtime errors
- [ ] No prop type warnings

### Step 5: Verify Code Reduction

```bash
# Check the diff to see lines removed
git diff main --stat

# Should show:
# - Negative lines for the 3 refactored components
# - Positive lines for new EmptyStateCard component and types
```

**Expected:** Net reduction of approximately 111 lines (44 + 39 + 28) from the 3 components

### Step 6: Run Format Check

```bash
# Check formatting
pnpm format:check

# If formatting issues, fix them
pnpm format
```

**Validation:**

- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting passes: `pnpm format:check`
- [ ] All tests pass: `pnpm test`
- [ ] All 3 components render correctly in browser
- [ ] No visual regressions confirmed
- [ ] Icon colors match original implementations
- [ ] Button actions work correctly
- [ ] No console errors
- [ ] Code is cleaner and more maintainable

**Checkpoint: COMMIT** (if any fixes were needed)

```bash
# Only if you had to make fixes
git add .
git commit -m "fix: address issues found during validation"
```

---

## Phase 4: Final Validation and PR Preparation

**Goal:** Run full validation suite and prepare for PR

**Estimated Time:** 20 minutes

**Implementation Steps:**

### Step 1: Run Full Validation

```bash
# Run type check
pnpm type-check

# Run linting
pnpm lint

# Run tests
pnpm test

# Run format check
pnpm format:check
```

**Expected:** All checks pass

### Step 2: Review All Changes

```bash
# Review commit history
git log --oneline main..HEAD

# Review all changes
git diff main

# Check stats on what changed
git diff main --stat
```

**Verify:**

- [ ] Only the expected files were modified
- [ ] Commit messages follow conventions
- [ ] No unintended changes were included

### Step 3: Final Manual Review Checklist

- [ ] **Code Quality**
  - [ ] All imports use path aliases (`@/components/ui`, `@/types/components/ui`)
  - [ ] EmptyStateCard component is well-documented
  - [ ] Type definitions have JSDoc comments
  - [ ] No console.logs or debug statements
  - [ ] Follows project conventions

- [ ] **Testing**
  - [ ] All tests pass
  - [ ] Manual browser testing completed for all 3 components
  - [ ] No visual regressions confirmed
  - [ ] All variants tested (empty, success, error)

- [ ] **Git**
  - [ ] Commit messages follow conventions
  - [ ] All changes staged and committed
  - [ ] On correct branch: `git branch --show-current`

---

## Push to Origin

```bash
# Final validation before push
pnpm type-check && pnpm lint && pnpm format:check

# Review commit history one more time
git log --oneline main..HEAD

# Push to origin
git push -u origin refactor/empty-state-card
```

---

## Create Pull Request

**Title:** `refactor: create generic EmptyStateCard component`

**Description:**

```markdown
## Summary

Implements Priority 3 from [component-dry-refactoring-plan.md](https://github.com/a4og5n/another-dashboard/blob/main/docs/refactoring/component-dry-refactoring-plan.md). Creates a reusable EmptyStateCard component to eliminate duplicate empty state implementations.

## Changes

### New Component Created

- **`src/components/ui/empty-state-card.tsx`** - Generic empty state card component
  - Supports 3 variants: `empty`, `success`, `error`
  - Props: `icon`, `title`, `message`, `variant`, `actions`, `className`
  - Variant-specific styling for icon containers
  - Flexible action slot for buttons/links
- **`src/types/components/ui/empty-state-card.ts`** - TypeScript types with JSDoc

### Components Refactored

Refactored 3 empty state components to use EmptyStateCard:

- `src/components/dashboard/reports/CampaignOpensEmpty.tsx` (~44 lines removed)
- `src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx` (~39 lines removed)
- `src/components/dashboard/shared/dashboard-error.tsx` (~28 lines removed)

### Additional Improvements

- **Architecture Compliance:** Types in `/src/types` folder with subfolder organization
- **Documentation:** JSDoc comments on all type definitions
- **Variant System:** Consistent color scheme (muted, green, destructive)
- **Flexibility:** Actions prop accepts any ReactNode for custom button layouts

## Impact

- **Code Reduction:** ~111 lines of duplicate code removed
- **New Component Code:** ~90 lines of centralized, reusable component
- **Maintainability:** ⬆️ Single component for all empty states
- **Consistency:** ✅ Uniform UX pattern across dashboard
- **DRY Principle:** ✅ Eliminates Card/CardContent duplication

## Testing

- [ ] All tests pass: XXX/XXX tests passing
- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting passes: `pnpm format:check`
- [ ] Manual testing completed for all 3 refactored components
- [ ] All 3 variants tested (empty, success, error)
- [ ] No visual regressions confirmed
- [ ] No console errors in browser

## Pages Tested Manually

- [ ] `/mailchimp/reports/[id]/opens` - Campaign opens empty state (variant: empty)
- [ ] `/mailchimp/reports/[id]/abuse-reports` - Abuse reports empty state (variant: success)
- [ ] Dashboard error pages - Error state (variant: error)
- [ ] Button actions work correctly (links, retry handlers)
- [ ] Responsive layout works on mobile and desktop

## Checklist

- [ ] Code follows project architectural patterns
- [ ] All imports use path aliases
- [ ] Types defined in `src/types/components/ui/`
- [ ] JSDoc documentation added to types
- [ ] No breaking changes
- [ ] All duplicate code removed from refactored components
- [ ] Manual testing completed with no regressions
- [ ] All commits follow conventional commit format

## Related Documentation

- **Refactoring Plan:** [docs/refactoring/component-dry-refactoring-plan.md](https://github.com/a4og5n/another-dashboard/blob/main/docs/refactoring/component-dry-refactoring-plan.md) - Priority 3
- **Execution Plan:** [docs/refactoring/execution-plan-priority-3-empty-state-card.md](https://github.com/a4og5n/another-dashboard/blob/refactor/empty-state-card/docs/refactoring/execution-plan-priority-3-empty-state-card.md)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Rollback Plan

If issues are discovered after merging:

```bash
# If not pushed yet - reset to main
git reset --hard main

# If pushed but not merged - delete branch and start over
git push origin --delete refactor/empty-state-card
git branch -D refactor/empty-state-card

# If merged and issues found - create revert commit
git revert <merge-commit-hash>
git push
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d refactor/empty-state-card`
- [ ] Delete feature branch remotely: `git push origin --delete refactor/empty-state-card`
- [ ] Update component-dry-refactoring-plan.md to mark Priority 3 as complete
- [ ] Close the GitHub Issue for Priority 3 (if created)
- [ ] Celebrate! 🎉 111+ lines of duplicate code eliminated

---

**End of Execution Plan**

---

## Summary

This execution plan will:

1. ✅ Create a feature branch for safe development
2. ✅ Create a reusable EmptyStateCard component with 3 variants
3. ✅ Add proper TypeScript types with JSDoc documentation
4. ✅ Refactor 3 empty state components to use the new component
5. ✅ Remove ~111 lines of duplicate code
6. ✅ Ensure no visual or functional regressions through testing
7. ✅ Create a clean, reviewable PR

**Estimated Total Time:** 2-3 hours

**Key Benefits:**

- Consistent empty state UX across dashboard
- Single source of truth for empty state styling
- Reduced code duplication (~111 lines)
- Easier to add new empty states (just pass props)
- Variant system for different contexts (empty, success, error)
- Better adherence to DRY principle

**Note:** `mailchimp-empty-state.tsx` is intentionally NOT included as it has unique OAuth flow logic and complex state management that doesn't fit the simple empty state pattern.
