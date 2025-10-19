# Execution Plan: Extract Table Pagination Hook (Priority 2)

**Task Reference:** [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 2
**Estimated Effort:** 2-3 hours
**Created:** 2025-10-19

---

## Overview

**Goal:** Extract duplicated URL pagination logic from 2 table components into a shared hook to eliminate 120+ lines of duplicate code and improve maintainability.

**Success Criteria:**

- [ ] Custom hook created and tested
- [ ] Both table components updated to use shared hook
- [ ] ~60 lines of duplicate URL generation code removed (30 lines × 2 files)
- [ ] ~10 lines of duplicate badge functions removed (5 lines × 2 files)
- [ ] All tests pass
- [ ] No visual regressions

**Files to Create:**

**Hooks:**
- `src/hooks/use-table-pagination.ts` - Custom hook for table pagination URL management
- `src/components/ui/helpers/badge-utils.tsx` - Shared badge utility functions

**Files to Modify:**

- `src/components/dashboard/reports/CampaignOpensTable.tsx` - Use shared hook and badge utilities
- `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx` - Use shared hook and badge utilities

---

## Pre-Implementation Checklist

Before starting:

- [ ] Review [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) Priority 2 section
- [ ] Understand current table component implementations
- [ ] Review project architectural standards (CLAUDE.md)
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
git checkout -b refactor/table-pagination-hook

# Verify you're on the correct branch
git branch --show-current
# Should output: refactor/table-pagination-hook (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to table pagination
git log --oneline --all --grep="table"
git log --oneline --all --grep="pagination"

# Check if key files already exist
ls src/hooks/use-table-pagination.ts 2>/dev/null && echo "File exists!" || echo "File doesn't exist"
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

- [ ] Reviewed Priority 2 section in component-dry-refactoring-plan.md
- [ ] Understand what functions need to be extracted (URL generation, badge functions)
- [ ] Know which 2 files need to be updated
- [ ] Understand the import pattern to use (`@/hooks/use-table-pagination`)

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
git commit --allow-empty -m "chore: initialize feature branch for table pagination hook refactoring"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Create Custom Hook and Badge Utilities

**Goal:** Create the shared use-table-pagination hook and badge utilities

**Estimated Time:** 45 minutes

**Pre-Phase Checklist:**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify use-table-pagination.ts doesn't exist: `ls src/hooks/use-table-pagination.ts`
- [ ] If phase is already complete, inform user and ask for next steps

**Implementation Steps:**

### Step 1: Read Existing Implementations

First, examine the duplicate code we'll be extracting:

Use the Read tool to examine:
- `src/components/dashboard/reports/CampaignOpensTable.tsx` (lines 52-79)
- `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx` (lines 52-79)

Look for:
- `createPageUrl()` function
- `createPerPageUrl()` function
- `getVipBadge()` function
- `getStatusBadge()` / `getListStatusBadge()` functions

### Step 2: Create use-table-pagination Hook

Create `src/hooks/use-table-pagination.ts`:

```typescript
/**
 * Custom hook for table pagination URL management
 *
 * Provides URL generation utilities for table pagination and per-page controls.
 * Handles query parameter construction following the pattern:
 * - page: Only included if > 1
 * - perPage: Only included if not default (10)
 *
 * @example
 * ```tsx
 * const { createPageUrl, createPerPageUrl } = useTablePagination({
 *   baseUrl: '/mailchimp/reports/123/opens',
 *   pageSize: 25,
 * });
 *
 * // Generate URL for page 2 with custom page size
 * const url = createPageUrl(2); // "/mailchimp/reports/123/opens?page=2&perPage=25"
 * ```
 */

import { useCallback } from "react";

export interface UseTablePaginationProps {
  /**
   * Base URL for the table page (without query parameters)
   * @example "/mailchimp/reports/abc123/opens"
   */
  baseUrl: string;

  /**
   * Current page size (number of items per page)
   * @default 10
   */
  pageSize: number;

  /**
   * Default page size to compare against
   * @default 10
   */
  defaultPageSize?: number;
}

export interface UseTablePaginationReturn {
  /**
   * Create a URL for a specific page number
   * @param page - Page number (1-indexed)
   * @returns URL string with appropriate query parameters
   */
  createPageUrl: (page: number) => string;

  /**
   * Create a URL for changing the page size
   * Resets to page 1 when page size changes
   * @param newPerPage - New page size
   * @returns URL string with appropriate query parameters
   */
  createPerPageUrl: (newPerPage: number) => string;
}

/**
 * Hook for managing table pagination URLs
 */
export function useTablePagination({
  baseUrl,
  pageSize,
  defaultPageSize = 10,
}: UseTablePaginationProps): UseTablePaginationReturn {
  /**
   * Create URL for navigating to a specific page
   */
  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams();

      // Only add page if not page 1
      if (page > 1) {
        params.set("page", page.toString());
      }

      // Add perPage if it's not the default
      if (pageSize !== defaultPageSize) {
        params.set("perPage", pageSize.toString());
      }

      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl, pageSize, defaultPageSize],
  );

  /**
   * Create URL for changing page size
   * Resets to page 1 when page size changes
   */
  const createPerPageUrl = useCallback(
    (newPerPage: number) => {
      const params = new URLSearchParams();

      // Reset to page 1 when changing page size
      // Only add perPage if it's not the default
      if (newPerPage !== defaultPageSize) {
        params.set("perPage", newPerPage.toString());
      }

      return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [baseUrl, defaultPageSize],
  );

  return {
    createPageUrl,
    createPerPageUrl,
  };
}
```

### Step 3: Create Badge Utilities

Create `src/components/ui/helpers/badge-utils.tsx`:

```typescript
/**
 * Badge utility functions for consistent badge rendering
 *
 * These utilities provide standardized badge components for common
 * status indicators used across table components.
 */

import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

/**
 * Render a VIP badge for a member
 *
 * @param isVip - Whether the member has VIP status
 * @param variant - Badge variant style ('default' or 'secondary')
 * @returns Badge component or null
 *
 * @example
 * ```tsx
 * {getVipBadge(member.vip)} // Simple version
 * {getVipBadge(member.vip, 'default')} // With icon
 * ```
 */
export function getVipBadge(isVip: boolean, variant: 'simple' | 'with-icon' = 'simple') {
  if (!isVip) {
    return null;
  }

  if (variant === 'with-icon') {
    return (
      <Badge variant="default" className="flex items-center gap-1 w-fit">
        <User className="h-3 w-3" />
        VIP
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      VIP
    </Badge>
  );
}

/**
 * Render a status badge for a member subscription status
 *
 * @param status - Member subscription status
 * @returns Badge component with appropriate variant
 *
 * @example
 * ```tsx
 * {getMemberStatusBadge(member.status)}
 * ```
 */
export function getMemberStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "subscribed":
      return <Badge variant="default">Active</Badge>;
    case "unsubscribed":
      return <Badge variant="secondary">Unsubscribed</Badge>;
    case "cleaned":
      return <Badge variant="destructive">Cleaned</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

/**
 * Render an active/inactive status badge
 *
 * @param isActive - Whether the item is active
 * @returns Badge component
 *
 * @example
 * ```tsx
 * {getActiveStatusBadge(list.is_active)}
 * ```
 */
export function getActiveStatusBadge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
}
```

### Step 4: Update helpers/index.ts

Update `src/components/ui/helpers/index.ts`:

```typescript
/**
 * Card utility helpers
 */
export * from "./card-utils";

/**
 * Badge utility helpers
 */
export * from "./badge-utils";
```

### Step 5: Create Type Definitions

Create `src/types/hooks/use-table-pagination.ts`:

```typescript
/**
 * Types for useTablePagination hook
 */

export interface UseTablePaginationProps {
  /**
   * Base URL for the table page (without query parameters)
   */
  baseUrl: string;

  /**
   * Current page size (number of items per page)
   */
  pageSize: number;

  /**
   * Default page size to compare against
   * @default 10
   */
  defaultPageSize?: number;
}

export interface UseTablePaginationReturn {
  /**
   * Create a URL for a specific page number
   */
  createPageUrl: (page: number) => string;

  /**
   * Create a URL for changing the page size
   */
  createPerPageUrl: (newPerPage: number) => string;
}
```

Update `src/types/hooks/index.ts` (create if doesn't exist):

```typescript
/**
 * Hook types
 */
export * from "./use-table-pagination";
```

### Step 6: Validation

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

**Expected:** No errors, all checks pass

**Checkpoint: COMMIT**

```bash
git add src/hooks/ src/components/ui/helpers/ src/types/hooks/
git commit -m "feat(hooks): create useTablePagination hook and badge utilities

- Add useTablePagination hook for table URL management
- Add badge utility functions (getVipBadge, getMemberStatusBadge, getActiveStatusBadge)
- Add TypeScript types for hook
- Update helpers barrel export
- Includes JSDoc documentation for all functions"
```

---

## Phase 2: Update Table Components to Use Shared Hook

**Goal:** Update both table components to import and use the shared hook and badge utilities, removing duplicate code

**Estimated Time:** 45 minutes

**Pre-Phase Checklist:**

- [ ] Phase 1 complete (hook and utilities exist and are committed)
- [ ] Check git log to see if this phase is already done

**Implementation Steps:**

We'll update each component one at a time to make the changes manageable.

### Step 1: Update CampaignOpensTable.tsx

**File:** `src/components/dashboard/reports/CampaignOpensTable.tsx`

1. **Read the current file** to see the duplicate functions
2. **Add imports** at the top of the file:
   ```typescript
   import { useTablePagination } from "@/hooks/use-table-pagination";
   import { getVipBadge, getMemberStatusBadge } from "@/components/ui/helpers/badge-utils";
   ```
3. **Replace the URL generation functions** (lines 52-79):
   - Remove `createPageUrl()` function
   - Remove `createPerPageUrl()` function
   - Add hook usage after line 49:
   ```typescript
   // Use shared pagination hook for URL generation
   const { createPageUrl, createPerPageUrl } = useTablePagination({
     baseUrl,
     pageSize,
   });
   ```
4. **Remove the badge utility functions** (lines 82-104):
   - Delete `getVipBadge()` function (lines 82-88)
   - Delete `getStatusBadge()` function (lines 90-104)
5. **Update badge function call** in column definitions:
   - Change `getStatusBadge(member.status)` to `getMemberStatusBadge(member.status)`
   - `getVipBadge()` calls remain the same (same function signature)

### Step 2: Update CampaignAbuseReportsTable.tsx

**File:** `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx`

1. **Read the current file**
2. **Add imports:**
   ```typescript
   import { useTablePagination } from "@/hooks/use-table-pagination";
   import { getVipBadge, getActiveStatusBadge } from "@/components/ui/helpers/badge-utils";
   ```
3. **Replace the URL generation functions** (lines 52-79):
   - Remove `createPageUrl()` function
   - Remove `createPerPageUrl()` function
   - Add hook usage after line 49:
   ```typescript
   // Use shared pagination hook for URL generation
   const { createPageUrl, createPerPageUrl } = useTablePagination({
     baseUrl,
     pageSize,
   });
   ```
4. **Remove the badge utility functions** (lines 82-99):
   - Delete `getVipBadge()` function (lines 82-91)
   - Delete `getListStatusBadge()` function (lines 93-99)
5. **Update badge function calls** in column definitions:
   - Keep `getVipBadge(abuse_report.list_is_vip, 'with-icon')`
   - Change `getListStatusBadge(abuse_report.list_is_active)` to `getActiveStatusBadge(abuse_report.list_is_active)`

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
git add src/components/dashboard/reports/
git commit -m "refactor(components): use shared pagination hook in table components

- Update CampaignOpensTable to use useTablePagination hook
- Update CampaignAbuseReportsTable to use useTablePagination hook
- Replace local badge functions with shared badge utilities
- Remove ~70 lines of duplicate code (URL generation and badge functions)
- All components now use centralized pagination logic"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:
- Phase 1 & 2 are complete and committed
- Hook and utilities are created and being used
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

# If specific test failures, run individual test files
# pnpm test src/components/dashboard/reports/CampaignOpensTable.test.tsx
```

**Expected:** All tests pass. If tests fail due to imports, update test files to mock the hook.

### Step 3: Manual Testing in Browser

**Start the development server:**

```bash
pnpm dev
```

**Test each component visually:**

1. **Navigate to pages that use these table components:**
   - Campaign Opens page: `/mailchimp/reports/[campaign-id]/opens`
   - Campaign Abuse Reports page: `/mailchimp/reports/[campaign-id]/abuse-reports`

2. **Verify pagination functionality:**
   - [ ] Page navigation works (Previous, Next, page numbers)
   - [ ] URLs update correctly with page parameter
   - [ ] Page 1 doesn't have `?page=1` in URL (clean URL)
   - [ ] Per-page selector changes work
   - [ ] URLs update correctly with perPage parameter
   - [ ] Default page size (10) doesn't add `?perPage=10` (clean URL)
   - [ ] Changing page size resets to page 1

3. **Verify badge rendering:**
   - [ ] VIP badges display correctly
   - [ ] Member status badges show correct colors and text
   - [ ] Active/Inactive badges render properly
   - [ ] Badge styling matches previous implementation

4. **Check different data scenarios:**
   - [ ] Tables with multiple pages
   - [ ] Tables with VIP members
   - [ ] Tables with different member statuses
   - [ ] Empty state displays when no data

**Expected:** All components render and function identically to before the refactoring

### Step 4: Check for Console Errors

Open browser DevTools console and verify:
- [ ] No React errors
- [ ] No import errors
- [ ] No runtime errors
- [ ] No hook-related warnings

### Step 5: Verify Code Reduction

```bash
# Check the diff to see lines removed
git diff main --stat

# Should show negative lines for the 2 component files (code removed)
# Should show positive lines for the hook and badge utilities
```

**Expected:** Net reduction of approximately 70 lines across the 2 files

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
- [ ] All components render correctly in browser
- [ ] Pagination functionality works as expected
- [ ] Badge rendering is correct
- [ ] No visual regressions
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
  - [ ] All imports use path aliases (`@/hooks/use-table-pagination`, `@/components/ui/helpers/badge-utils`)
  - [ ] All duplicate functions removed from components
  - [ ] JSDoc comments present on all utility functions
  - [ ] No console.logs or debug statements
  - [ ] Follows project conventions

- [ ] **Testing**
  - [ ] All tests pass
  - [ ] Manual browser testing completed
  - [ ] No visual regressions confirmed
  - [ ] Pagination works correctly
  - [ ] Badges render correctly

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
git push -u origin refactor/table-pagination-hook
```

---

## Create Pull Request

**Title:** `refactor: extract table pagination hook and badge utilities`

**Description:**

```markdown
## Summary

Implements Priority 2 from [component-dry-refactoring-plan.md](https://github.com/a4og5n/another-dashboard/blob/main/docs/refactoring/component-dry-refactoring-plan.md). Extracts duplicated pagination URL logic and badge functions from 2 table components into shared utilities.

## Changes

### New Files Created
- **`src/hooks/use-table-pagination.ts`** - Custom hook for table pagination URL management
  - `createPageUrl()` - Generate URL for specific page
  - `createPerPageUrl()` - Generate URL for page size change
- **`src/components/ui/helpers/badge-utils.tsx`** - Shared badge utility functions
  - `getVipBadge()` - VIP badge with variants
  - `getMemberStatusBadge()` - Member subscription status badge
  - `getActiveStatusBadge()` - Active/inactive status badge
- **`src/types/hooks/use-table-pagination.ts`** - TypeScript types for hook

### Components Updated
Updated 2 table components to use shared utilities (removed duplicate code):
- `src/components/dashboard/reports/CampaignOpensTable.tsx` (~35 lines removed)
- `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx` (~35 lines removed)

### Additional Improvements
- **Architecture Compliance:** Hook types in `types/` folder
- **Documentation:** JSDoc comments for all functions
- **Clean URLs:** Maintains existing URL parameter optimization

## Impact

- **Code Reduction:** ~70 lines of duplicate code removed
- **New Utility Code:** ~150 lines of centralized, reusable utilities added
- **Maintainability:** ⬆️ Centralized pagination logic easier to update and test
- **Consistency:** ✅ All tables now use the same URL generation logic
- **DRY Principle:** ✅ Follows Don't Repeat Yourself best practices

## Testing

- [ ] All tests pass: XXX/XXX tests passing
- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting passes: `pnpm format:check`
- [ ] Manual testing completed for both table components
- [ ] Pagination functionality verified (page navigation, per-page changes)
- [ ] Badge rendering verified (VIP, status, active badges)
- [ ] No visual regressions confirmed
- [ ] No console errors in browser

## Pages Tested Manually

- [ ] `/mailchimp/reports/[id]/opens` - Campaign opens table
- [ ] `/mailchimp/reports/[id]/abuse-reports` - Campaign abuse reports table
- [ ] Pagination controls work correctly
- [ ] Per-page selector functions properly
- [ ] URLs are clean (no unnecessary query parameters)
- [ ] Badges render with correct styling and colors

## Checklist

- [ ] Code follows project architectural patterns
- [ ] All imports use path aliases
- [ ] JSDoc documentation added to all utilities
- [ ] No breaking changes
- [ ] All duplicate code removed from components
- [ ] Manual testing completed with no regressions
- [ ] Types in `types/` folder
- [ ] All commits follow conventional commit format

## Related Documentation

- **Refactoring Plan:** [docs/refactoring/component-dry-refactoring-plan.md](https://github.com/a4og5n/another-dashboard/blob/main/docs/refactoring/component-dry-refactoring-plan.md) - Priority 2
- **Execution Plan:** [docs/refactoring/execution-plan-priority-2-table-pagination.md](https://github.com/a4og5n/another-dashboard/blob/refactor/table-pagination-hook/docs/refactoring/execution-plan-priority-2-table-pagination.md)

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
git push origin --delete refactor/table-pagination-hook
git branch -D refactor/table-pagination-hook

# If merged and issues found - create revert commit
git revert <merge-commit-hash>
git push
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d refactor/table-pagination-hook`
- [ ] Delete feature branch remotely: `git push origin --delete refactor/table-pagination-hook`
- [ ] Update component-dry-refactoring-plan.md to mark Priority 2 as complete
- [ ] Close the GitHub Issue for Priority 2 (if created)
- [ ] Celebrate! 🎉 70+ lines of duplicate code eliminated

---

**End of Execution Plan**

---

## Summary

This execution plan will:

1. ✅ Create a feature branch for safe development
2. ✅ Extract URL pagination logic into a reusable hook
3. ✅ Extract badge functions into shared utilities
4. ✅ Update 2 table components to use the shared utilities
5. ✅ Remove ~70 lines of duplicate code
6. ✅ Ensure no visual or functional regressions through testing
7. ✅ Create a clean, reviewable PR

**Estimated Total Time:** 2-3 hours

**Key Benefits:**
- Improved maintainability of pagination logic
- Consistent URL generation across all table components
- Reduced code duplication
- Easier to add new table components with pagination
- Centralized badge rendering logic
- Better adherence to DRY principle
