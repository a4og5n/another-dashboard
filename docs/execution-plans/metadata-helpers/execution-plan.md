# Execution Plan: Complete Metadata Helper Functions

**Task Reference:** [docs/page-pattern-improvements.md](../../page-pattern-improvements.md) - Improvement #7
**Estimated Effort:** 2-3 hours (reduced from 4-5h since 50% complete)
**Created:** 2025-10-17

---

## Overview

**Goal:** Complete the metadata helper functions to eliminate inline metadata generation code across all pages, improving consistency and reducing duplication.

**Problem Statement:**

Currently, the project has partially implemented metadata helpers in `src/utils/mailchimp/metadata.ts`:

- ✅ Campaign report metadata helpers exist
- ✅ Campaign opens metadata helper exists
- ❌ Abuse reports metadata is still inline (~30 lines)
- ❌ No unified export from `@/utils/metadata`
- ❌ No list page metadata helpers (though none needed currently)

The abuse reports page has 30+ lines of inline metadata generation that duplicates the pattern from opens/report pages.

**Success Criteria:**

- ✅ Abuse reports metadata helper created in `src/utils/mailchimp/metadata.ts`
- ✅ Mailchimp metadata helpers exported from `@/utils/metadata.ts`
- ✅ Abuse reports page updated to use helper
- ✅ All tests pass
- ✅ Documentation updated in CLAUDE.md

**Files to Create:**

None - all files exist, we're only modifying existing files.

**Files to Modify:**

**Utilities:**

- `src/utils/mailchimp/metadata.ts` - Add `generateCampaignAbuseReportsMetadata()` function
- `src/utils/metadata.ts` - Export mailchimp metadata helpers

**Pages:**

- `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx` - Use helper instead of inline metadata

**Documentation:**

- `CLAUDE.md` - Update metadata helper pattern documentation

---

## Pre-Implementation Checklist

Before writing any code:

- [ ] Review existing metadata helpers in `src/utils/mailchimp/metadata.ts`
- [ ] Review current abuse reports page metadata implementation
- [ ] Understand the metadata helper pattern (async function taking params)
- [ ] Review project conventions for barrel exports
- [ ] Check that `@/utils/metadata` already exports `createMetadataFunction`
- [ ] Verify abuse reports page uses type-safe `GenerateMetadata` type

---

## Git Workflow

**Branch Strategy:**

```bash
feature/complete-metadata-helpers
```

**Commit Points:**

1. After adding abuse reports metadata helper
2. After updating barrel exports
3. After updating abuse reports page
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
git checkout -b feature/complete-metadata-helpers

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/complete-metadata-helpers (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to metadata helpers completion
git log --oneline --all --grep="metadata.*helper\|abuse.*metadata"

# Check if abuse reports metadata helper already exists
grep -n "generateCampaignAbuseReportsMetadata" src/utils/mailchimp/metadata.ts

# Check if abuse reports page still has inline metadata
grep -A 5 "generateMetadata" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx | head -10
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

- [ ] Read existing metadata helpers in `src/utils/mailchimp/metadata.ts`
- [ ] Understand the pattern: async function, params validation, DAL call, metadata return
- [ ] Review abuse reports page current metadata (30+ lines inline)
- [ ] Understand project barrel export conventions
- [ ] Know that `@/utils/metadata` currently only exports `createMetadataFunction`

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
git commit --allow-empty -m "chore: initialize feature branch for complete-metadata-helpers"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Add Abuse Reports Metadata Helper

**Goal:** Create reusable metadata helper for abuse reports pages following the existing pattern

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify function doesn't exist: `grep "generateCampaignAbuseReportsMetadata" src/utils/mailchimp/metadata.ts`
- [ ] If phase is already complete, inform user and ask for next steps

### Implementation Steps

#### 1. Review Existing Pattern

Read the existing metadata helpers to understand the pattern:

```bash
# Review opens metadata helper as reference
grep -A 30 "generateCampaignOpensMetadata" src/utils/mailchimp/metadata.ts
```

**Pattern to follow:**

- Async function that accepts `{ params: Promise<{ id: string }> }`
- Validates params with Zod schema
- Calls `mailchimpDAL.fetchCampaignReport(id)`
- Returns fallback metadata if response not successful
- Extracts report data and builds metadata object with title, description, openGraph

#### 2. Add Abuse Reports Schema Import

Check if `abuseReportsPageParamsSchema` needs to be imported:

```bash
# Check current imports
head -20 src/utils/mailchimp/metadata.ts
```

If not present, add to imports:

```tsx
import {
  reportPageParamsSchema,
  reportOpensPageParamsSchema,
  abuseReportsPageParamsSchema, // Add this
} from "@/schemas/components";
```

#### 3. Add the Helper Function

Add to `src/utils/mailchimp/metadata.ts` after `generateCampaignOpensMetadata`:

```tsx
/**
 * Generates metadata specifically for campaign abuse reports pages
 * @param params - Object containing the campaign ID
 * @returns Next.js Metadata object for the abuse reports page
 */
export async function generateCampaignAbuseReportsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Abuse Reports - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;
  const abuseReportCount = report.abuse_reports || 0;

  return {
    title: `${report.campaign_title} - Abuse Reports`,
    description: `View abuse reports and spam complaints for ${report.campaign_title}. ${
      abuseReportCount === 0
        ? "No abuse reports recorded."
        : `${abuseReportCount.toLocaleString()} ${abuseReportCount === 1 ? "report" : "reports"} received.`
    }`,
    openGraph: {
      title: `${report.campaign_title} - Abuse Reports`,
      description:
        abuseReportCount === 0
          ? `No abuse reports for campaign sent to ${report.emails_sent.toLocaleString()} recipients`
          : `${abuseReportCount} ${abuseReportCount === 1 ? "abuse report" : "abuse reports"} from ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}
