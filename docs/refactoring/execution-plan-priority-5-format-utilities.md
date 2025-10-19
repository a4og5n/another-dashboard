# Execution Plan: Priority 5 - Consolidate Value Formatting Utilities

**GitHub Issue:** [#199](https://github.com/a4og5n/another-dashboard/issues/199)

**Task Reference:** [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 5

**Estimated Effort:** 1.5-2 hours

**Created:** 2025-10-19

---

## Overview

**Goal:** Consolidate 5+ duplicate implementations of number/value formatting functions into a single, centralized utility module with consistent behavior and comprehensive test coverage.

**Success Criteria:**

- ✅ All duplicate formatting functions removed from component files
- ✅ Single source of truth for formatting in `src/utils/format-number.ts`
- ✅ All 5+ affected components use centralized utilities
- ✅ Comprehensive test coverage (100% for utilities)
- ✅ Consistent formatting behavior across entire application
- ✅ All tests pass
- ✅ No visual regressions

**Context:**

Currently, the codebase has inconsistent formatting implementations:
- `BaseMetricCard.tsx` has `formatPercentage()` that takes already-converted percentages (23.5 → "23.5")
- `card-utils.tsx` has `formatPercentage()` that converts decimals (0.235 → "23.5%")
- `ListPerformanceCard.tsx` has inline `formatPercentage()` for decimal conversion
- `src/utils/format-number.ts` has `formatPercent()` with null handling
- Multiple `formatNumber()` duplicates across components

This inconsistency causes confusion and potential bugs. This refactoring will standardize all formatting.

**Estimated Lines Saved:** 40+ lines across 5 files

---

## Prerequisites

**Required Knowledge:**

- Understand difference between percentage display formats (already-converted vs decimal)
- Understand `toLocaleString()` for number formatting
- Familiarity with utility function patterns in the project

**Files to Review Before Starting:**

- [src/utils/format-number.ts](../../src/utils/format-number.ts) - Current centralized utilities
- [src/components/ui/helpers/card-utils.tsx](../../src/components/ui/helpers/card-utils.tsx) - Card-specific utilities
- [component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Full context on Priority 5

---

## Files Affected

**Files to Modify:**

1. `src/utils/format-number.ts` - Enhance with additional formatting utilities
2. `src/utils/format-number.test.ts` - Add comprehensive test coverage
3. `src/components/ui/helpers/card-utils.tsx` - Remove duplicate `formatPercentage()`, use centralized
4. `src/components/dashboard/reports/BaseMetricCard.tsx` - Remove duplicate `formatPercentage()`
5. `src/components/dashboard/reports/ListPerformanceCard.tsx` - Remove inline `formatPercentage()`
6. `src/utils/index.ts` - Ensure formatting utilities are exported

**Files to Potentially Update (Usage Verification):**

- `src/components/ui/stat-card.tsx` - Verify imports
- `src/components/ui/stats-grid-card.tsx` - Verify imports
- `src/components/ui/status-card.tsx` - Verify imports

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
git checkout -b refactor/format-utilities

# Verify you're on the correct branch
git branch --show-current
# Should output: refactor/format-utilities (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to formatting utilities
git log --oneline --all --grep="format"

# Check current state of format-number.ts
cat src/utils/format-number.ts
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

- [ ] Read Priority 5 section in component-dry-refactoring-plan.md
- [ ] Understand current formatting inconsistencies
- [ ] Review existing `format-number.ts` utilities
- [ ] Identify all duplicate formatting functions
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
pnpm test src/utils/format-number.test.ts
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for format utilities consolidation (#199)"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Enhance Central Format Utilities

**Goal:** Add missing formatting functions to `src/utils/format-number.ts` with consistent naming and behavior

**Estimated Time:** 20 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify format-number.ts hasn't been updated yet
- [ ] Read current format-number.ts implementation

**Implementation Steps:**

### 1. Update `src/utils/format-number.ts`

Add the following functions with proper JSDoc:

```typescript
/**
 * Format a number with proper thousands separators
 * @param num The number to format
 * @returns Formatted number string with locale-specific thousands separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a number as a percentage with one decimal place
 * @param value The number to format (can be null or undefined)
 * @returns Formatted percentage string (e.g., "45.3%") or "N/A" if value is null/undefined
 */
export function formatPercent(value: number | null | undefined): string {
  return value != null ? `${value.toFixed(1)}%` : "N/A";
}

/**
 * Format a decimal value as a percentage with specified decimal places
 * Converts decimal to percentage (e.g., 0.235 → "23.5%")
 *
 * @param value The decimal value to format (e.g., 0.235 for 23.5%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "23.5%")
 *
 * @example
 * formatPercentage(0.235) // "23.5%"
 * formatPercentage(0.235, 2) // "23.50%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format an already-converted percentage value for display
 * Use this when you already have a percentage value (e.g., 23.5 for 23.5%)
 *
 * @param value The percentage value (e.g., 23.5 for 23.5%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "23.5")
 *
 * @example
 * formatPercentageValue(23.456) // "23.5"
 * formatPercentageValue(23.456, 2) // "23.46"
 */
export function formatPercentageValue(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format a value for display (adds thousand separators for numbers, passes through strings)
 *
 * @param val The value to format (string or number)
 * @returns Formatted string value
 *
 * @example
 * formatValue(12500) // "12,500"
 * formatValue("Custom") // "Custom"
 */
export function formatValue(val: string | number): string {
  return typeof val === "number" ? val.toLocaleString() : val;
}
```

### 2. Verify barrel export in `src/utils/index.ts`

Ensure the formatting utilities are exported:

```typescript
export * from "@/utils/format-number";
```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] All functions have JSDoc comments
- [ ] Function names are clear and descriptive

**Checkpoint: COMMIT**

```bash
git add src/utils/format-number.ts src/utils/index.ts
git commit -m "feat(utils): enhance format-number utilities with consistent API (#199)

- Add formatPercentage() for decimal-to-percentage conversion
- Add formatPercentageValue() for already-converted percentages
- Add formatValue() for flexible string/number formatting
- Add comprehensive JSDoc comments with examples
- Maintain backward compatibility with existing formatNumber() and formatPercent()"
```

---

## Phase 2: Write Comprehensive Tests

**Goal:** Ensure all formatting functions work correctly with 100% test coverage

**Estimated Time:** 25 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 1 commit exists
- [ ] Check if test file already has comprehensive coverage

**Implementation Steps:**

### 1. Create or update `src/utils/format-number.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercent,
  formatPercentage,
  formatPercentageValue,
  formatValue,
} from "./format-number";

describe("formatNumber", () => {
  it("formats numbers with thousands separators", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("handles zero correctly", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1234)).toBe("-1,234");
  });
});

