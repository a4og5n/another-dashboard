# Execution Plan: Standardize Error Handling Utility

**Task Reference:** [docs/page-pattern-improvements.md](../page-pattern-improvements.md) - Improvement #1
**Estimated Effort:** 2-3 hours
**Created:** 2025-10-15
**Status:** Ready to implement

---

## Overview

### Task Summary

Create reusable error handling utilities to standardize 404 detection and error handling across all pages in the application. This eliminates code duplication where every page currently repeats the same 404 detection logic.

**Reference Documentation:**

- [Page Pattern Improvements](../page-pattern-improvements.md) - Section #1
- [Execution Plan Template](../execution-plan-template.md)

**Success Criteria:**

- ✅ Error handling utilities created with comprehensive JSDoc
- ✅ Unit tests with 100% coverage for error detection logic
- ✅ At least 3 pages updated to demonstrate the pattern
- ✅ All validation commands pass (type-check, lint, test)
- ✅ Documentation updated in CLAUDE.md

### Estimated Effort

- **Total Time:** 2-3 hours
- **Phase 1 (Utilities):** 30 minutes
- **Phase 2 (Tests):** 30 minutes
- **Phase 3 (Page Updates):** 60-90 minutes
- **Phase 4 (Documentation):** 15 minutes

### Prerequisites

**Required Knowledge:**

- Next.js `notFound()` function behavior
- ApiResponse type definition structure
- Current error handling patterns in existing pages

**Dependencies:**

- None - This is the first improvement to implement

**Files to Review Before Starting:**

- `src/types/api-errors.ts` - Understand ApiResponse type definition
- `src/app/mailchimp/reports/[id]/page.tsx` - Example of current error handling
- `src/app/mailchimp/lists/[id]/page.tsx` - Another example
- Next.js error handling docs: https://nextjs.org/docs/app/getting-started/error-handling

### Files Affected

**Files to Create:**

- `src/utils/errors/api-error-handler.ts` - Core error handling functions
- `src/utils/errors/api-error-handler.test.ts` - Unit tests
- `src/utils/errors/index.ts` - Barrel export

**Files to Modify:**

- `src/utils/index.ts` - Add errors export
- `src/app/mailchimp/reports/[id]/page.tsx` - Use error handler (Proof of Concept)
- `src/app/mailchimp/lists/[id]/page.tsx` - Use error handler
- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Use error handler
- `CLAUDE.md` - Document error handling pattern (optional)

---

## Pre-Implementation Checklist

Before writing any code:

- [ ] **Review ApiResponse type definition** in `src/types/api-errors.ts`
- [ ] **Review Next.js error handling docs** - https://nextjs.org/docs/app/getting-started/error-handling
- [ ] **Understand notFound() behavior** - triggers not-found.tsx rendering, safe in Server Components
- [ ] **Examine current error handling pattern** in 2-3 existing pages
- [ ] **Understand DAL response patterns** - returns ApiResponse with errorCode field
- [ ] **Verify test setup** - Vitest configured and working
- [ ] **Check environment** - dev server can run successfully

---

## Git Workflow

### Branch Strategy

**Branch Name:** `feature/error-handling-utility`

**Initial Setup:**

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/error-handling-utility

