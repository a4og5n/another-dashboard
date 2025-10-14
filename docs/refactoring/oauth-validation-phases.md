# OAuth Validation Architecture Refactor - Phased Plan

**Branch:** `refactor/oauth-validation-architecture`
**Start Date:** 2025-10-14
**Status:** Phase 4 Complete ✅ | Phase 5 Ready

---

## Problem Statement

Current architecture has OAuth validation logic in UI components (`MailchimpConnectionGuard`), violating separation of concerns. Validation should happen at the DAL layer, with components handling pure UI logic.

**Current Flow (Problematic):**

```
Page → validateMailchimpConnection() → DAL.healthCheck() → DB
     → MailchimpConnectionGuard (validates) → children
```

**Target Flow (Next.js Best Practices):**

```
Page → DAL method → mailchimpApiCall → getUserMailchimpClient (validates)
     → RETURNS ApiResponse<T> with errorCode
     → MailchimpConnectionGuard (pure UI) → renders based on errorCode
```

---

## Phase Breakdown

### ✅ Phase 0: Setup & Branch Creation

**Status:** Complete
**Branch:** Created
**Baseline:** Clean (type-check + lint passing)

---

### ✅ Phase 1: Type System & Error Code Foundation

**Goal:** Establish type-safe error handling infrastructure

**Status:** Complete

**Files Modified:**

- `/src/types/api-errors.ts` - Added `errorCode?: string` field
- `/src/types/auth/mailchimp-validation.ts` - Created validation result types
- `/src/types/auth/index.ts` - Exported new types

**Commit:** `feat(types): add error code support for Mailchimp validation`
**Commit Hash:** `af3d36c`

**Results:**

- ✅ Type-check: Passing
- ✅ Lint: Passing
- ✅ Tests: 482 passing

---

### ✅ Phase 2: DAL Layer - Client Factory Validation

**Goal:** Move validation logic into client factory

**Status:** Complete

**Files Modified:**

- `/src/lib/mailchimp-client-factory.ts` - Added validation + in-memory cache (1-hour TTL)
- `/src/lib/mailchimp-action-wrapper.ts` - Mapped errors to errorCode
- `/src/constants/auth/error-codes.ts` - Added VALIDATION_CACHE_TTL_MS constant
- Tests: Updated 23 tests (12 client factory + 11 action wrapper)

**Commit:** `refactor(dal): move OAuth validation into client factory layer`
**Commit Hash:** `2eb461d`

**Key Changes:**

- Added `validateUserConnection()` with structured validation results
- Implemented in-memory caching to reduce DB queries
- Added cache management: `invalidateValidationCache()`, `clearValidationCache()`
- All errors now include `errorCode` property

**Results:**

- ✅ Type-check: Passing
- ✅ Lint: Passing (7 pre-existing warnings in test mocks)
- ✅ Tests: 482 passing (including 23 new/updated tests)
- ✅ A11y: All passing

---

### ✅ Phase 3: Component Layer - Pure UI Guard

**Goal:** Refactor guard component to pure UI

**Status:** Complete

**Files Modified:**

- `/src/components/mailchimp/mailchimp-connection-guard.tsx` - Removed validation, accepts errorCode prop
- `/src/components/mailchimp/mailchimp-connection-guard.test.tsx` - Created comprehensive test suite (14 tests)
- `/src/components/mailchimp/mailchimp-connection-banner.tsx` - Added aria-label for a11y

**Commit:** `refactor(components): convert MailchimpConnectionGuard to pure UI component`
**Commit Hash:** `87e78bb`

**Key Changes:**

- Changed from `async` server component to synchronous pure UI component
- Removed `validateMailchimpConnection()` import and call
- Added `errorCode` prop to receive validation state from parent
- Component now purely presentational - no business logic
- Updated JSDoc with new usage examples showing DAL integration

**Results:**

- ✅ Type-check: Passing
- ✅ Lint: Passing (7 pre-existing warnings in test mocks)
- ✅ Tests: 496 passing (including 14 new guard tests)
- ✅ A11y: All passing

---

### ✅ Phase 4: Page Migration - New Pattern

**Goal:** Update all Mailchimp pages to use new architecture

**Status:** Complete

**Files Modified:**

- `/src/app/mailchimp/page.tsx` - Added health check call, pass errorCode to guard
- `/src/app/mailchimp/general-info/page.tsx` - Removed function child pattern, pass errorCode to guard
- `/src/app/mailchimp/lists/page.tsx` - Removed manual validation + empty state, use guard with errorCode
- `/src/app/mailchimp/reports/page.tsx` - Removed manual validation + empty state, use guard with errorCode
- `/src/app/mailchimp/reports/[id]/page.tsx` - Added guard with errorCode for consistency
- `/src/app/mailchimp/reports/[id]/opens/page.tsx` - Added guard with errorCode for consistency

**Commit:** `refactor(pages): migrate Mailchimp pages to DAL-based validation pattern`
**Commit Hash:** `[pending]`

