# Phase 1: Create Type Helper for Metadata Functions

**Goal:** Create type-safe helper for `generateMetadata` functions with generic parameter support

**Estimated Time:** 30-40 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 0 complete (verify: `git branch --show-current` shows `feature/type-safety-metadata`)
- [ ] On feature branch (NOT on main)
- [ ] Empty commit exists: `git log --oneline -1` shows initialization commit

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if type helper file already exists
ls src/types/components/metadata.ts

# Check recent commits
git log --oneline -5 --grep="metadata.*type"

# If file exists or commits found, inform user
```

**If phase is already complete:**

- Inform user: "Phase 1 appears to be already completed. Found file: src/types/components/metadata.ts"
- Ask: "Would you like me to verify the implementation or proceed to Phase 2?"

---

## Task 1: Create Type Definition File

### Step 1: Create the file

```bash
# Create metadata types file
touch src/types/components/metadata.ts
```

### Step 2: Implement the type helper

**File: `src/types/components/metadata.ts`**

Add the following content:

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

### Validation

- [ ] File created at `src/types/components/metadata.ts`
- [ ] All three exports present (MetadataProps, GenerateMetadata, createMetadataFunction)
- [ ] JSDoc comments comprehensive with examples
- [ ] Generic parameter support included

---

## Task 2: Update Barrel Exports

### Step 1: Check if components index exists

```bash
# Check if file exists
ls src/types/components/index.ts
```

### Step 2: Read current contents

```bash
# Read to understand current structure
cat src/types/components/index.ts
```

### Step 3: Add metadata export

Use the Edit tool to add the export to `src/types/components/index.ts`:

```tsx
export * from "@/types/components/metadata";
```

**Important:** Add this export following the existing pattern in the file (likely at the end with other exports).

### Validation

- [ ] Export added to `src/types/components/index.ts`
- [ ] Export uses absolute path with `@/` alias
- [ ] File follows existing export pattern

---

## Task 3: Verify Main Types Export

### Step 1: Check main types index

```bash
# Check if components are exported from main types index
grep "components" src/types/index.ts
```

### Step 2: Add export if needed

If not already present, add:

```tsx
export * from "@/types/components";
```

### Validation

- [ ] Main types index exports components
- [ ] Can import from `@/types/components/metadata`

---

## Task 4: Run Validation Commands

```bash
# Type check should pass
pnpm type-check

# No linting errors
pnpm lint

# Quick validation
pnpm quick-check
```

### Expected Results

- ✅ Type checking passes (no errors)
- ✅ Linting passes (no errors)
- ✅ No warnings related to new types

### If Validation Fails

**Common issues:**

1. **Import error:** Verify barrel exports are correct
2. **Type error:** Check generic syntax is correct
3. **Lint error:** Run `pnpm lint:fix` to auto-fix

**Troubleshooting:**

```bash
# Check if types can be imported
# Create a temporary test file
echo 'import type { MetadataProps } from "@/types/components/metadata";' > /tmp/test-import.ts

# If import fails, check barrel exports
cat src/types/components/index.ts
cat src/types/index.ts
```

---

## Final Validation Checklist

- [ ] ✅ `src/types/components/metadata.ts` created
- [ ] ✅ Three exports present: MetadataProps, GenerateMetadata, createMetadataFunction
- [ ] ✅ Comprehensive JSDoc with usage examples
- [ ] ✅ Generic parameter support (default: `{ id: string }`)
- [ ] ✅ Barrel export added to `src/types/components/index.ts`
- [ ] ✅ Main types index exports components
- [ ] ✅ Type checking passes: `pnpm type-check`
- [ ] ✅ Linting passes: `pnpm lint`
- [ ] ✅ No errors or warnings

---

## Checkpoint: COMMIT

```bash
# Stage the new files
git add src/types/components/metadata.ts src/types/components/index.ts

# If main types index was modified
git add src/types/index.ts

# Create commit
git commit -m "feat(types): add type-safe helpers for generateMetadata functions

- Add MetadataProps<TParams> type for metadata function props
- Add GenerateMetadata<TParams> type for metadata functions
- Add createMetadataFunction() helper with generic support
- Support custom parameter shapes (not just { id: string })
- Comprehensive JSDoc with usage examples"

# Verify commit
git log --oneline -1
git show --stat
```

**Verify commit includes:**

- ✅ `src/types/components/metadata.ts`
- ✅ `src/types/components/index.ts`
- ✅ Possibly `src/types/index.ts` (if updated)

---

## ✅ Phase 1 Complete!

**What we accomplished:**

- ✅ Created type-safe helper for generateMetadata functions
- ✅ Supports generic parameter shapes
- ✅ Comprehensive JSDoc documentation
- ✅ Proper barrel exports configured
- ✅ All validation passes

**Next Steps:**

Phase 2 will apply this helper to the first page (campaign opens) as proof of concept.

---

## 🛑 STOP HERE

**Phase 1 Complete - Do not proceed to Phase 2 without user confirmation**

**Before continuing:**

1. ✅ Code committed
2. ✅ Tests passing
3. ✅ Types working correctly

**💰 Cost Optimization:** This is a good point to clear conversation context if needed

- Phase 1 is committed and validated
- Next phase is independent (just using the helper)

**To Continue:**

User should explicitly say "Start Phase 2" or open `phase-2-checklist.md`

---

**Next:** [Phase 2: Update First Page](phase-2-checklist.md)
