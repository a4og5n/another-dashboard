# OAuth Validation Architecture Refactor - Phased Plan

**Branch:** `refactor/oauth-validation-architecture`
**Start Date:** 2025-10-14
**Status:** Phase 0 Complete ✅

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

### 📝 Phase 1: Type System & Error Code Foundation

**Goal:** Establish type-safe error handling infrastructure

**Files to Modify:**

- `/src/types/api-errors.ts` - Add `errorCode?: string` field
- `/src/types/auth/mailchimp-validation.ts` - Create validation result types
- `/src/types/auth/index.ts` - Export new types

**Commit:** `feat(types): add error code support for Mailchimp validation`

**Status:** Pending

---

### 🏭 Phase 2: DAL Layer - Client Factory Validation

**Goal:** Move validation logic into client factory

**Files to Modify:**

- `/src/lib/mailchimp-client-factory.ts` - Add validation + in-memory cache
- `/src/lib/mailchimp-action-wrapper.ts` - Map errors to errorCode
- Tests for validation logic

**Commit:** `refactor(dal): move OAuth validation into client factory layer`

**Status:** Pending

---

### 🎨 Phase 3: Component Layer - Pure UI Guard

**Goal:** Refactor guard component to pure UI

**Files to Modify:**

- `/src/components/mailchimp/mailchimp-connection-guard.tsx` - Remove validation, accept errorCode prop
- Component tests

**Commit:** `refactor(components): convert MailchimpConnectionGuard to pure UI component`

**Status:** Pending

---

### 📄 Phase 4: Page Migration - New Pattern

**Goal:** Update all Mailchimp pages to use new architecture

**Files to Modify:**

- `/src/app/mailchimp/page.tsx`
- `/src/app/mailchimp/general-info/page.tsx`
- `/src/app/mailchimp/lists/page.tsx`
- `/src/app/mailchimp/reports/page.tsx`
- `/src/app/mailchimp/reports/[id]/page.tsx`
- `/src/app/mailchimp/reports/[id]/opens/page.tsx`
- Page tests

**Commit:** `refactor(pages): migrate Mailchimp pages to DAL-based validation pattern`

**Status:** Pending

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

## Next Steps

Start Phase 1: Type System & Error Code Foundation