describe("formatPercent", () => {
  it("formats percentage values with one decimal place", () => {
    expect(formatPercent(23.456)).toBe("23.5%");
    expect(formatPercent(100)).toBe("100.0%");
  });

  it("handles null and undefined values", () => {
    expect(formatPercent(null)).toBe("N/A");
    expect(formatPercent(undefined)).toBe("N/A");
  });

  it("handles zero correctly", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatPercentage", () => {
  it("converts decimal to percentage with default decimals", () => {
    expect(formatPercentage(0.235)).toBe("23.5%");
    expect(formatPercentage(0.1)).toBe("10.0%");
    expect(formatPercentage(1)).toBe("100.0%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercentage(0.23456, 2)).toBe("23.46%");
    expect(formatPercentage(0.23456, 0)).toBe("23%");
  });

  it("handles zero correctly", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });

  it("handles very small decimals", () => {
    expect(formatPercentage(0.001)).toBe("0.1%");
    expect(formatPercentage(0.001, 2)).toBe("0.10%");
  });
});

describe("formatPercentageValue", () => {
  it("formats already-converted percentage values", () => {
    expect(formatPercentageValue(23.456)).toBe("23.5");
    expect(formatPercentageValue(100)).toBe("100.0");
  });

  it("respects custom decimal places", () => {
    expect(formatPercentageValue(23.456, 2)).toBe("23.46");
    expect(formatPercentageValue(23.456, 0)).toBe("23");
  });

  it("handles zero correctly", () => {
    expect(formatPercentageValue(0)).toBe("0.0");
  });
});

describe("formatValue", () => {
  it("formats numbers with thousands separators", () => {
    expect(formatValue(12500)).toBe("12,500");
    expect(formatValue(1234567)).toBe("1,234,567");
  });

  it("passes through strings unchanged", () => {
    expect(formatValue("Custom")).toBe("Custom");
    expect(formatValue("N/A")).toBe("N/A");
  });

  it("handles zero correctly", () => {
    expect(formatValue(0)).toBe("0");
  });

  it("handles empty string", () => {
    expect(formatValue("")).toBe("");
  });
});
```

### 2. Run tests and verify coverage

```bash
# Run tests
pnpm test src/utils/format-number.test.ts

# Check coverage
pnpm test:coverage src/utils/format-number.test.ts
```

**Validation:**

- [ ] All tests pass
- [ ] Coverage is 100% for format-number.ts
- [ ] All edge cases tested (null, undefined, zero, negative)
- [ ] Tests are clear and well-documented

**Checkpoint: COMMIT**

```bash
git add src/utils/format-number.test.ts
git commit -m "test(utils): add comprehensive tests for format-number utilities (#199)

- Test formatNumber() with various number formats
- Test formatPercent() with null handling
- Test formatPercentage() decimal-to-percentage conversion
- Test formatPercentageValue() for already-converted values
- Test formatValue() with both strings and numbers
- Achieve 100% test coverage"
```

---

## Phase 3: Update Card Utils to Use Centralized Utilities

**Goal:** Remove duplicate `formatPercentage()` from card-utils.tsx and import from centralized location

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 2 commit exists
- [ ] Read current card-utils.tsx implementation

**Implementation Steps:**

### 1. Update `src/components/ui/helpers/card-utils.tsx`

**Remove the duplicate `formatPercentage()` function (lines 67-76):**

```typescript
// DELETE THIS:
/**
 * Format a decimal value as a percentage
 *
 * @param value - The decimal value to format (e.g., 0.156 for 15.6%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "15.6%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
```

**Add import at the top:**

```typescript
import { formatPercentage } from "@/utils/format-number";
```

**Note:** Keep `formatNumber()` and `formatValue()` in card-utils.tsx for now since they're card-specific. We'll address consolidation in a future phase if needed.

### 2. Run validation

```bash
# Type check
pnpm type-check

# Run tests to ensure nothing broke
pnpm test src/components/ui/helpers/
```

**Validation:**

- [ ] TypeScript compiles without errors
- [ ] No import errors
- [ ] Card utility tests still pass (if any)
- [ ] Removed ~10 lines of duplicate code

**Checkpoint: COMMIT**

```bash
git add src/components/ui/helpers/card-utils.tsx
git commit -m "refactor(ui): use centralized formatPercentage in card-utils (#199)

- Remove duplicate formatPercentage() implementation
- Import from @/utils/format-number instead
- Reduces code duplication
- Maintains consistent percentage formatting"
```

---

## Phase 4: Update BaseMetricCard Component

**Goal:** Remove duplicate `formatPercentage()` from BaseMetricCard.tsx

**Estimated Time:** 10 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 3 commit exists
- [ ] Read current BaseMetricCard.tsx implementation

**Implementation Steps:**

### 1. Update `src/components/dashboard/reports/BaseMetricCard.tsx`

**Remove lines 55-63:**

```typescript
// DELETE THIS:
/**
 * Formats percentage for display with one decimal place
 *
 * Note: This is a re-export of the shared utility for backward compatibility.
 * The value is expected to already be a percentage (e.g., 23.5 for 23.5%).
 */
export function formatPercentage(value: number): string {
  return value.toFixed(1);
}
```

**If this function is exported and used elsewhere, add a re-export:**

```typescript
// Add at the top with imports
export { formatPercentageValue as formatPercentage } from "@/utils/format-number";
```

**Note:** This maintains backward compatibility if any components import `formatPercentage` from BaseMetricCard.

### 2. Search for usages of this function

```bash
# Check if formatPercentage is imported from BaseMetricCard anywhere
grep -r "formatPercentage.*BaseMetricCard" src/
```

**If usages found:** Update those imports to use `@/utils/format-number` directly.

**Validation:**

- [ ] TypeScript compiles without errors
- [ ] No import errors in dependent components
- [ ] Run tests: `pnpm test`
- [ ] Removed ~8 lines of duplicate code

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/reports/BaseMetricCard.tsx
git commit -m "refactor(components): remove duplicate formatPercentage from BaseMetricCard (#199)

- Remove inline formatPercentage() implementation
- Re-export formatPercentageValue from utils for backward compatibility
- Reduces code duplication
- Maintains consistent formatting"
```

---

## Phase 5: Update ListPerformanceCard Component

**Goal:** Replace inline `formatPercentage()` with centralized utility

**Estimated Time:** 10 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -5`
- [ ] Verify Phase 4 commit exists
- [ ] Read current ListPerformanceCard.tsx implementation

**Implementation Steps:**

### 1. Update `src/components/dashboard/reports/ListPerformanceCard.tsx`

**Remove lines 14-18:**

```typescript
// DELETE THIS:
/**
 * Formats percentage for display
 */
function formatPercentage(value: number): string {
  return (value * 100).toFixed(1);
}
```

**Add import at the top:**

```typescript
import { formatPercentage } from "@/utils/format-number";
```

**Update usages on lines 36, 43, and 73:**

The existing code divides by 100 then multiplies by 100 in formatPercentage:
```typescript
// BEFORE:
formatPercentage(listStats.open_rate / 100) // listStats.open_rate is already a percentage like 23.5

// AFTER: Use formatPercentageValue since value is already a percentage
formatPercentageValue(listStats.open_rate)
```

**Actually, let's check the data type first.** Since the code does `listStats.open_rate / 100`, it seems like `open_rate` might be stored as a whole number (2350 for 23.5%). Let's use `formatPercentage()` which expects a decimal:

```typescript
// If open_rate is 23.5 (percentage), convert to decimal first
formatPercentage(listStats.open_rate / 100) // Converts 23.5/100 = 0.235 → "23.5%"
```

This is correct - keep the existing logic but use the centralized function.

**Import the correct function:**

```typescript
import { formatPercentage } from "@/utils/format-number";
```

### 2. Manual testing

```bash
# Start dev server
pnpm dev

# Navigate to a campaign report with list performance data
# Verify percentages display correctly
```

**Validation:**

- [ ] TypeScript compiles without errors
- [ ] Component renders correctly
- [ ] Percentage values display as expected
- [ ] Run tests: `pnpm test`
- [ ] Removed ~5 lines of duplicate code

**Checkpoint: COMMIT**

```bash
git add src/components/dashboard/reports/ListPerformanceCard.tsx
git commit -m "refactor(components): use centralized formatPercentage in ListPerformanceCard (#199)

- Remove inline formatPercentage() function
- Import from @/utils/format-number instead
- Maintains existing formatting behavior
- Reduces code duplication"
```

---

## Phase 6: Final Validation and Documentation

**Goal:** Run full validation suite and update documentation

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -10`
- [ ] Verify all 5 phases complete
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
- [ ] Campaign report cards (BaseMetricCard usage)
- [ ] List performance card (ListPerformanceCard usage)
- [ ] Any stat cards using formatPercentage
- [ ] Verify percentage values display correctly across all pages

### 3. Review all changes

```bash
# Review commit history
git log --oneline main..HEAD

# Review all file changes
git diff main

# Count lines saved
git diff main --stat
```

### 4. Update CLAUDE.md (if needed)

Add usage guidance for formatting utilities if not already documented.

**Validation:**

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] No console errors in dev server
- [ ] Manual testing shows correct formatting
- [ ] ~40+ lines of duplicate code removed

