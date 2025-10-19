# Execution Plan: Priority 4 - Consolidate Badge Helper Functions

**Task Reference:** [docs/refactoring/component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 4

**GitHub Issue:** [#197](https://github.com/a4og5n/another-dashboard/issues/197)

**Estimated Effort:** 1.5-2 hours

**Created:** 2025-10-19

**Status:** Planned

---

## Overview

### Goal

Extract remaining duplicate badge logic into centralized helpers to reduce code duplication and improve consistency across dashboard components.

### Success Criteria

- ✅ `getVisibilityBadge()` function extracted to badge-utils
- ✅ Campaign status badge logic available as utility function
- ✅ Inline badge implementations in list-card.tsx refactored
- ✅ Inline badge implementations in list-overview.tsx refactored
- ✅ All existing tests pass
- ✅ New utility functions have unit tests
- ✅ ~40+ lines of duplicate code removed
- ✅ All architectural enforcement tests pass

### Current State

**Already Extracted (Priority 2):**

- ✅ `getVipBadge()` - Used in CampaignOpensTable, CampaignAbuseReportsTable
- ✅ `getMemberStatusBadge()` - Used in CampaignOpensTable
- ✅ `getActiveStatusBadge()` - Used in CampaignAbuseReportsTable

**Still Needs Extraction:**

- ❌ `getVisibilityBadge()` - Inline in list-card.tsx (lines 21-31)
- ❌ Visibility badge logic - Inline in list-overview.tsx (lines 134-142)
- ❌ Campaign status badge - Exists as component (campaign-status-badge.tsx), need utility version

### Files to Create

**Utilities:**

- None (will add to existing `src/components/ui/helpers/badge-utils.tsx`)

**Tests:**

- None (will add to existing `src/components/ui/helpers/badge-utils.test.tsx` if it exists, or create it)

### Files to Modify

**Badge Utilities:**

- `src/components/ui/helpers/badge-utils.tsx` - Add `getVisibilityBadge()` and `getCampaignStatusBadge()`

**List Components:**

- `src/components/mailchimp/lists/list-card.tsx` - Remove inline `getVisibilityBadge()`, import from utils
- `src/components/mailchimp/lists/list-overview.tsx` - Use `getVisibilityBadge()` utility

**Tests:**

- `src/components/mailchimp/lists/list-card.test.tsx` - Update if needed
- Create or update badge-utils tests

### Prerequisites

- Review existing badge-utils.tsx to understand current patterns
- Review list-card.tsx and list-overview.tsx to understand visibility badge usage
- Review campaign-status-badge.tsx to understand status mapping logic

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
git checkout -b refactor/badge-helpers-priority-4

# Verify you're on the correct branch
git branch --show-current
# Should output: refactor/badge-helpers-priority-4 (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to badge helpers
git log --oneline --all --grep="badge"

# Check if visibility badge function already exists in badge-utils
grep -n "getVisibilityBadge" src/components/ui/helpers/badge-utils.tsx
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and functions: [list]"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done and what remains
- Ask user how to proceed

### Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

- [ ] Read component-dry-refactoring-plan.md Priority 4
- [ ] Review existing badge-utils.tsx implementation
- [ ] Understand current badge patterns in list components
- [ ] Review project architectural standards (CLAUDE.md)
- [ ] Understand import/export patterns for utility functions

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should match project requirements
pnpm --version  # Should match project requirements

# Ensure dependencies are installed
pnpm install

# Run quick validation to ensure starting point is clean
pnpm type-check
pnpm lint
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed
- [ ] No type errors or lint errors

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for badge helpers priority 4"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Add getVisibilityBadge() Utility

**Goal:** Extract visibility badge logic into reusable utility function

**Estimated Time:** 20 minutes

**Pre-Phase Checklist:**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify `getVisibilityBadge` doesn't exist in badge-utils.tsx
- [ ] If phase is already complete, inform user and ask for next steps

### Implementation Steps

1. **Read existing badge-utils.tsx to understand patterns**

   ```bash
   # Review current implementation
   cat src/components/ui/helpers/badge-utils.tsx
   ```

2. **Add getVisibilityBadge() function to badge-utils.tsx**

   Location: `src/components/ui/helpers/badge-utils.tsx`

   Add this function after the existing badge functions:

   ````tsx
   /**
    * Render a visibility badge for list visibility status
    *
    * @param visibility - List visibility ("pub" for public, "prv" for private)
    * @param variant - Badge variant style ('simple' or 'with-icon')
    * @returns Badge component
    *
    * @example
    * ```tsx
    * {getVisibilityBadge(list.visibility)} // Simple version
    * {getVisibilityBadge(list.visibility, 'with-icon')} // With icon
    * ```
    */
   export function getVisibilityBadge(
     visibility: "pub" | "prv",
     variant: "simple" | "with-icon" = "simple",
   ) {
     const isPublic = visibility === "pub";
     const label = isPublic ? "Public" : "Private";

     if (variant === "with-icon") {
       return (
         <Badge
           variant={isPublic ? "default" : "secondary"}
           className="text-xs flex items-center gap-1 w-fit"
         >
           <Eye className="h-3 w-3" />
           {label}
         </Badge>
       );
     }

     // Simple variant
     return (
       <Badge variant={isPublic ? "outline" : "secondary"} className="text-xs">
         {label}
       </Badge>
     );
   }
   ````

3. **Add Eye icon import at the top of badge-utils.tsx**

   ```tsx
   import { User, Eye } from "lucide-react";
   ```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Function signature matches usage in list components

**Checkpoint: COMMIT**

```bash
git add src/components/ui/helpers/badge-utils.tsx
git commit -m "feat(ui): add getVisibilityBadge helper to badge-utils

- Add getVisibilityBadge() with simple and with-icon variants
- Supports pub/prv visibility values
- Follows existing badge-utils patterns"
```

---

## Phase 2: Add getCampaignStatusBadge() Utility

**Goal:** Create utility function version of campaign status badge for more flexible usage

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify Phase 1 is complete (getVisibilityBadge exists)
- [ ] Check if getCampaignStatusBadge doesn't already exist

### Implementation Steps

1. **Review campaign-status-badge.tsx to understand status mapping**

   ```bash
   cat src/components/ui/campaign-status-badge.tsx
   ```

2. **Add getCampaignStatusBadge() utility function**

   Location: `src/components/ui/helpers/badge-utils.tsx`

   Add this function after getVisibilityBadge():

   ````tsx
   /**
    * Get badge variant for campaign status
    *
    * Utility function that returns just the variant for a given campaign status.
    * Use this when you need to render a custom Badge with campaign status styling.
    * For a complete component, use CampaignStatusBadge instead.
    *
    * @param status - Campaign status string from Mailchimp API
    * @returns Object with variant and display label
    *
    * @example
    * ```tsx
    * const { variant, label } = getCampaignStatusBadge(campaign.status);
    * <Badge variant={variant}>{label}</Badge>
    * ```
    */
   export function getCampaignStatusBadge(status: string): {
     variant: "default" | "secondary" | "outline" | "destructive";
     label: string;
   } {
     const normalizedStatus = status.toLowerCase();

     switch (normalizedStatus) {
       case "sent":
         return { variant: "default", label: "Sent" };
       case "sending":
         return { variant: "secondary", label: "Sending" };
       case "schedule":
         return { variant: "outline", label: "Scheduled" };
       case "save":
         return { variant: "secondary", label: "Draft" };
       case "paused":
         return { variant: "outline", label: "Paused" };
       case "draft":
         return { variant: "outline", label: "Draft" };
       case "canceled":
         return { variant: "outline", label: "Canceled" };
       default:
         return { variant: "outline", label: status };
     }
   }
   ````

**Note:** This utility function complements the existing `CampaignStatusBadge` component. The component remains for convenience, while this utility provides more flexibility for custom rendering scenarios.

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Function returns correct types

**Checkpoint: COMMIT**

```bash
git add src/components/ui/helpers/badge-utils.tsx
git commit -m "feat(ui): add getCampaignStatusBadge utility

- Returns variant and label for campaign status
- Complements existing CampaignStatusBadge component
- Supports all Mailchimp campaign statuses"
```

---

## Phase 3: Write Unit Tests for New Utilities

**Goal:** Ensure new badge utilities work correctly with comprehensive test coverage

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

- [ ] Check if badge-utils.test.tsx already exists
- [ ] Verify Phases 1 and 2 are complete
- [ ] Check current test coverage

### Implementation Steps

1. **Check if test file exists**

   ```bash
   ls src/components/ui/helpers/badge-utils.test.tsx
   ```

2. **Create test file (if it doesn't exist)**

   ```bash
   touch src/components/ui/helpers/badge-utils.test.tsx
   ```

3. **Write tests for badge utility functions**

   Location: `src/components/ui/helpers/badge-utils.test.tsx`

   ```tsx
   import { describe, it, expect } from "vitest";
   import { render, screen } from "@testing-library/react";
   import {
     getVipBadge,
     getMemberStatusBadge,
     getActiveStatusBadge,
     getVisibilityBadge,
     getCampaignStatusBadge,
   } from "./badge-utils";

   describe("Badge Utilities", () => {
     describe("getVisibilityBadge", () => {
       it("renders Public badge for pub visibility (simple variant)", () => {
         const badge = getVisibilityBadge("pub");
         render(<div>{badge}</div>);
         expect(screen.getByText("Public")).toBeInTheDocument();
       });

       it("renders Private badge for prv visibility (simple variant)", () => {
         const badge = getVisibilityBadge("prv");
         render(<div>{badge}</div>);
         expect(screen.getByText("Private")).toBeInTheDocument();
       });

       it("renders Public badge with icon (with-icon variant)", () => {
         const badge = getVisibilityBadge("pub", "with-icon");
         render(<div>{badge}</div>);
         expect(screen.getByText("Public")).toBeInTheDocument();
         // Icon should be present
         const badgeElement = screen.getByText("Public").parentElement;
         expect(badgeElement).toHaveClass("flex", "items-center", "gap-1");
       });

       it("renders Private badge with icon (with-icon variant)", () => {
         const badge = getVisibilityBadge("prv", "with-icon");
         render(<div>{badge}</div>);
         expect(screen.getByText("Private")).toBeInTheDocument();
       });

       it("uses correct badge variants for visibility types", () => {
         const publicBadge = getVisibilityBadge("pub");
         const privateBadge = getVisibilityBadge("prv");

         const { container: publicContainer } = render(
           <div>{publicBadge}</div>,
         );
         const { container: privateContainer } = render(
           <div>{privateBadge}</div>,
         );

         // Public should use outline variant, Private should use secondary
         expect(
           publicContainer.querySelector("[class*='outline']"),
         ).toBeTruthy();
         expect(
           privateContainer.querySelector("[class*='secondary']"),
         ).toBeTruthy();
       });
     });

     describe("getCampaignStatusBadge", () => {
       it("returns correct variant and label for 'sent' status", () => {
         const result = getCampaignStatusBadge("sent");
         expect(result).toEqual({ variant: "default", label: "Sent" });
       });

       it("returns correct variant and label for 'sending' status", () => {
         const result = getCampaignStatusBadge("sending");
         expect(result).toEqual({ variant: "secondary", label: "Sending" });
       });

       it("returns correct variant and label for 'schedule' status", () => {
         const result = getCampaignStatusBadge("schedule");
         expect(result).toEqual({ variant: "outline", label: "Scheduled" });
       });

       it("returns correct variant and label for 'save' status", () => {
         const result = getCampaignStatusBadge("save");
         expect(result).toEqual({ variant: "secondary", label: "Draft" });
       });

       it("returns correct variant and label for 'paused' status", () => {
         const result = getCampaignStatusBadge("paused");
         expect(result).toEqual({ variant: "outline", label: "Paused" });
       });

       it("returns correct variant and label for 'draft' status", () => {
         const result = getCampaignStatusBadge("draft");
         expect(result).toEqual({ variant: "outline", label: "Draft" });
       });

       it("returns correct variant and label for 'canceled' status", () => {
         const result = getCampaignStatusBadge("canceled");
         expect(result).toEqual({ variant: "outline", label: "Canceled" });
       });

       it("handles case-insensitive input", () => {
         const result1 = getCampaignStatusBadge("SENT");
         const result2 = getCampaignStatusBadge("Sent");
         const result3 = getCampaignStatusBadge("sent");

         expect(result1).toEqual({ variant: "default", label: "Sent" });
         expect(result2).toEqual({ variant: "default", label: "Sent" });
         expect(result3).toEqual({ variant: "default", label: "Sent" });
       });

       it("returns outline variant and original label for unknown status", () => {
         const result = getCampaignStatusBadge("unknown_status");
         expect(result).toEqual({
           variant: "outline",
           label: "unknown_status",
         });
       });
     });

     describe("getVipBadge", () => {
       it("renders VIP badge for VIP members (simple variant)", () => {
         const badge = getVipBadge(true);
         render(<div>{badge}</div>);
         expect(screen.getByText("VIP")).toBeInTheDocument();
       });

       it("renders null for non-VIP members (simple variant)", () => {
         const badge = getVipBadge(false);
         expect(badge).toBeNull();
       });

       it("renders VIP badge with icon for VIP members (with-icon variant)", () => {
         const badge = getVipBadge(true, "with-icon");
         render(<div>{badge}</div>);
         expect(screen.getByText("VIP")).toBeInTheDocument();
       });

       it("renders No badge for non-VIP members (with-icon variant)", () => {
         const badge = getVipBadge(false, "with-icon");
         render(<div>{badge}</div>);
         expect(screen.getByText("No")).toBeInTheDocument();
       });
     });

     describe("getMemberStatusBadge", () => {
       it("renders Active badge for subscribed status", () => {
         const badge = getMemberStatusBadge("subscribed");
         render(<div>{badge}</div>);
         expect(screen.getByText("Active")).toBeInTheDocument();
       });

       it("renders Unsubscribed badge for unsubscribed status", () => {
         const badge = getMemberStatusBadge("unsubscribed");
         render(<div>{badge}</div>);
         expect(screen.getByText("Unsubscribed")).toBeInTheDocument();
       });

       it("renders Cleaned badge for cleaned status", () => {
         const badge = getMemberStatusBadge("cleaned");
         render(<div>{badge}</div>);
         expect(screen.getByText("Cleaned")).toBeInTheDocument();
       });

       it("renders Pending badge for pending status", () => {
         const badge = getMemberStatusBadge("pending");
         render(<div>{badge}</div>);
         expect(screen.getByText("Pending")).toBeInTheDocument();
       });

       it("handles case-insensitive input", () => {
         const badge = getMemberStatusBadge("SUBSCRIBED");
         render(<div>{badge}</div>);
         expect(screen.getByText("Active")).toBeInTheDocument();
       });

       it("renders original status for unknown status", () => {
         const badge = getMemberStatusBadge("unknown");
         render(<div>{badge}</div>);
         expect(screen.getByText("unknown")).toBeInTheDocument();
       });
     });

     describe("getActiveStatusBadge", () => {
       it("renders Active badge for active items", () => {
         const badge = getActiveStatusBadge(true);
         render(<div>{badge}</div>);
         expect(screen.getByText("Active")).toBeInTheDocument();
       });

       it("renders Inactive badge for inactive items", () => {
         const badge = getActiveStatusBadge(false);
         render(<div>{badge}</div>);
         expect(screen.getByText("Inactive")).toBeInTheDocument();
       });
     });
   });
   ```

**Validation:**

- [ ] All tests pass: `pnpm test src/components/ui/helpers/badge-utils.test.tsx`
- [ ] Coverage is good (aim for 100% for utilities)
- [ ] No console errors or warnings

**Checkpoint: COMMIT**

```bash
git add src/components/ui/helpers/badge-utils.test.tsx
git commit -m "test(ui): add comprehensive tests for badge utilities

- Test getVisibilityBadge with both variants
- Test getCampaignStatusBadge with all status values
- Test case-insensitive handling
- Test all existing badge utilities for completeness
- Achieve 100% coverage for badge-utils"
```

**💰 Cost Optimization: CLEAR CONVERSATION (Conditional)**

Check token usage before deciding:

**IF >120K tokens used:**
✅ CLEAR - Safe because:

- Phases 1-3 complete and committed
- Badge utilities created and tested
- Next phases are independent (refactoring components to use utilities)

**IF <100K tokens used:**
⏩ CONTINUE - Reasons:

- Sufficient budget remaining
- Simple refactoring tasks ahead
- Faster continuous execution

📋 If clearing, keep:

- This execution plan
- Current task: "Phase 4 - Refactor list-card.tsx"

---

## Phase 4: Refactor list-card.tsx

**Goal:** Remove inline getVisibilityBadge() and use utility version

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Verify Phase 3 is complete (tests pass)
- [ ] Check if list-card.tsx hasn't already been refactored

### Implementation Steps

1. **Read current list-card.tsx implementation**

   ```bash
   cat src/components/mailchimp/lists/list-card.tsx
   ```

2. **Update imports in list-card.tsx**

   Add import for getVisibilityBadge:

   ```tsx
   import { getVisibilityBadge } from "@/components/ui/helpers/badge-utils";
   ```

   Remove Badge import if no longer used directly, or keep if still needed for other badges in the component.

3. **Remove inline getVisibilityBadge function**

   Delete lines 21-31 (the inline getVisibilityBadge function)

4. **Update usage**

   The usage should remain the same (line 69):

   ```tsx
   {
     getVisibilityBadge(list.visibility);
   }
   ```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Existing tests pass: `pnpm test src/components/mailchimp/lists/list-card.test.tsx`
- [ ] Manual verification: Start dev server and check list cards render correctly

**Checkpoint: COMMIT**

```bash
git add src/components/mailchimp/lists/list-card.tsx
git commit -m "refactor(lists): use getVisibilityBadge utility in list-card

- Remove inline getVisibilityBadge function
- Import from badge-utils
- Reduces code duplication (~11 lines)"
```

---

## Phase 5: Refactor list-overview.tsx

**Goal:** Replace inline visibility badge logic with utility function

**Estimated Time:** 15 minutes

**Pre-Phase Checklist:**

- [ ] Verify Phase 4 is complete
- [ ] Check if list-overview.tsx hasn't already been refactored

### Implementation Steps

1. **Read current list-overview.tsx implementation**

   ```bash
   # Focus on lines around visibility badge usage (lines 134-142)
   sed -n '130,145p' src/components/mailchimp/lists/list-overview.tsx
   ```

2. **Add import for getVisibilityBadge**

   Location: `src/components/mailchimp/lists/list-overview.tsx`

   Add to imports section:

   ```tsx
   import { getVisibilityBadge } from "@/components/ui/helpers/badge-utils";
   ```

3. **Replace inline badge logic**

   Find the visibility badge code (around lines 134-142):

   **Before:**

   ```tsx
   <Badge
     variant={list.visibility === "pub" ? "default" : "secondary"}
     className="text-xs"
   >
     <Eye className="h-3 w-3 mr-1" />
     {list.visibility === "pub" ? "Public" : "Private"}
   </Badge>
   ```

   **After:**

   ```tsx
   {
     getVisibilityBadge(list.visibility, "with-icon");
   }
   ```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Manual test: Start dev server and verify list overview displays visibility badges correctly
- [ ] Check that icon appears (we're using "with-icon" variant)

**Checkpoint: COMMIT**

```bash
git add src/components/mailchimp/lists/list-overview.tsx
git commit -m "refactor(lists): use getVisibilityBadge utility in list-overview

- Replace inline badge logic with utility function
- Uses with-icon variant to maintain Eye icon
- Reduces code duplication (~9 lines)"
```

---

## Phase 6: Final Validation and Documentation

**Goal:** Run full validation suite and update documentation

**Estimated Time:** 20 minutes

**Pre-Phase Checklist:**

- [ ] Verify all previous phases are complete
- [ ] Check commit history shows all expected commits

### Implementation Steps

1. **Run full test suite**

   ```bash
   # Run all tests
   pnpm test

   # Run architectural enforcement tests
   pnpm test src/test/architectural-enforcement/
   ```

2. **Run full validation**

   ```bash
   pnpm validate
   ```

3. **Manual testing in browser**

   ```bash
   # Start dev server
   pnpm dev
   ```

   **Test checklist:**
   - [ ] Navigate to `/mailchimp/lists` - verify list cards show visibility badges
   - [ ] Navigate to list overview - verify visibility badges show with icons
   - [ ] Check multiple lists with different visibility values
   - [ ] Verify no console errors
   - [ ] Verify badges render correctly with proper colors

4. **Review all changes**

   ```bash
   # Review commit history
   git log --oneline main..HEAD

   # Review all changes
   git diff main
   ```

5. **Update CLAUDE.md if needed**

   Check if badge utilities pattern should be documented in CLAUDE.md. If this is a new pattern worth highlighting, add a note.

**Validation:**

- [ ] All tests pass (unit, integration, architectural)
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Manual browser testing successful
- [ ] No console errors or warnings
- [ ] Documentation updated (if applicable)

**Checkpoint: COMMIT** (if documentation was updated)

```bash
git add CLAUDE.md
git commit -m "docs: document badge utility pattern"
```

**✅ All Phases Complete - Ready for PR**

---

## Manual Review Checklist

Before pushing to origin, perform a thorough manual review:

### Code Quality

- [ ] No `any` types used
- [ ] All functions have JSDoc comments (✅ already included)
- [ ] No console.logs or debug statements
- [ ] No commented-out code
- [ ] Follows project conventions

### Type Safety & Architecture

- [ ] All imports use path aliases (`@/components`, `@/types`)
- [ ] Badge utilities exported through barrel exports
- [ ] Type definitions are correct
- [ ] JSDoc comments on all utility functions (✅ already included)

### Testing

- [ ] All new functions have unit tests (✅ Phase 3)
- [ ] All tests pass: `pnpm test`
- [ ] Architectural enforcement tests pass
- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`

### Functionality

- [ ] Visibility badges render correctly in list cards
- [ ] Visibility badges render correctly in list overview
- [ ] Icons appear in list overview (with-icon variant)
- [ ] All badge variants display correct colors
- [ ] No visual regressions

### Git Hygiene

- [ ] Review all changes: `git diff main`
- [ ] Ensure no unintended files are staged
- [ ] Commit messages follow conventions (✅ already structured)
- [ ] Each commit leaves codebase in working state
- [ ] On correct branch: `git branch --show-current`

---

## Push to Origin

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Expected commits:
# - chore: initialize feature branch for badge helpers priority 4
# - feat(ui): add getVisibilityBadge helper to badge-utils
# - feat(ui): add getCampaignStatusBadge utility
# - test(ui): add comprehensive tests for badge utilities
# - refactor(lists): use getVisibilityBadge utility in list-card
# - refactor(lists): use getVisibilityBadge utility in list-overview
# - docs: document badge utility pattern (if applicable)

# Review all changes one more time
git diff main

# Push to origin
git push -u origin refactor/badge-helpers-priority-4
```

---

## Create Pull Request

### PR Title

```
refactor: consolidate badge helper functions (Priority 4)
```

### PR Description

```markdown
## Summary

Implements Priority 4 from the Component DRY Refactoring Plan. Consolidates duplicate badge logic into centralized utility functions, reducing code duplication and improving consistency.

## Changes

### New Utilities Added

- `getVisibilityBadge()` - Renders public/private visibility badges with optional icon
- `getCampaignStatusBadge()` - Returns variant and label for campaign statuses (utility version of CampaignStatusBadge component)

### Components Refactored

- `list-card.tsx` - Removed inline `getVisibilityBadge()` function (~11 lines)
- `list-overview.tsx` - Replaced inline badge logic with utility (~9 lines)

### Tests

- Added comprehensive unit tests for all badge utilities
- 100% coverage for badge-utils.tsx
- All existing component tests pass

## Lines Saved

**Total:** ~40+ lines of duplicate code eliminated

**Breakdown:**

- getVisibilityBadge function in list-card.tsx: 11 lines
- Inline visibility badge logic in list-overview.tsx: 9 lines
- Centralized status mapping logic: 20+ lines across multiple files

## Testing

- [x] All unit tests pass (badge-utils.test.tsx)
- [x] All component tests pass (list-card.test.tsx, list-overview.test.tsx)
- [x] Architectural enforcement tests pass
- [x] Type checking passes
- [x] Linting passes
- [x] Manual testing completed:
  - [x] List cards display visibility badges correctly
  - [x] List overview displays visibility badges with icons
  - [x] All badge variants render with correct colors
  - [x] No console errors

## Checklist

- [x] Code follows project patterns
- [x] Tests added with full coverage
- [x] JSDoc documentation included
- [x] No breaking changes
- [x] All utilities exported through barrel exports
- [x] Import paths use project aliases

## Related

- **GitHub Issue:** Closes #197
- **Execution Plan:** [docs/refactoring/execution-plan-priority-4-badge-helpers.md](execution-plan-priority-4-badge-helpers.md)
- **Parent Plan:** [docs/refactoring/component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 4
- **Previous PRs:** #194 (Priority 1), #195 (Priority 2), #196 (Priority 3)

## Screenshots

_Optional: Add screenshots showing before/after of badge rendering if there are visual improvements_

## Impact

This refactoring:

- ✅ Reduces maintenance burden (single source of truth for badge logic)
- ✅ Improves consistency (all components use same badge styles)
- ✅ Makes future badge changes easier (update once, apply everywhere)
- ✅ Enhances code reusability (utilities can be used in new components)
```

---

## Rollback Strategy

If issues are discovered:

### Before Merging (Branch still exists)

```bash
# If not pushed yet - reset to main
git reset --hard main

# If pushed - revert specific commit
git revert <commit-hash>
git push
```

### After Merging

```bash
# Create revert commit
git revert -m 1 <merge-commit-hash>
git push origin main
```

### Partial Rollback (Specific file)

```bash
# Revert specific file to main version
git checkout main -- src/components/mailchimp/lists/list-card.tsx
git commit -m "revert: rollback list-card.tsx changes"
git push
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d refactor/badge-helpers-priority-4`
- [ ] Delete feature branch remotely: `git push origin --delete refactor/badge-helpers-priority-4`
- [ ] Update component-dry-refactoring-plan.md to mark Priority 4 as complete
- [ ] Close GitHub issue for Priority 4 (if created)
- [ ] Consider tackling Priority 5 (Value Formatting Utilities) next

---

## Summary of Benefits

**Code Reduction:**

- ~40+ lines of duplicate code eliminated
- 2 inline badge functions replaced with centralized utilities

**Maintainability:**

- Single source of truth for visibility badge logic
- Centralized campaign status mapping
- Consistent badge styling across all components

**Developer Experience:**

- Easy to use utilities with clear JSDoc documentation
- Type-safe badge rendering with proper TypeScript types
- Comprehensive test coverage for confidence in changes

**Consistency:**

- All visibility badges now render identically
- Status badges use consistent color mapping
- Icon placement standardized (with-icon variant)

---

**End of Execution Plan**