**Key Changes:**

- **Unified Pattern:** All pages now use the same pattern: fetch data → pass errorCode to guard → render
- **Removed Boilerplate:** Eliminated 40+ lines of manual validation code per page
- **Simpler Page Logic:** No more Kinde auth checks, manual validation, or custom empty states
- **Guard Handles UI:** `MailchimpConnectionGuard` now handles all connection-related UI
- **Health Check for Non-Data Pages:** Main dashboard page uses `healthCheck()` for validation

**Before (Manual Validation - 72 lines):**

```tsx
export default async function ListsPage({ searchParams }: ListsPageProps) {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();
  if (!isAuthed) redirect("/api/auth/login?...");

  // 2. Check Mailchimp connection
  const connectionStatus = await validateMailchimpConnection();

  // 3. Show empty state if not connected
  if (!connectionStatus.isValid) {
    return <DashboardLayout><MailchimpEmptyState error={...} /></DashboardLayout>;
  }

  // 4. Show connected page
  return <DashboardLayout>...</DashboardLayout>;
}
```

**After (DAL-Based Validation - 27 lines):**

```tsx
async function ListsPageContent({ searchParams }: ListsPageProps) {
  const { apiParams, currentPage, pageSize } = await processPageParams({...});

  // Fetch lists (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchLists(apiParams);

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? <ListOverview ... /> : <ListOverview error={...} />}
    </MailchimpConnectionGuard>
  );
}

export default function ListsPage({ searchParams }: ListsPageProps) {
  return <DashboardLayout><Suspense><ListsPageContent ... /></Suspense></DashboardLayout>;
}
```

**Results:**

- ✅ Type-check: Passing
- ✅ Lint: Passing (7 pre-existing warnings in test mocks)
- ✅ Tests: 496 passing (no test updates needed - tests mock DAL layer)
- ✅ A11y: All passing
- ✅ Code reduction: ~200 lines removed across all pages
- ✅ Pattern consistency: All 6 pages now use identical validation pattern

---

### 🧹 Phase 5: Cleanup & Deprecation

**Goal:** Remove old validation utility and finalize

**Files to Modify:**

- `/src/lib/validate-mailchimp-connection.ts` - Deprecate or remove
- `/src/lib/index.ts` - Update exports
- Search for remaining usage
- Update CLAUDE.md if needed

**Commit:** `chore: remove deprecated validateMailchimpConnection utility`

**Status:** Pending

---

## Benefits

✅ **Follows Next.js error handling:** Return values, not exceptions
✅ **Single Source of Truth:** Validation only in client factory
✅ **Automatic Validation:** No manual validation calls needed
✅ **Better Performance:** One DB query instead of two
✅ **Structured Error Codes:** Type-safe error handling
✅ **Path Aliases:** Consistent import strategy
✅ **Proper Organization:** Types in `/types/`, constants in `/constants/`
✅ **Easier Testing:** Pure functions, clear boundaries

---

## Current State (Phase 0)

### Validation Logic Locations

1. **Component:** `src/components/mailchimp/mailchimp-connection-guard.tsx` - Calls validation
2. **Utility:** `src/lib/validate-mailchimp-connection.ts` - Validation logic
3. **Pages (Manual):** Some pages call validation directly

### Pages Using Each Pattern

**Pattern A (Guard Component):**

- `/src/app/mailchimp/page.tsx`
- `/src/app/mailchimp/general-info/page.tsx`

**Pattern B (Manual Validation):**

- `/src/app/mailchimp/lists/page.tsx`
- `/src/app/mailchimp/reports/page.tsx`
- `/src/app/mailchimp/reports/[id]/page.tsx`
- `/src/app/mailchimp/reports/[id]/opens/page.tsx`

### Baseline Test Results

- ✅ Type-check: Passing
- ✅ Lint: Passing (7 pre-existing warnings in test mocks)
- ✅ Git status: Clean working directory on new branch

---

## Progress Summary

### Completed Phases

- ✅ **Phase 0:** Setup & Branch Creation
- ✅ **Phase 1:** Type System & Error Code Foundation (Commit: `af3d36c`)
- ✅ **Phase 2:** DAL Layer - Client Factory Validation (Commit: `2eb461d`)
- ✅ **Phase 3:** Component Layer - Pure UI Guard (Commit: `87e78bb`)
- ✅ **Phase 4:** Page Migration - New Pattern (Commit: `[pending]`)

### Current Status

**Active:** Ready to start Phase 5
**Next Task:** Remove deprecated validateMailchimpConnection utility

### Validation Status

All validation checks passing after Phase 4:

- ✅ Type-check: Passing
- ✅ Lint: Passing (7 pre-existing warnings)
- ✅ Tests: 496 passing
- ✅ A11y: All passing
- ✅ All 6 Mailchimp pages migrated to unified pattern

---

## Next Steps

Start Phase 5: Cleanup & Deprecation - Remove old validation utility