```

### Validation

```bash
# Type check should pass
pnpm type-check

# No linting errors
pnpm lint
```

**Validation Checklist:**

- [ ] Function signature matches existing helpers pattern
- [ ] Uses correct schema for params validation
- [ ] Follows same error handling pattern (fallback metadata)
- [ ] TypeScript compilation passes
- [ ] No linting errors

**Checkpoint: COMMIT**

```bash
git add src/utils/mailchimp/metadata.ts
git commit -m "feat(utils): add abuse reports metadata helper

- Add generateCampaignAbuseReportsMetadata() function
- Follows same pattern as opens/report metadata helpers
- Includes fallback metadata for error cases
- Adds OpenGraph metadata support"
```

---

## Phase 2: Export Mailchimp Metadata Helpers

**Goal:** Make mailchimp metadata helpers available through unified `@/utils/metadata` import

**Estimated Time:** 10 minutes

**Pre-Phase Checklist:**

- [ ] Phase 1 complete (verify: `git log --oneline -1` shows metadata helper commit)
- [ ] Check if exports already added: `grep "mailchimp/metadata" src/utils/metadata.ts`

### Implementation Steps

#### 1. Update Main Metadata Utilities Export

Add mailchimp metadata helpers to `src/utils/metadata.ts`:

```tsx
/**
 * Utility functions for Next.js metadata generation
 *
 * Provides helper functions for creating type-safe generateMetadata implementations.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { GenerateMetadata } from "@/types/components/metadata";

/**
 * Helper function to create type-safe generateMetadata functions
 *
 * [Keep existing JSDoc and function implementation]
 */
export function createMetadataFunction<TParams = { id: string }>(
  fn: GenerateMetadata<TParams>,
): GenerateMetadata<TParams> {
  return fn;
}

// Re-export mailchimp metadata helpers for convenience
export {
  generateCampaignMetadata,
  generateCampaignReportMetadata,
  generateCampaignOpensMetadata,
  generateCampaignAbuseReportsMetadata,
} from "@/utils/mailchimp/metadata";
```

### Validation

```bash
# Type check should pass
pnpm type-check

# Verify exports work
grep -n "export.*generateCampaign" src/utils/metadata.ts
```

**Validation Checklist:**

- [ ] Mailchimp helpers re-exported from main metadata file
- [ ] TypeScript compilation passes
- [ ] No circular dependency warnings

**Checkpoint: COMMIT**

```bash
git add src/utils/metadata.ts
git commit -m "feat(utils): export mailchimp metadata helpers from main metadata module

