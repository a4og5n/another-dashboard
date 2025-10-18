# Execution Plan: Type Safety for Metadata Functions

**Task Reference:** [docs/page-pattern-improvements.md](../../page-pattern-improvements.md) - Improvement #6
**Estimated Effort:** 2 hours
**Created:** 2025-10-17

---

## Overview

**Goal:** Create type-safe helpers for Next.js `generateMetadata` functions to eliminate type errors and improve developer experience when working with dynamic metadata.

**Problem Statement:**

Currently, `generateMetadata` functions in dynamic pages require manual type annotations:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);
  // ... metadata logic
}
```

This pattern has several issues:

- **Type repetition:** Every dynamic page repeats `params: Promise<{ id: string }>`
- **Manual typing:** Easy to make mistakes with parameter types
- **Inconsistency:** Some pages may have different param shapes (e.g., `{ id: string; slug: string }`)
- **No type inference:** TypeScript doesn't help with parameter types

**Success Criteria:**

- ✅ Type helper created for `generateMetadata` functions
- ✅ Helper supports custom parameter shapes (generic)
- ✅ Helper provides type inference and autocomplete
- ✅ Documentation added to CLAUDE.md
- ✅ At least 2 pages updated to use the helper (proof of concept)
- ✅ All tests pass

**Files to Create:**

**Types:**

- `src/types/components/metadata.ts` - Type helper for metadata functions
- `src/types/components/index.ts` - Update barrel export (if needed)

**Files to Modify:**

- `src/types/components/index.ts` - Export new metadata types
- `src/types/index.ts` - Ensure metadata types are exported
- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Use type helper (example)
- `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx` - Use type helper (example)
- `CLAUDE.md` - Document the pattern

---

## Pre-Implementation Checklist

Before writing any code:

- [ ] Review Next.js `generateMetadata` documentation
- [ ] Review current metadata implementations in existing pages
- [ ] Understand Next.js 15 `params` as Promise pattern
- [ ] Review project type conventions in `src/types/`
- [ ] Check existing type helper patterns in the codebase
- [ ] Understand TypeScript generics for flexible type helpers

---

## Git Workflow

**Branch Strategy:**

```bash
feature/type-safety-metadata
```

**Commit Points:**

1. After creating type helper
2. After updating first page (proof of concept)
3. After updating second page
4. After documentation update

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
git checkout -b feature/type-safety-metadata

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/type-safety-metadata (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to metadata type safety
git log --oneline --all --grep="metadata.*type\|type.*metadata"

# Check if type helper file already exists
ls src/types/components/metadata.ts 2>/dev/null && echo "File exists" || echo "File doesn't exist"

# Check existing metadata patterns
grep -l "generateMetadata" src/app/**/page.tsx | head -5
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

- [ ] Read Next.js `generateMetadata` documentation
- [ ] Understand `params: Promise<T>` pattern in Next.js 15
- [ ] Review current implementations in 4 pages with dynamic metadata
- [ ] Understand project type organization (`src/types/components/`)
- [ ] Know TypeScript generic type patterns

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should be v24.7.0
pnpm --version  # Should be v10.15.0

# Ensure dependencies are installed
pnpm install

# Verify TypeScript compilation works
pnpm type-check
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for type-safety-metadata"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Create Type Helper for Metadata Functions

**Goal:** Create type-safe helper for `generateMetadata` functions with generic parameter support

**Estimated Time:** 30-40 minutes

**Pre-Phase Checklist:**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify file doesn't exist: `ls src/types/components/metadata.ts`
- [ ] Check if related commits already exist
- [ ] If phase is already complete, inform user and ask for next steps

### Implementation Steps

#### 1. Create Type Definition File

```bash
# Create metadata types file
touch src/types/components/metadata.ts
```

**File content to create:**

````tsx
/**
 * Type helpers for Next.js generateMetadata functions
 *
 * Provides type-safe wrappers for metadata generation with automatic
 * parameter type inference and consistent typing across pages.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { Metadata } from "next";

/**
 * Props shape for generateMetadata with dynamic params
 *
 * @template TParams - Shape of the dynamic route parameters (e.g., { id: string })
 *
 * @example
 * ```tsx
 * type MyPageMetadataProps = MetadataProps<{ id: string; slug: string }>;
 * ```
 */
export type MetadataProps<TParams = { id: string }> = {
  params: Promise<TParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Type for generateMetadata function with custom parameter shape
 *
 * @template TParams - Shape of the dynamic route parameters
 *
 * @example
 * ```tsx
 * const generateMetadata: GenerateMetadata<{ id: string }> = async ({ params }) => {
 *   const { id } = await params;
 *   return { title: `Report ${id}` };
 * };
 * ```
 */
export type GenerateMetadata<TParams = { id: string }> = (
  props: MetadataProps<TParams>,
) => Promise<Metadata> | Metadata;

/**
 * Helper function to create type-safe generateMetadata functions
 *
 * Provides type inference and autocomplete for metadata function parameters.
 * Supports custom parameter shapes through generics.
 *
 * @template TParams - Shape of the dynamic route parameters (default: { id: string })
 * @param fn - The metadata generation function
 * @returns Type-safe metadata function
 *
 * @example
 * ```tsx
 * // Simple usage with default { id: string } params
 * export const generateMetadata = createMetadataFunction(async ({ params }) => {
 *   const { id } = await params;
 *   return {
 *     title: `Campaign Report ${id}`,
 *     description: "View campaign analytics"
 *   };
 * });
 *
 * // Custom params shape
 * export const generateMetadata = createMetadataFunction<{ id: string; slug: string }>(
 *   async ({ params }) => {
 *     const { id, slug } = await params;
 *     return {
 *       title: `${slug} - Report ${id}`,
 *     };
 *   }
 * );
 * ```
 */
export function createMetadataFunction<TParams = { id: string }>(
  fn: GenerateMetadata<TParams>,
): GenerateMetadata<TParams> {
  return fn;
}
````

#### 2. Update Barrel Exports

**Check if `src/types/components/index.ts` exists and update it:**

```bash
# Check if file exists
ls src/types/components/index.ts
```

If it exists, read it first, then add the export:

```tsx
// Add to src/types/components/index.ts
export * from "@/types/components/metadata";
```

#### 3. Verify Main Types Export

```bash
# Check if metadata types are exported from main types index
grep "components" src/types/index.ts
```

Ensure `src/types/index.ts` exports from components:

```tsx
export * from "@/types/components";
```

### Validation

```bash
# Type check should pass
pnpm type-check