# Verify branch
git branch --show-current
```

### Commit Strategy

**Planned Commit Points:**

1. After creating utility files and exports
2. After writing comprehensive unit tests
3. After updating first page (proof of concept)
4. After updating remaining pages
5. After documentation updates (if applicable)

**Commit Message Format:**

```bash
feat(utils): add error handling utilities for API responses
test(utils): add comprehensive tests for error handlers
refactor(pages): use error handler in campaign report page
refactor(pages): apply error handler to list and opens pages
docs: document error handling utility pattern
```

---

## Implementation Phases

### Phase 1: Create Error Handling Utilities

**Goal:** Create the core error handling functions with proper typing and comprehensive documentation

**Estimated Time:** 30 minutes

**Files to Create:**

- `src/utils/errors/api-error-handler.ts` - Core utility functions
- `src/utils/errors/index.ts` - Barrel export

**Files to Modify:**

- `src/utils/index.ts` - Add errors re-export

**Implementation Steps:**

1. **Read the ApiResponse type definition**
   - File: `src/types/api-errors.ts`
   - Understand the structure of `ApiResponse<T>`
   - Note the `success`, `data`, `error`, `errorCode`, and `statusCode` properties

2. **Create the errors directory**

   ```bash
   mkdir -p src/utils/errors
   ```

3. **Create `api-error-handler.ts`**
   - Implement `is404Error()` function
   - Implement `handleApiError()` function
   - Implement `handleApiErrorWithFallback()` function
   - Add comprehensive JSDoc comments with usage examples
   - Import `notFound` from `next/navigation`
   - Import `ApiResponse` from `@/types` (using barrel export)

4. **Create barrel export `src/utils/errors/index.ts`**

   ```tsx
   export * from "@/utils/errors/api-error-handler";
   ```

5. **Update `src/utils/index.ts`**
   - Add: `export * from "@/utils/errors";`
   - **Important:** Follow existing pattern - all exports use path aliases, not relative paths

**Code Structure (Reference):**

````tsx
import { notFound } from "next/navigation";
import type { ApiResponse } from "@/types";

/**
 * Check if an error message indicates a 404/not found error
 *
 * Following Next.js best practices for error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 *
 * @param message - Error message to check
 * @returns true if the message indicates a 404 error
 *
 * @example
 * ```tsx
 * is404Error("Campaign not found") // true
 * is404Error("Resource does not exist") // true
 * is404Error("Invalid API key") // false
 * ```
 */
export function is404Error(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("404") ||
    normalizedMessage.includes("does not exist")
  );
}

/**
 * Handle API response errors with automatic 404 detection
 *
 * This utility follows Next.js App Router conventions:
 * - Calls notFound() to trigger not-found.tsx rendering (safe in Server Components)
 * - Returns error message for non-404 errors to allow conditional UI rendering
 * - Returns null for successful responses
 *
 * Note: This does not throw for non-404 errors, following Next.js guidance
 * to model expected errors as return values rather than exceptions.
 *
 * @param response - API response from DAL (includes success, data, error, errorCode)
 * @returns error message if not a 404, null if success
 * @throws Calls notFound() for 404 errors (triggers Next.js not-found.tsx)
 *
 * @example
 * ```tsx
 * const response = await mailchimpDAL.fetchCampaignReport(id);
 * const error = handleApiError(response);
 * if (error) {
 *   return <ErrorDisplay message={error} />;
 * }
 * // Render success UI
 * ```
 */
export function handleApiError(response: ApiResponse<unknown>): string | null {
  if (!response.success) {
    const errorMessage = response.error || "Failed to load data";
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}

/**
 * Handle API errors with custom fallback message
 *
 * Same as handleApiError but allows specifying a custom fallback message
 * when response.error is undefined.
 *
 * @param response - API response from DAL
 * @param fallbackMessage - Custom error message if response.error is undefined
 * @returns error message if not a 404, null if success
 * @throws Calls notFound() for 404 errors (triggers Next.js not-found.tsx)
 *
 * @example
 * ```tsx
 * const response = await mailchimpDAL.fetchList(id);
 * const error = handleApiErrorWithFallback(response, "Failed to load list details");
 * if (error) {
 *   return <ErrorDisplay message={error} />;
 * }
 * ```
 */
export function handleApiErrorWithFallback(
  response: ApiResponse<unknown>,
  fallbackMessage: string,
): string | null {
  if (!response.success) {
    const errorMessage = response.error || fallbackMessage;
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}
````

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Files created in correct locations
- [ ] Imports use path aliases (not relative paths)

**Checkpoint: COMMIT**

```bash
git add src/utils/errors/
git add src/utils/index.ts
git commit -m "feat(utils): add error handling utilities for API responses