- Re-export all campaign metadata helpers for unified imports
- Allows importing from @/utils/metadata instead of @/utils/mailchimp/metadata
- Improves developer experience with centralized metadata exports"
```

---

## Phase 3: Update Abuse Reports Page

**Goal:** Replace inline metadata with helper function

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Phase 2 complete (verify: `git log --oneline -2` shows both commits)
- [ ] Check if page already uses helper: `grep "generateCampaignAbuseReportsMetadata" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx`

### Implementation Steps

#### 1. Review Current Implementation

```bash
# Check current metadata implementation (should be inline)
grep -A 40 "generateMetadata" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
```

#### 2. Update Imports

Replace or update imports in the abuse reports page:

**Remove these imports (if present):**

```tsx
import { mailchimpDAL } from "@/dal/mailchimp.dal";
// Only if not used elsewhere in the file
```

**Add this import:**

```tsx
import { generateCampaignAbuseReportsMetadata } from "@/utils/metadata";
```

#### 3. Replace Inline Metadata with Helper

**Before (30+ lines):**

```tsx
export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const rawParams = await params;
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Abuse Reports - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;
  const abuseReportCount = report.abuse_reports || 0;

  return {
    title: `${report.campaign_title} - Abuse Reports`,
    description: `...`,
    openGraph: { ... },
  };
};
```

**After (1 line):**

```tsx
export const generateMetadata = generateCampaignAbuseReportsMetadata;
```

**Note:** This simple assignment works because the helper function already has the correct type signature.

#### 4. Clean Up Unused Imports

If `abuseReportsPageParamsSchema` is no longer used in the page (only used in metadata now), remove it:

```tsx
// Remove if not used elsewhere:
import { abuseReportsPageParamsSchema } from "@/schemas/components";
```

If `mailchimpDAL` is no longer used (only for metadata), remove it:

```tsx
// Remove if not used elsewhere:
import { mailchimpDAL } from "@/dal/mailchimp.dal";
```

**Keep imports that are still used by the page content component.**

#### 5. Manual Testing

```bash
# Start dev server
pnpm dev

# Visit the abuse reports page
# https://127.0.0.1:3000/mailchimp/reports/[any-valid-id]/abuse-reports

# Verify:
# - Page loads correctly
# - Browser tab title shows campaign name + "Abuse Reports"
# - Metadata appears in page source (view source)
# - No console errors
# - 404 handling still works for invalid IDs
```

### Validation

```bash
# Type check
pnpm type-check

# Run tests
pnpm test

# Check file is smaller (should have removed ~30 lines)
wc -l src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
```

**Validation Checklist:**

- [ ] Page compiles without errors
- [ ] No TypeScript errors
- [ ] Page loads correctly in browser
- [ ] Metadata shows correctly in browser tab
- [ ] Metadata appears in page source
- [ ] No console errors
- [ ] All tests pass

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
git commit -m "refactor(pages): use metadata helper in abuse reports page

- Replace 30+ lines of inline metadata with helper function
- Import generateCampaignAbuseReportsMetadata from @/utils/metadata
- Remove duplicate metadata generation logic
- Cleaner, more maintainable code"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phase 1-3 complete and committed
- Helper function is working and tested
- Next phase is independent (documentation only)

📋 What to keep:

- This execution plan document
- Current task: "Update documentation in CLAUDE.md"

---

## Phase 4: Documentation Update

**Goal:** Document the completed metadata helpers pattern in CLAUDE.md

**Estimated Time:** 15-20 minutes

**Pre-Phase Checklist:**

- [ ] Phase 3 complete (verify: all previous commits present)
- [ ] Check if CLAUDE.md already documents this: `grep -i "metadata.*helper.*function" CLAUDE.md | head -5`

### Implementation Steps

#### 1. Locate Metadata Helper Documentation Section

```bash
# Find the metadata helper section in CLAUDE.md
grep -n "Metadata Helper" CLAUDE.md
```

The section should be under "Development Guidelines" or near other utility patterns.

#### 2. Update Metadata Helper Section

Find the "Create Metadata Helper Functions" section (improvement #7) in CLAUDE.md and update it to reflect completion:

**Add or update this section after the "Metadata Type Safety" section:**

````markdown
### Metadata Helper Functions

**Problem:** Metadata generation involves repetitive API calls and data formatting across multiple pages.

**Solution:** Centralized metadata helpers in `src/utils/mailchimp/metadata.ts` and `src/utils/metadata.ts`

**Available Helpers:**

```tsx
import {
  generateCampaignMetadata, // Generic campaign metadata with pageType param
  generateCampaignReportMetadata, // Campaign report detail pages
  generateCampaignOpensMetadata, // Campaign opens pages
  generateCampaignAbuseReportsMetadata, // Campaign abuse reports pages
} from "@/utils/metadata";
```
````

**Usage Pattern:**

```tsx
// In your page.tsx with dynamic [id] route
import { generateCampaignOpensMetadata } from "@/utils/metadata";