# No linting errors
pnpm lint
```

**Validation Checklist:**

- [ ] `src/types/components/metadata.ts` created with JSDoc
- [ ] Barrel export added to `src/types/components/index.ts`
- [ ] Types exported through `src/types/index.ts`
- [ ] TypeScript compilation passes
- [ ] No linting errors

**Checkpoint: COMMIT**

```bash
git add src/types/components/metadata.ts src/types/components/index.ts
git commit -m "feat(types): add type-safe helpers for generateMetadata functions

- Add MetadataProps<TParams> type for metadata function props
- Add GenerateMetadata<TParams> type for metadata functions
- Add createMetadataFunction() helper with generic support
- Support custom parameter shapes (not just { id: string })
- Comprehensive JSDoc with usage examples"
```

---

## Phase 2: Update First Page (Proof of Concept)

**Goal:** Update campaign opens page to use the new type helper

**Estimated Time:** 15-20 minutes

**Pre-Phase Checklist:**

- [ ] Phase 1 complete (verify: `git log --oneline -1` shows type helper commit)
- [ ] Type helper file exists: `ls src/types/components/metadata.ts`
- [ ] Check if this page already uses the helper: `grep "createMetadataFunction" src/app/mailchimp/reports/[id]/opens/page.tsx`

### Implementation Steps

#### 1. Read Current Implementation

```bash
# Review current metadata implementation
grep -A 10 "generateMetadata" src/app/mailchimp/reports/[id]/opens/page.tsx
```

#### 2. Update Imports

Add the type helper import to the page:

```tsx
// Add to imports at top of file
import { createMetadataFunction } from "@/types/components/metadata";
```

#### 3. Replace Metadata Function

**Before:**

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success) {
    return {
      title: "Campaign Opens | Another Dashboard",
      description: "View members who opened this campaign",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Opens | Another Dashboard`,
    description: `View the ${report.opens.opens_total} members who opened ${report.campaign_title}`,
  };
}
```

**After:**

```tsx
export const generateMetadata = createMetadataFunction(async ({ params }) => {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success) {
    return {
      title: "Campaign Opens | Another Dashboard",
      description: "View members who opened this campaign",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Opens | Another Dashboard`,
    description: `View the ${report.opens.opens_total} members who opened ${report.campaign_title}`,
  };
});
```

### Validation

```bash
# Type check should pass
pnpm type-check

# Run tests
pnpm test src/app/mailchimp/reports/

# Manual testing
pnpm dev
# Visit: http://127.0.0.1:3000/mailchimp/reports/[any-id]/opens
# Check browser tab title updates correctly
```

**Validation Checklist:**

- [ ] Page compiles without errors
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] Page loads correctly in browser
- [ ] Metadata shows in browser tab title
- [ ] No console errors

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/opens/page.tsx
git commit -m "refactor(pages): use type-safe metadata helper in opens page

- Replace manual type annotations with createMetadataFunction()
- Eliminate repetitive type declarations
- Maintain same functionality with better type safety"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phase 1 & 2 complete and committed
- Type helper is working and tested
- Next phase is independent (applying same pattern to another page)

📋 What to keep:

- This execution plan document
- Current task: "Update second page with metadata helper"

---

## Phase 3: Update Second Page

**Goal:** Apply the same pattern to abuse reports page

**Estimated Time:** 10-15 minutes

**Pre-Phase Checklist:**

- [ ] Phase 2 complete (verify: `git log --oneline -2` shows opens page commit)
- [ ] Check if this page already uses the helper: `grep "createMetadataFunction" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx`

### Implementation Steps

#### 1. Read Current Implementation

```bash
# Review current metadata implementation
grep -A 10 "generateMetadata" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
```

#### 2. Update Imports

```tsx
// Add to imports at top of file
import { createMetadataFunction } from "@/types/components/metadata";
```

#### 3. Replace Metadata Function

Apply the same transformation as Phase 2:

- Remove explicit type annotations
- Wrap with `createMetadataFunction()`
- Keep all logic the same

#### 4. Manual Testing

```bash
# Start dev server
pnpm dev

# Visit the page
# http://127.0.0.1:3000/mailchimp/reports/[any-id]/abuse-reports

# Verify:
# - Page loads correctly
# - Browser tab title is correct
# - No console errors
```

### Validation

```bash
# Type check
pnpm type-check

# Run tests
pnpm test src/app/mailchimp/reports/

# Full test suite
pnpm test
```

**Validation Checklist:**

- [ ] Page compiles without errors
- [ ] No TypeScript errors
- [ ] Page loads correctly in browser
- [ ] Metadata shows correctly
- [ ] All tests pass

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
git commit -m "refactor(pages): use type-safe metadata helper in abuse reports page

- Apply createMetadataFunction() pattern
- Consistent metadata typing across report pages"
```

---

## Phase 4: Documentation and Final Validation

**Goal:** Document the pattern and run full validation

**Estimated Time:** 20-25 minutes

**Pre-Phase Checklist:**

- [ ] Phase 3 complete (verify: all previous commits present)
- [ ] Check if CLAUDE.md already documents this: `grep -i "metadata.*type\|createMetadataFunction" CLAUDE.md`

### Implementation Steps

#### 1. Update CLAUDE.md

Add a new section under "Component Development" or after "Page Component Headers":

````markdown
#### Metadata Type Safety

**Problem:** `generateMetadata` functions require manual type annotations that are repetitive and error-prone.

**Solution:** Use type-safe helpers from `@/types/components/metadata`:

```tsx
import { createMetadataFunction } from "@/types/components/metadata";
import type {
  MetadataProps,
  GenerateMetadata,
} from "@/types/components/metadata";

// Simple usage (default { id: string } params)
export const generateMetadata = createMetadataFunction(async ({ params }) => {
  const { id } = await params;
  return {
    title: `Report ${id}`,
    description: "View campaign analytics",
  };
});

// Custom params shape
export const generateMetadata = createMetadataFunction<{
  id: string;
  slug: string;
}>(async ({ params }) => {
  const { id, slug } = await params;
  return {
    title: `${slug} - Report ${id}`,
  };
});
```
````

**Benefits:**

- Type inference and autocomplete
- No manual type annotations needed
- Supports custom parameter shapes via generics
- Consistent typing across all pages

**When to use:**

- All dynamic pages with `generateMetadata` and route params
- Pages with custom parameter shapes (multiple dynamic segments)

````

#### 2. Run Full Validation Suite

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# All tests
pnpm test

# Full validation (includes build)
pnpm validate
````

#### 3. Review All Changes

```bash
# Review commit history
git log --oneline main..HEAD

# Review all changes vs main
git diff main

# Count modified files
git diff main --stat
```

**Expected changes:**

- 1 new file: `src/types/components/metadata.ts`
- 1 modified: `src/types/components/index.ts`
- 2 modified: pages using the helper
- 1 modified: `CLAUDE.md`

### Validation

**Validation Checklist:**

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all tests)
- [ ] `pnpm validate` passes (includes build)
- [ ] No console errors in dev server
- [ ] Documentation added to CLAUDE.md
- [ ] All commits have good messages
- [ ] Git hygiene is good (no unintended files)

**Checkpoint: COMMIT**

```bash
git add CLAUDE.md
git commit -m "docs: add metadata type safety pattern to CLAUDE.md

- Document createMetadataFunction() usage
- Include examples for simple and custom params
- Add when-to-use guidelines"
```

---

## Manual Review Checklist

Before pushing to origin:

### Code Quality

- [ ] **Type Safety**
  - [ ] All imports use path aliases (`@/types/components/metadata`)
  - [ ] No `any` types used
  - [ ] Generic types properly constrained
  - [ ] JSDoc comments comprehensive

- [ ] **Code Style**
  - [ ] Follows project conventions
  - [ ] No console.logs or debug code
  - [ ] Consistent formatting
  - [ ] No commented-out code

### Testing

- [ ] **Validation Commands**
  - [ ] `pnpm type-check` passes
  - [ ] `pnpm lint` passes
  - [ ] `pnpm test` passes
  - [ ] `pnpm validate` passes

- [ ] **Manual Testing**
  - [ ] Tested both updated pages in browser
  - [ ] Metadata appears correctly in browser tabs
  - [ ] No console errors
  - [ ] No TypeScript errors in IDE

### Documentation

- [ ] **JSDoc**
  - [ ] All exported types have JSDoc
  - [ ] Usage examples are clear and accurate
  - [ ] Type parameters documented

- [ ] **CLAUDE.md**
  - [ ] Pattern documented
  - [ ] Examples provided
  - [ ] Benefits explained

### Git Hygiene

- [ ] **Commits**
  - [ ] All commits follow conventional format
  - [ ] Each commit is focused and logical
  - [ ] Commit messages are descriptive

- [ ] **Branch**
  - [ ] On correct branch: `git branch --show-current`
  - [ ] No unintended files staged
  - [ ] All changes reviewed: `git diff main`

---

## Push to Origin

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Expected: 4-5 commits
# 1. Type helper creation
# 2. First page update (opens)
# 3. Second page update (abuse reports)
# 4. Documentation update

# Push to origin
git push -u origin feature/type-safety-metadata
```

---

## Create Pull Request

**Title:** `feat: add type-safe helpers for generateMetadata functions`

**Description:**

````markdown
## Summary

Implements improvement #6 from page-pattern-improvements.md. Creates type-safe helpers for Next.js `generateMetadata` functions to eliminate repetitive type annotations and improve developer experience.

## Changes

**Type Helpers:**

- Created `src/types/components/metadata.ts` with three exports:
  - `MetadataProps<TParams>` - Props type for metadata functions
  - `GenerateMetadata<TParams>` - Function type for metadata functions
  - `createMetadataFunction<TParams>()` - Helper function with type inference

**Key Features:**

- Generic parameter support (default: `{ id: string }`)
- Type inference and autocomplete
- Eliminates manual type annotations
- Comprehensive JSDoc with examples

**Pages Updated:**

- ✅ `/mailchimp/reports/[id]/opens` - Uses type helper
- ✅ `/mailchimp/reports/[id]/abuse-reports` - Uses type helper

**Documentation:**

- Updated CLAUDE.md with metadata type safety pattern
- Included usage examples and guidelines

## Before/After

**Before:**

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // ...
}
```
````

**After:**

```tsx
export const generateMetadata = createMetadataFunction(async ({ params }) => {
  const { id } = await params;
  // ... (type inference works automatically)
});
```

## Testing

- [x] Type checking passes (`pnpm type-check`)
- [x] Linting passes (`pnpm lint`)
- [x] All tests pass (`pnpm test`)
- [x] Build succeeds (`pnpm validate`)
- [x] Manual testing completed for both pages
- [x] Metadata displays correctly in browser

## Checklist

- [x] Type helpers created with full JSDoc
- [x] Helpers support generic parameter shapes
- [x] 2 pages updated as proof of concept
- [x] Documentation added to CLAUDE.md
- [x] No breaking changes
- [x] No functionality changes (type safety only)

## Future Work

This pattern can be applied to remaining pages with `generateMetadata`:

- `/mailchimp/reports/[id]/page.tsx` (currently uses utility, could use type helper too)
- Any future pages with dynamic metadata

## Related

- Implementation Plan: docs/page-pattern-improvements.md (#6)
- Execution Plan: docs/execution-plans/type-safety-metadata/execution-plan.md

````

---

## Rollback Plan

If issues are discovered:

```bash
# If not pushed yet - reset to main
git reset --hard main

# If pushed - create revert commit
git revert <commit-hash>
git push
````

---

## Post-Merge Tasks

After PR is merged:

- [ ] Delete feature branch locally: `git branch -d feature/type-safety-metadata`
- [ ] Delete feature branch remotely: `git push origin --delete feature/type-safety-metadata`
- [ ] Update page-pattern-improvements.md to mark #6 as complete
- [ ] Consider applying pattern to remaining pages with dynamic metadata

---

## Additional Notes

**Optional Enhancement:**

If time permits, consider updating the campaign report detail page to use the helper:

```tsx
// src/app/mailchimp/reports/[id]/page.tsx
// Currently: export const generateMetadata = generateCampaignReportMetadata;
// Could be: Use createMetadataFunction() if not using the utility
```

However, since that page uses the `generateCampaignReportMetadata` utility, it may not need the type helper.

**Future Improvements:**

The `createMetadataFunction()` helper could be extended to support:

- Search params validation
- Metadata caching
- Error handling for metadata generation

---

**End of Execution Plan**