- Add is404Error() to detect 404/not found errors
- Add handleApiError() for automatic 404 detection
- Add handleApiErrorWithFallback() for custom messages
- Include comprehensive JSDoc documentation"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phase 1 is complete and committed
- Utilities are simple and self-contained
- Next phase (testing) is independent

📋 What to keep:

- This execution plan document
- Current task: "Write unit tests for error handling utilities"

---

### Phase 2: Write Comprehensive Unit Tests

**Goal:** Ensure error handling functions work correctly with 100% test coverage

**Estimated Time:** 30 minutes

**Files to Create:**

- `src/utils/errors/api-error-handler.test.ts` - Unit tests

**Implementation Steps:**

1. **Create test file**

   ```bash
   touch src/utils/errors/api-error-handler.test.ts
   ```

2. **Write tests for `is404Error()`**
   - Test: Returns true for "not found" (case-insensitive)
   - Test: Returns true for "404"
   - Test: Returns true for "does not exist"
   - Test: Returns false for other error messages
   - Test: Handles empty strings

3. **Write tests for `handleApiError()`**
   - Test: Calls notFound() for 404 errors
   - Test: Returns error message for non-404 errors
   - Test: Returns null for successful responses
   - Test: Uses fallback message when error is undefined

4. **Write tests for `handleApiErrorWithFallback()`**
   - Test: Uses custom fallback message
   - Test: Calls notFound() for 404 errors
   - Test: Prefers response.error over fallback

**Test Structure (Reference):**

```tsx
import { describe, it, expect, vi } from "vitest";
import {
  is404Error,
  handleApiError,
  handleApiErrorWithFallback,
} from "./api-error-handler";
import type { ApiResponse } from "@/types";

// Mock Next.js notFound function
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("is404Error", () => {
  it("should return true for 'not found' message", () => {
    expect(is404Error("Campaign not found")).toBe(true);
    expect(is404Error("Resource Not Found")).toBe(true);
  });

  it("should return true for '404' message", () => {
    expect(is404Error("404 error occurred")).toBe(true);
    expect(is404Error("Error: 404")).toBe(true);
  });

  it("should return true for 'does not exist' message", () => {
    expect(is404Error("Campaign does not exist")).toBe(true);
    expect(is404Error("Resource Does Not Exist")).toBe(true);
  });

  it("should return false for other error messages", () => {
    expect(is404Error("Invalid API key")).toBe(false);
    expect(is404Error("Network timeout")).toBe(false);
    expect(is404Error("Unauthorized")).toBe(false);
  });

  it("should handle empty strings", () => {
    expect(is404Error("")).toBe(false);
  });
});

describe("handleApiError", () => {
  it("should call notFound() for 404 errors", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Campaign not found",
    };

    expect(() => handleApiError(response)).toThrow("NEXT_NOT_FOUND");
  });

  it("should return error message for non-404 errors", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Invalid API key",
    };

    expect(handleApiError(response)).toBe("Invalid API key");
  });

  it("should return null for successful responses", () => {
    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: "123" },
    };

    expect(handleApiError(response)).toBe(null);
  });

  it("should use fallback message when error is undefined", () => {
    const response: ApiResponse<unknown> = {
      success: false,
    };

    expect(handleApiError(response)).toBe("Failed to load data");
  });
});

describe("handleApiErrorWithFallback", () => {
  it("should use custom fallback message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
    };

    expect(handleApiErrorWithFallback(response, "Custom error")).toBe(
      "Custom error",
    );
  });

  it("should call notFound() for 404 errors with fallback", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Resource not found",
    };

    expect(() => handleApiErrorWithFallback(response, "Custom error")).toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("should prefer response.error over fallback", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Specific error",
    };

    expect(handleApiErrorWithFallback(response, "Fallback error")).toBe(
      "Specific error",
    );
  });
});
```

**Validation:**