// Simple one-line metadata export
export const generateMetadata = generateCampaignOpensMetadata;
```

**Before (30+ lines inline):**

```tsx
export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
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
};
```

**After (1 line):**

```tsx
import { generateCampaignOpensMetadata } from "@/utils/metadata";
export const generateMetadata = generateCampaignOpensMetadata;
```

**Key Features:**

- Eliminates 30+ lines of boilerplate per page
- Consistent metadata format across all campaign pages
- Centralized error handling and fallback metadata
- OpenGraph metadata included automatically
- Type-safe with proper params validation

**When to Use:**

- Campaign report pages (`/mailchimp/reports/[id]`)
- Campaign opens pages (`/mailchimp/reports/[id]/opens`)
- Campaign abuse reports pages (`/mailchimp/reports/[id]/abuse-reports`)
- Any future campaign-related pages

**Creating New Helpers:**

Follow the pattern in `src/utils/mailchimp/metadata.ts`:

1. Accept `params: Promise<{ id: string }>` parameter
2. Validate params with appropriate Zod schema
3. Make async DAL call to fetch data
4. Return fallback metadata if fetch fails
5. Build and return metadata object with title, description, openGraph
6. Export from `src/utils/metadata.ts` for unified imports

**Benefits:**

- 30+ lines saved per page using helpers
- Consistent metadata structure across pages
- Single source of truth for campaign metadata
- Easier to update metadata format globally
- Improved maintainability and testability

````

#### 3. Verify Documentation Formatting

```bash
# Check markdown formatting
pnpm format:check

# Fix if needed
pnpm format
````

### Validation

**Validation Checklist:**

- [ ] Documentation clearly explains the pattern
- [ ] Usage examples are correct and complete
- [ ] Before/After comparison included
- [ ] All available helpers listed
- [ ] When to use guidance provided
- [ ] Creating new helpers pattern documented
- [ ] Markdown formatting valid

**Checkpoint: COMMIT**

```bash
git add CLAUDE.md
git commit -m "docs: document metadata helper functions pattern

- Add comprehensive metadata helpers section
- Include before/after comparison (30+ lines → 1 line)
- List all available campaign metadata helpers
- Document pattern for creating new helpers
- Add usage guidelines and benefits"
```

---

## Phase 5: Final Validation

**Goal:** Run full validation suite and verify all changes work correctly

**Estimated Time:** 10 minutes

**Pre-Phase Checklist:**

- [ ] All previous phases complete (verify: `git log --oneline -4`)

### Validation Steps

#### 1. Run Full Test Suite

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# All tests
pnpm test

# Full validation (includes build)
pnpm validate
```

#### 2. Manual Testing in Browser

```bash
# Start dev server
pnpm dev
```

**Test these pages:**

1. **Campaign Report Detail:** `https://127.0.0.1:3000/mailchimp/reports/[id]`
   - Check browser tab title
   - View page source, verify metadata tags

2. **Campaign Opens:** `https://127.0.0.1:3000/mailchimp/reports/[id]/opens`
   - Check browser tab title
   - View page source, verify metadata tags

3. **Campaign Abuse Reports:** `https://127.0.0.1:3000/mailchimp/reports/[id]/abuse-reports`
   - Check browser tab title
   - View page source, verify metadata tags
   - Verify same format as opens/report pages

4. **404 Handling:** Test with invalid campaign ID
   - Should show 404 page
   - Metadata should show fallback values

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

- 1 modified: `src/utils/mailchimp/metadata.ts` (added helper)
- 1 modified: `src/utils/metadata.ts` (exported helper)
- 1 modified: `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx` (use helper)
- 1 modified: `CLAUDE.md` (documentation)

**Total: 4 files, ~30 lines removed from page, ~30 lines added to utility**

### Final Validation Checklist

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all tests)
- [ ] `pnpm validate` passes (includes build)
- [ ] No console errors in dev server
- [ ] All campaign pages show correct metadata
- [ ] 404 handling works correctly
- [ ] Documentation is accurate and complete
- [ ] All commits have good messages
- [ ] Git hygiene is good (no unintended files)

---

## Manual Review Checklist

Before pushing to origin:

### Code Quality

- [ ] **Type Safety**
  - [ ] All imports use path aliases (`@/utils/metadata`)
  - [ ] No `any` types used
  - [ ] Helper function signature matches pattern
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
  - [ ] Tested abuse reports page in browser
  - [ ] Metadata appears correctly in browser tabs
  - [ ] Metadata visible in page source
  - [ ] No console errors
  - [ ] No TypeScript errors in IDE

