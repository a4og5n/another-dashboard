# Phase 2: Update First Page (Proof of Concept)

**Goal:** Update campaign opens page to use the new type helper

**Estimated Time:** 15-20 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 1 complete (verify: `git log --oneline -1` shows type helper commit)
- [ ] On feature branch: `git branch --show-current` shows `feature/type-safety-metadata`
- [ ] Type helper file exists: `ls src/types/components/metadata.ts`

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if this page already uses the helper
grep "createMetadataFunction" src/app/mailchimp/reports/[id]/opens/page.tsx

# Check recent commits
git log --oneline -2

# If helper is already being used, inform user
```

**If phase is already complete:**

- Inform user: "Phase 2 appears to be already completed. The opens page already uses createMetadataFunction()"
- Ask: "Would you like me to verify the implementation or proceed to Phase 3?"

---

## Task 1: Review Current Implementation

### Step 1: Read the current metadata function

```bash
# View current generateMetadata implementation
grep -B 5 -A 20 "generateMetadata" src/app/mailchimp/reports/[id]/opens/page.tsx
```

**Take note of:**

- Current type annotations
- Metadata logic (will stay the same)
- Parameter handling
- Return structure

### Step 2: Read full file to understand imports

```bash
# Read the full file (first 50 lines to see imports)
head -50 src/app/mailchimp/reports/[id]/opens/page.tsx
```

---

## Task 2: Update Imports

### Step 1: Add import for type helper

Use the Edit tool to add the import near the top of the file with other imports:

```tsx
import { createMetadataFunction } from "@/types/components/metadata";
```

**Placement:** Add this with other utility imports (likely near the `import type { Metadata }` line).

### Validation

- [ ] Import added to file
- [ ] Import uses absolute path alias `@/types/components/metadata`
- [ ] Import placed logically with other imports

---

## Task 3: Replace Metadata Function

### Step 1: Locate the current generateMetadata function

The current implementation should look like:

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

### Step 2: Replace with type-safe version

Use the Edit tool to replace the entire function with:

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

**Key changes:**

- `async function` → `const` with arrow function
- Remove manual type annotations `{ params: Promise<{ id: string }> }`
- Remove return type annotation `Promise<Metadata>`
- Wrap entire function with `createMetadataFunction()`
- **Keep all logic identical** (only type annotations changed)

### Validation

- [ ] Function replaced with type-safe version
- [ ] Logic remains identical
- [ ] Only type annotations removed
- [ ] Wrapped with `createMetadataFunction()`

---

## Task 4: Run Validation Commands

```bash
# Type check should pass
pnpm type-check

# Run page-specific tests (if they exist)
pnpm test src/app/mailchimp/reports/

# Quick validation
pnpm quick-check
```

### Expected Results

- ✅ Type checking passes
- ✅ No type errors in the file
- ✅ Tests pass (if any exist for this page)
- ✅ No linting errors

### If Validation Fails

**Common issues:**

1. **Import not found:** Check barrel exports from Phase 1
2. **Type mismatch:** Verify function signature matches expected shape
3. **Lint error:** Run `pnpm lint:fix`

**Troubleshooting:**

```bash
# Check import resolution
pnpm type-check 2>&1 | grep "metadata"

# If errors, verify exports
cat src/types/components/index.ts | grep metadata
```

---

## Task 5: Manual Testing

### Step 1: Start development server

```bash
# Start dev server
pnpm dev
```

### Step 2: Test the page

1. Visit: `http://127.0.0.1:3000/mailchimp/reports/[any-test-id]/opens`
2. Check browser tab title
3. Check for console errors (open DevTools)
4. Verify page loads correctly

**What to verify:**

- [ ] Page loads without errors
- [ ] Browser tab title appears correct
- [ ] No console errors in DevTools
- [ ] No TypeScript errors in terminal
- [ ] Functionality unchanged from before

### Step 3: Stop dev server

```bash
# Press Ctrl+C to stop the server
```

---

## Final Validation Checklist

- [ ] ✅ Import added: `createMetadataFunction`
- [ ] ✅ Function replaced with type-safe version
- [ ] ✅ Logic unchanged (only types removed)
- [ ] ✅ Type checking passes: `pnpm type-check`
- [ ] ✅ Linting passes: `pnpm lint`
- [ ] ✅ Manual testing completed
- [ ] ✅ Page loads correctly in browser
- [ ] ✅ Metadata displays correctly
- [ ] ✅ No console errors

---

## Checkpoint: COMMIT

```bash
# Stage the modified file
git add src/app/mailchimp/reports/[id]/opens/page.tsx

# Create commit
git commit -m "refactor(pages): use type-safe metadata helper in opens page

- Replace manual type annotations with createMetadataFunction()
- Eliminate repetitive type declarations
- Maintain same functionality with better type safety
- First proof of concept for metadata type helper"

# Verify commit
git log --oneline -1
git show --stat
```

**Verify commit includes:**

- ✅ `src/app/mailchimp/reports/[id]/opens/page.tsx`
- ✅ Shows import addition and function changes

---

## ✅ Phase 2 Complete!

**What we accomplished:**

- ✅ Updated first page to use type helper
- ✅ Eliminated manual type annotations
- ✅ Maintained all functionality
- ✅ Proof of concept successful
- ✅ All validation passes

**Impact:**

- **Before:** 5 lines of manual type annotations
- **After:** 1 line with type inference
- **Benefit:** Cleaner code, better DX, same functionality

**Next Steps:**

Phase 3 will apply the same pattern to the abuse reports page.

---

## 🛑 STOP HERE

**Phase 2 Complete - Do not proceed to Phase 3 without user confirmation**

**Before continuing:**

1. ✅ Code committed
2. ✅ Tests passing
3. ✅ Manual testing completed
4. ✅ Pattern proven to work

**💰 Cost Optimization:** This is a good point to clear conversation context if needed

- Phases 1 & 2 are committed and validated
- Type helper is working and tested
- Next phase is independent (applying same pattern to another page)

**📋 What to keep if clearing:**

- This execution plan document
- Current task: "Update second page with metadata helper"

**To Continue:**

User should explicitly say "Start Phase 3" or open `phase-3-checklist.md`

---

**Next:** [Phase 3: Update Second Page](phase-3-checklist.md)