- [ ] All tests pass: `pnpm test src/utils/errors/api-error-handler.test.ts`
- [ ] Coverage is 100% for utilities: `pnpm test:coverage`
- [ ] No type errors: `pnpm type-check`

**Checkpoint: COMMIT**

```bash
git add src/utils/errors/api-error-handler.test.ts
git commit -m "test(utils): add comprehensive tests for error handling utilities

- Test 404 error detection with various messages
- Test notFound() is called for 404 errors
- Test error messages are returned correctly
- Test fallback message functionality
- Achieve 100% test coverage"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phase 1 & 2 complete and committed
- Utilities are tested and working
- Next phase is independent (just using the utilities in pages)

📋 What to keep:

- This execution plan document
- Current task: "Update 3 pages to use error handling utilities"

---

### Phase 3: Update Pages to Use Error Handler

**Goal:** Update 3 pages as proof of concept to demonstrate the pattern

**Estimated Time:** 60-90 minutes (20-30 minutes per page)

#### Step 3.1: Update Campaign Report Page (Proof of Concept)

**Estimated Time:** 20-30 minutes

**File to Modify:**

- `src/app/mailchimp/reports/[id]/page.tsx`

**Implementation Steps:**

1. **Read the current implementation**
   - Locate the inline error handling code
   - Identify the pattern to replace

2. **Add import**

   ```tsx
   import { handleApiError } from "@/utils/errors";
   ```

3. **Replace inline error handling**
   - Find the `if (!response.success)` block
   - Replace with: `handleApiError(response);`

4. **Manual testing**
   - Start dev server: `pnpm dev`
   - Test valid campaign ID (should work normally)
   - Test invalid campaign ID (should show 404 page)
   - Check browser console for errors

**Before:**

```tsx
const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

if (!response.success) {
  const errorMessage = response.error || "Failed to load campaign report";
  if (
    errorMessage.toLowerCase().includes("not found") ||
    errorMessage.toLowerCase().includes("404")
  ) {
    notFound();
  }
}
```

**After:**

```tsx
const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);
const error = handleApiError(response);
// Note: If error is not null, you may want to handle it in the UI
// The existing MailchimpConnectionGuard pattern already handles this
```

**Validation:**

- [ ] Page loads correctly for valid IDs
- [ ] 404 page shows for invalid IDs
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No console errors in browser
- [ ] No linting errors: `pnpm lint`

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/page.tsx
git commit -m "refactor(pages): use error handler in campaign report page

- Replace inline 404 detection with handleApiError()
- Reduces code duplication by ~7 lines
- Improves consistency across pages"
```

---

#### Step 3.2: Update List Detail Page

**Estimated Time:** 20-30 minutes

**File to Modify:**

- `src/app/mailchimp/lists/[id]/page.tsx`

**Implementation Steps:**

1. **Read the current implementation**
2. **Add import for `handleApiError`**
3. **Replace inline error handling**
4. **Manual test in browser**
   - Test valid list ID
   - Test invalid list ID
   - Verify 404 page appears for invalid IDs

**Validation:**

- [ ] Page loads correctly for valid list IDs
- [ ] 404 page shows for invalid list IDs
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No console errors

---

#### Step 3.3: Update Opens Page

**Estimated Time:** 20-30 minutes

**File to Modify:**

- `src/app/mailchimp/reports/[id]/opens/page.tsx`

**Implementation Steps:**

1. **Read the current implementation**
2. **Add import for `handleApiError`**
3. **Replace inline error handling**
4. **Manual test in browser**
   - Test valid campaign ID with opens data
   - Test invalid campaign ID
   - Verify 404 page appears

**Validation:**

- [ ] Page loads correctly for valid campaigns
- [ ] 404 handling works correctly
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] All existing tests still pass: `pnpm test`

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/lists/[id]/page.tsx src/app/mailchimp/reports/[id]/opens/page.tsx
git commit -m "refactor(pages): apply error handler to list and opens pages