### Documentation

- [ ] **JSDoc**
  - [ ] Helper function has JSDoc comment
  - [ ] Usage examples are clear and accurate
  - [ ] Parameters documented

- [ ] **CLAUDE.md**
  - [ ] Pattern documented
  - [ ] Examples provided
  - [ ] Benefits explained
  - [ ] When to use guidance included

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

# Expected: 4 commits
# 1. Add abuse reports metadata helper
# 2. Export mailchimp helpers from main metadata module
# 3. Update abuse reports page to use helper
# 4. Update documentation

# Push to origin
git push -u origin feature/complete-metadata-helpers
```

---

## Create Pull Request

**Title:** `feat: complete metadata helper functions for campaign pages`

**Description:**

````markdown
## Summary

Completes improvement #7 from page-pattern-improvements.md. Finishes the metadata helper functions pattern by adding abuse reports helper and consolidating exports.

## Changes

**New Helper Function:**

- Added `generateCampaignAbuseReportsMetadata()` in `src/utils/mailchimp/metadata.ts`
- Follows same pattern as existing opens/report helpers
- Includes fallback metadata and OpenGraph support

**Unified Exports:**

- Re-exported all campaign metadata helpers from `src/utils/metadata.ts`
- Allows unified imports: `import { generateCampaignAbuseReportsMetadata } from "@/utils/metadata"`

**Page Updates:**

- Updated abuse reports page to use helper function
- Reduced from 30+ lines of inline metadata to 1-line import + export
- Removed duplicate metadata generation logic

**Documentation:**

- Added comprehensive metadata helpers section to CLAUDE.md
- Included before/after examples
- Documented all available helpers and usage patterns

## Before/After

**Before (30+ lines per page):**

```tsx
export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const rawParams = await params;
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);
  const response = await mailchimpDAL.fetchCampaignReport(id);
  // ... 25+ more lines ...
};
```
````

**After (1 line):**

```tsx
export const generateMetadata = generateCampaignAbuseReportsMetadata;
```

## Testing

- [x] Type checking passes (`pnpm type-check`)
- [x] Linting passes (`pnpm lint`)
- [x] All tests pass (`pnpm test`)
- [x] Build succeeds (`pnpm validate`)
- [x] Manual testing completed for abuse reports page
- [x] Metadata displays correctly in browser
- [x] 404 handling verified

## Impact

- **Lines saved:** ~30 lines per page using helpers
- **Pages benefiting:** 3 campaign pages (report, opens, abuse-reports)
- **Total reduction:** ~90 lines of duplicate code eliminated
- **Consistency:** All campaign pages now have unified metadata format
- **Maintainability:** Single source of truth for campaign metadata

## Checklist

- [x] Helper function follows existing pattern
- [x] Unified exports from main metadata module
- [x] Abuse reports page updated and tested
- [x] Documentation added to CLAUDE.md
- [x] No breaking changes
- [x] No functionality changes (refactoring only)

## Related

- Implementation Plan: docs/page-pattern-improvements.md (#7)
- Execution Plan: docs/execution-plans/metadata-helpers/execution-plan.md
- Related PR: #189 (Type Safety for Metadata Functions)

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

- [ ] Delete feature branch locally: `git branch -d feature/complete-metadata-helpers`
- [ ] Delete feature branch remotely: `git push origin --delete feature/complete-metadata-helpers`
- [ ] Update page-pattern-improvements.md to mark #7 as 100% complete (currently 50%)
- [ ] Consider applying pattern to any new pages added in the future

---

## Additional Notes

**Why This Improvement Matters:**

1. **Consistency:** All campaign pages now have identical metadata structure
2. **Maintainability:** Update metadata format in one place, affects all pages
3. **Developer Experience:** New pages can use helpers instead of copying code
4. **Code Quality:** Eliminates 30+ lines of duplicate code per page
5. **Type Safety:** Helpers include proper params validation and error handling

**Pattern Established:**

This completion establishes a clear pattern for metadata helpers:

- Helper functions in `src/utils/[feature]/metadata.ts`
- Re-export from `src/utils/metadata.ts` for unified imports
- One-line usage in pages: `export const generateMetadata = helper`

**Future Enhancements:**

If list pages need dynamic metadata in the future:

- Add `generateListMetadata()` helper in `src/utils/mailchimp/metadata.ts`
- Export from `src/utils/metadata.ts`
- Follow the same pattern established here

---

**End of Execution Plan**