**Checkpoint: COMMIT** (if documentation updated)

```bash
git add CLAUDE.md
git commit -m "docs: update formatting utility usage guidance (#199)"
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
  - [ ] Consistent function naming across all utilities

- [ ] **Type Safety & Architecture**
  - [ ] No `any` types used
  - [ ] All imports use path aliases (`@/utils`)
  - [ ] Types organized properly
  - [ ] JSDoc comments on all exported functions

- [ ] **Testing**
  - [ ] All new/updated functions have tests
  - [ ] All tests pass: `pnpm test`
  - [ ] 100% coverage for format-number.ts
  - [ ] Type checking passes: `pnpm type-check`
  - [ ] Linting passes: `pnpm lint`

- [ ] **Functionality**
  - [ ] All formatting behaves consistently
  - [ ] No visual regressions in components
  - [ ] Percentage displays are correct
  - [ ] Number formatting works as expected

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
git push -u origin refactor/format-utilities
```

### Creating Pull Request

**Title:** `refactor: consolidate value formatting utilities`

**Description:**

```markdown
## Summary

Consolidates 5+ duplicate implementations of number and percentage formatting functions into centralized utilities in `src/utils/format-number.ts`.

Closes #199

**Lines Saved:** 40+ | **Effort:** Low | **Impact:** Medium

## Problem

The codebase had inconsistent formatting implementations:
- `BaseMetricCard.tsx` had `formatPercentage()` for already-converted percentages
- `card-utils.tsx` had `formatPercentage()` for decimal conversion
- `ListPerformanceCard.tsx` had inline `formatPercentage()` for decimal conversion
- Multiple `formatNumber()` duplicates across components

This inconsistency caused confusion and potential bugs.

## Changes

- Enhanced `src/utils/format-number.ts` with comprehensive formatting utilities
- Added `formatPercentage()` for decimal-to-percentage conversion
- Added `formatPercentageValue()` for already-converted percentage values
- Added `formatValue()` for flexible string/number formatting
- Removed duplicate implementations from:
  - `src/components/ui/helpers/card-utils.tsx`
  - `src/components/dashboard/reports/BaseMetricCard.tsx`
  - `src/components/dashboard/reports/ListPerformanceCard.tsx`
- Added comprehensive test suite with 100% coverage

## Testing

- [x] Unit tests pass (40+ tests)
- [x] 100% coverage for format-number.ts
- [x] Type checking passes
- [x] Manual testing completed for all affected components
- [x] No visual regressions

## Benefits

- Single source of truth for formatting
- Consistent behavior across application
- Improved maintainability
- Comprehensive test coverage
- Clear function names and documentation

## Checklist

- [x] Code follows project patterns
- [x] Tests added with full coverage
- [x] No breaking changes
- [x] JSDoc documentation added
- [x] All affected components updated

## Related

- **Execution Plan:** [docs/refactoring/execution-plan-priority-5-format-utilities.md](docs/refactoring/execution-plan-priority-5-format-utilities.md)
- **Parent Epic:** Component DRY Refactoring - Priority 5
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

- [ ] Delete feature branch locally: `git branch -d refactor/format-utilities`
- [ ] Check off Priority 5 in component-dry-refactoring-plan.md
- [ ] Update refactoring progress metrics
- [ ] Celebrate 40+ lines of duplicate code eliminated! 🎉

---

**End of Execution Plan**