- Update list detail page with handleApiError()
- Update opens page with handleApiError()
- Consistent error handling across all detail pages
- Total code reduction: ~21 lines across 3 pages"
```

---

### Phase 4: Documentation and Final Validation

**Goal:** Update documentation and run full validation suite

**Estimated Time:** 15 minutes

**Implementation Steps:**

1. **Update CLAUDE.md (optional)**
   - Add error handling utility to the utilities section
   - Document usage pattern
   - Add example

2. **Run full validation**

   ```bash
   pnpm validate
   ```

3. **Review all changes**
   ```bash
   git log --oneline main..HEAD
   git diff main
   ```

**Validation:**

- [ ] All tests pass: `pnpm test`
- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] No console errors in dev server
- [ ] Manual testing completed for all updated pages

**Checkpoint: COMMIT** (if documentation was updated)

```bash
git add CLAUDE.md
git commit -m "docs: document error handling utility pattern

- Add error handler utilities to development guidelines
- Include usage examples for new pages
- Document benefits and patterns"
```

---

## Manual Review Checklist

Before pushing to origin:

### Code Quality

- [ ] All code follows project patterns (path aliases, no relative imports)
- [ ] No `any` types used
- [ ] All functions have comprehensive JSDoc comments
- [ ] No console.logs or debug code
- [ ] No commented-out code
- [ ] Follows established coding conventions

### Type Safety

- [ ] All imports use path aliases (not relative paths in index.ts)
- [ ] Types are properly inferred
- [ ] No type errors: `pnpm type-check`

### Testing

- [ ] Unit tests added with 100% coverage
- [ ] All tests pass: `pnpm test`
- [ ] Manual browser testing completed for all updated pages
- [ ] 404 handling verified for invalid IDs

### Documentation

- [ ] JSDoc comments on all exported functions
- [ ] Usage examples in JSDoc
- [ ] CLAUDE.md updated with pattern guidance (optional)

### Git Hygiene

- [ ] Review all changes: `git diff main`
- [ ] Ensure no unintended files are staged
- [ ] Commit messages follow conventions
- [ ] Each commit leaves codebase in working state
- [ ] On correct branch: `git branch --show-current`

### Manual Testing Results

- [ ] Campaign report page works for valid IDs
- [ ] Campaign report page shows 404 for invalid IDs
- [ ] List detail page works for valid IDs
- [ ] List detail page shows 404 for invalid IDs
- [ ] Opens page works for valid campaign IDs
- [ ] Opens page shows 404 for invalid campaign IDs
- [ ] No console errors in any scenario
- [ ] Dev server starts without errors: `pnpm dev`

---

## Push and Create Pull Request

### Before Pushing

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Review all changes one more time
git diff main

# Ensure you're on the correct branch
git branch --show-current
```

### Push to Origin

```bash
# First push of new branch
git push -u origin feature/error-handling-utility
```

### Create Pull Request

**Title:** `feat: add error handling utilities for API responses`

**Description:**

```markdown
## Summary

Implements improvement #1 from [page-pattern-improvements.md](../docs/page-pattern-improvements.md). Creates reusable error handling utilities to standardize 404 detection across all pages, reducing code duplication and improving consistency.

## Changes

- Created `src/utils/errors/api-error-handler.ts` with three utility functions:
  - `is404Error()` - Detects 404/not found errors
  - `handleApiError()` - Automatic 404 detection with notFound() call
  - `handleApiErrorWithFallback()` - Custom fallback messages
- Added comprehensive unit tests with 100% coverage (12 test cases)
- Updated 3 pages to use new error handlers:
  - Campaign report detail page (`/mailchimp/reports/[id]`)
  - List detail page (`/mailchimp/lists/[id]`)
  - Opens page (`/mailchimp/reports/[id]/opens`)
- Reduced code duplication by ~21 lines total (~7 lines per page)

## Testing

- [x] Unit tests pass (12/12)
- [x] 100% test coverage for utility functions
- [x] Type checking passes
- [x] Linting passes
- [x] Manual testing completed for all affected pages:
  - Valid IDs load correctly
  - Invalid IDs show 404 page
  - No console errors

## Benefits

- **Consistency:** All pages use the same error handling logic
- **Maintainability:** Single source of truth for 404 detection
- **Readability:** Cleaner page code with less boilerplate
- **Type Safety:** Fully typed with comprehensive JSDoc
- **Testability:** Isolated logic with 100% test coverage

## Checklist

- [x] Code follows project patterns
- [x] Tests added with full coverage
- [x] No breaking changes
- [x] JSDoc documentation added
- [x] Manual testing completed
- [x] All validation checks pass

## Related

- Implementation Plan: [docs/page-pattern-improvements.md](../docs/page-pattern-improvements.md) (#1)
- Execution Plan: [docs/execution-plans/error-handling-utility-plan.md](../docs/execution-plans/error-handling-utility-plan.md)

## Next Steps

- [ ] After merge: Update remaining pages incrementally (10+ pages can benefit)
- [ ] After merge: Proceed to improvement #2 (Unified Params Processing Pattern)
```

---

## Rollback Plan

If issues are discovered:

### If Not Pushed Yet

```bash
# Reset to main (keep changes)
git reset --soft main

# Or reset to main (discard changes) - DANGEROUS
git reset --hard main
```

### If Pushed But Not Merged

```bash
# Create revert commit (safe, preserves history)
git revert HEAD~4..HEAD  # Reverts last 4 commits
git push

# Or delete branch and start over
git push origin --delete feature/error-handling-utility
git checkout main
git branch -D feature/error-handling-utility
```

### If Merged to Main

```bash
# Create revert PR
git checkout main
git pull
git checkout -b revert/error-handling-utility
git revert <merge-commit-hash>
git push -u origin revert/error-handling-utility
# Create PR to merge revert
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d feature/error-handling-utility`
- [ ] Delete feature branch remotely: `git push origin --delete feature/error-handling-utility`
- [ ] Check off improvement #1 in [page-pattern-improvements.md](../page-pattern-improvements.md)
- [ ] Consider updating remaining pages (10+ pages can benefit):
  - Campaign abuse reports page
  - Campaign clicks page
  - Other detail pages with error handling
- [ ] Move to improvement #2: Unified Params Processing Pattern

---

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Using Wrong Import Path for Types

**Problem:** Importing `ApiResponse` from `@/types/api-errors` or `@/types/api.ts` (wrong)
**Solution:** Always import from `@/types` barrel export (correct):

```tsx
import type { ApiResponse } from "@/types"; // ✅ Correct
import type { ApiResponse } from "@/types/api-errors"; // ❌ Wrong
```

### Pitfall 2: Forgetting to Import notFound

**Problem:** Import error if `notFound` is not imported
**Solution:** Always import from `next/navigation` in the utility file

### Pitfall 3: Not Testing with Invalid IDs

**Problem:** 404 handling might not work in production
**Solution:** Always manually test with invalid IDs in browser

### Pitfall 4: Using Relative Imports

**Problem:** Violates project conventions, fails architectural tests
**Solution:** Always use path aliases (`@/utils/errors`, `@/types`)

### Pitfall 5: Incomplete Test Coverage

**Problem:** Edge cases not covered, bugs in production
**Solution:** Write tests for all scenarios including empty strings, undefined errors

### Pitfall 6: Not Clearing Context at Checkpoints

**Problem:** High token costs, slower responses
**Solution:** Clear context after each major phase as marked in plan

### Pitfall 7: Skipping Manual Testing

**Problem:** Unit tests pass but page doesn't work in browser
**Solution:** Always test in browser with both valid and invalid IDs

---

## Implementation Notes

### Why This Improvement First?

1. **Zero dependencies** - Can be implemented immediately
2. **High impact** - Affects 13+ pages in the application
3. **Low effort** - 2-3 hours total
4. **Immediate value** - Reduces code duplication right away
5. **Foundation for future work** - Establishes pattern for other utilities

### Error Messages to Detect

The `is404Error()` function detects these patterns (case-insensitive):

- "not found"
- "404"
- "does not exist"

These patterns cover Mailchimp API error messages and common 404 indicators.

### Next.js Error Handling Best Practices

**Reference:** https://nextjs.org/docs/app/getting-started/error-handling

#### notFound() Behavior

- `notFound()` triggers Next.js to render the `not-found.tsx` page
- It throws a special error that Next.js catches internally
- Safe to call in Server Components (our use case)
- Should be called early in the component lifecycle
- Project has not-found.tsx files at multiple levels:
  - `/src/app/not-found.tsx` (root level)
  - `/src/app/mailchimp/reports/[id]/not-found.tsx` (campaign detail)
  - `/src/app/mailchimp/reports/[id]/opens/not-found.tsx` (opens page)

#### Expected vs Unexpected Errors

**Expected Errors** (our utilities handle these):

- Model as return values, not exceptions
- Examples: 404 not found, validation failures, API errors
- Use `notFound()` for 404s, return error messages for others
- Allow conditional UI rendering based on error state

**Unexpected Errors** (not handled by these utilities):

- Throw to trigger error boundaries (error.tsx files)
- Examples: bugs, uncaught exceptions, programming errors
- Caught by nearest error.tsx boundary

#### Why We Return Error Messages

Following Next.js guidance, our utilities:

1. Call `notFound()` for 404 errors (special case)
2. Return error messages for other expected errors
3. Do NOT throw for API failures (expected errors)

This allows pages to conditionally render error UI using patterns like:

```tsx
const error = handleApiError(response);
if (error) {
  return <ErrorDisplay message={error} />;
}
```

Or use existing patterns like `MailchimpConnectionGuard` which handles `errorCode`.

### ApiResponse Type Structure

**Location:** `src/types/api-errors.ts`

```tsx
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string; // Used by MailchimpConnectionGuard
  statusCode?: number; // HTTP status code
  rateLimit?: {
    // Mailchimp rate limit info
    remaining: number;
    resetTime: Date;
    limit?: number;
  };
}
```

**Key Points:**

- The utilities handle both cases where `error` is defined and where it's undefined
- `errorCode` field is used by `MailchimpConnectionGuard` for OAuth/connection error handling
- Type is imported via `@/types` barrel export (not `@/types/api-errors` directly)

---

## Success Metrics

### Quantitative Metrics

- **Code reduction:** ~21 lines removed across 3 pages (~7 lines per page)
- **Test coverage:** 100% for error utility functions
- **Validation time:** All checks pass in under 2 minutes
- **Pages updated:** 3 pages as proof of concept
- **Potential impact:** 10+ additional pages can benefit

### Qualitative Metrics

- **Consistency:** All pages use identical error handling logic
- **Maintainability:** Single source of truth for 404 detection
- **Readability:** Pages are cleaner and easier to understand
- **Developer experience:** Faster to write new pages with error handling

---

**End of Execution Plan**

---

## Appendix: Quick Reference Commands

**Git Commands:**

```bash
# Setup
git checkout -b feature/error-handling-utility

# Status
git status
git branch --show-current

# Review changes
git diff
git diff main
git log --oneline main..HEAD

# Commit
git add .
git commit -m "message"

# Push
git push -u origin feature/error-handling-utility
```

**Validation Commands:**

```bash
# Fast checks
pnpm type-check
pnpm lint
pnpm lint:fix

# Testing
pnpm test src/utils/errors/
pnpm test:coverage

# Full validation
pnpm validate
```

**Development Commands:**

```bash
# Start dev server
pnpm dev

# Test URLs
https://127.0.0.1:3000/mailchimp/reports/valid-id
https://127.0.0.1:3000/mailchimp/reports/invalid-id
https://127.0.0.1:3000/mailchimp/lists/valid-id
https://127.0.0.1:3000/mailchimp/lists/invalid-id
```

---

**Execution Plan Complete - Ready to Implement** ✅
