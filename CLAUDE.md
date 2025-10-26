# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Git Branching Strategy

**NEVER WORK DIRECTLY ON MAIN BRANCH**

This project uses a **feature branch workflow**. All development MUST happen on feature branches, never directly on `main`.

### Correct Workflow:

```bash
# 1. Create feature branch
git checkout -b feature/endpoint-name

# 2. Make commits on feature branch
git add -A
git commit -m "feat: ..."

# 3. Push feature branch
git push origin feature/endpoint-name

# 4. Create PR
gh pr create --base main --head feature/endpoint-name

# 5. Merge PR after approval and CI passes
```

### Why This Matters:

- ❌ **Direct main commits bypass code review** - No PR discussion, no approval process
- ❌ **No opportunity to catch issues** - Changes go live without review
- ❌ **Breaks team collaboration** - Others can't review or suggest improvements
- ✅ **Feature branches enable proper review** - PRs allow discussion before merge
- ✅ **CI runs on PRs** - Checks pass before merge, not after
- ✅ **Safe experimentation** - Branch can be deleted if approach doesn't work

### Exception: Documentation-Only Changes

**ONLY commit directly to main for documentation files:**

✅ **Safe for direct commit:**

- `*.md` files in `/docs` directory (e.g., `docs/api-coverage.md`, `docs/PRD.md`)
- `README.md` updates
- `CLAUDE.md` updates
- Comment-only changes in code

❌ **NEVER commit directly to main:**

- Code files (`*.ts`, `*.tsx`, `*.js`, `*.jsx`)
- Schema files (`src/schemas/**/*.ts`)
- Test files (`*.test.ts`, `*.test.tsx`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Any changes that affect runtime behavior

**Rationale:** Documentation changes don't affect code execution and don't require CI/CD validation. All code changes MUST go through PR review and CI/CD checks.

### Historical Context:

**2025-10-23**: Domain Performance endpoint was mistakenly pushed directly to main (commits c87c5f6 through cf324b4). While CI passed retroactively, this bypassed the PR review process.

**2025-10-25**: Issue #239 cleanup was mistakenly committed directly to main (commit 440ee8a). The commit was reverted (ce4d609) and resubmitted via PR #243 for proper CI/CD validation.

**Lesson:** Even low-risk technical debt cleanup MUST go through the PR process.

### AI Implementation:

See "Phase 0: Git Setup" in the AI-First Development Workflow section below for how AI should automatically enforce this.

## Commands

**Development:** `pnpm dev` (HTTPS + Turbopack) | `pnpm build` | `pnpm start` | `pnpm clean`

**Quality:** `pnpm lint` | `pnpm lint:fix` | `pnpm type-check` | `pnpm format` | `pnpm format:check`

**Testing:** `pnpm test` | `pnpm test:watch` | `pnpm test:ui` | `pnpm test:coverage` | `pnpm test:a11y`

**Workflows:** `pnpm quick-check` (type + lint) | `pnpm pre-commit` (full validation) | `pnpm validate` (includes build)

**Database:** `pnpm db:push` | `pnpm db:generate` | `pnpm db:migrate` | `pnpm db:studio`

**Docs:** `pnpm docs` | `pnpm docs:watch`

**Page Generator:** `pnpm generate:page` (interactive CLI for humans)

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4 + Vitest + Zod + Drizzle ORM + Neon Postgres

**Auth:** Kinde (user auth) + Mailchimp OAuth 2.0 (API access, tokens encrypted AES-256-GCM)

**Project Status:** MVP complete, OAuth 2.0 migration done, post-MVP feature development

**Node/pnpm:** v24.7.0 / v10.15.0 (via Homebrew: `brew install pnpm`)

### Project Structure

- `src/app/` - Next.js pages, layouts, API routes
- `src/components/` - UI components (ui/, dashboard/, layout/, accessibility/, performance/, pwa/, social/)
- `src/actions/` - Server actions with test coverage
- `src/types/` - TypeScript type definitions (mailchimp/, components/)
- `src/schemas/` - Zod validation schemas (mailchimp/)
- `src/utils/` - Pure utility functions
- `src/lib/` - Config, encryption, Mailchimp client, error classes
- `src/services/` - API service classes (singleton pattern)
- `src/hooks/` - React hooks
- `src/db/` - Database schema, migrations, repositories
- `src/test/` - Test setup, utilities, architectural enforcement
- `src/translations/` - i18n files (en.json, es.json)

### Path Aliases

**Configured:** `@/*`, `@/components/*`, `@/actions/*`, `@/types/*`, `@/schemas/*`, `@/utils/*`, `@/lib/*`, `@/skeletons/*`

**Rules:**

- Use path aliases consistently (no relative imports in index.ts) - enforced by tests
- Define shared types in `/src/types` only (no inline) - enforced by tests
- Define Zod schemas in `/src/schemas` only (no inline) - enforced by tests

### Common Import Patterns

**⚠️ CRITICAL: Use correct import paths to avoid errors**

**Skeletons:**

```typescript
import { MemberTagsSkeleton } from "@/skeletons/mailchimp";
// NOT: "@/components/ui/skeleton" ❌
```

**Date Utilities:**

```typescript
import { formatDateTimeSafe } from "@/utils/format-date";
// NOT: "@/utils/mailchimp/date" ❌
```

**Breadcrumbs:**

```typescript
import { bc } from "@/utils/breadcrumbs";
// Usage: bc.memberProfile(listId, subscriberHash)
// NEVER use route placeholders: bc.memberProfile(id, "[subscriber_hash]") ❌
```

**Error Handling:**

```typescript
import { handleApiError } from "@/utils/errors";
// Usage: const error = handleApiError(response); if (error) return <ErrorDisplay />;
```

**Page Params Validation:**

```typescript
import { validatePageParams } from "@/utils/mailchimp/page-params";
// UI schema MUST use optional strings: z.object({ page: z.string().optional() })
// NOT coerced numbers: z.coerce.number().optional() ❌
```

**UI Components:**

```typescript
// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Pagination components
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
```

**Mailchimp Types:**

```typescript
// Import from @/types/mailchimp, not inline definitions
import type {
  MemberNote,
  MemberNotesResponse,
} from "@/types/mailchimp/member-notes";
```

**Zod Schemas:**

```typescript
// Import from @/schemas/mailchimp, not inline definitions
import {
  memberNotesPathParamsSchema,
  memberNotesQueryParamsSchema,
} from "@/schemas/mailchimp/lists/member-notes/params.schema";
```

### Testing & Quality

**Pre-commit hooks:** Auto-format, lint, type-check, test, a11y test, secret scan (Husky + lint-staged)

**Architectural tests enforce:**

- Path alias usage (no long relative paths)
- Types in `/src/types` only
- Server Components for layouts/not-found.tsx (404 status codes)
- No deprecated APIs (`z.string().datetime()`, `React.FC`, etc.)

**Run:** `pnpm test src/test/architectural-enforcement/`

### Required Reading Before Development

1. `docs/PRD.md` - Product requirements
2. `docs/project-management/development-roadmap.md` - Progress
3. `docs/project-management/task-tracking.md` - Priorities
4. `docs/api-coverage.md` - Mailchimp API implementation status
5. `docs/ai-workflow-learnings.md` - Learnings from recent implementations (table patterns, navigation, formatting)

### Pre-Implementation Checklist

**Before starting any new endpoint implementation**, verify:

- [ ] **Review error handling pattern** - Check `docs/error-handling-quick-reference.md` for current standard pattern
- [ ] **Confirm endpoint priority** - Verify in `docs/api-coverage.md` that this endpoint is next in priority
- [ ] **Search for similar endpoints** - Find comparable pages to match patterns (e.g., other list detail pages, other report drill-downs)
- [ ] **Verify parent page exists** - If nested endpoint (e.g., `/lists/[id]/segments`), confirm parent page (`/lists/[id]`) exists
- [ ] **⚠️ Plan navigation integration** - Determine ALL navigation entry points (WILL BE IMPLEMENTED IN STEP 16):
  - [ ] **For nested pages:** Which parent page needs a link/button to this new page?
  - [ ] **For top-level pages:** Should this be linked from main dashboard (`/mailchimp`)?
  - [ ] **Navigation pattern:** Find similar existing navigation (e.g., "View All Tags" button in member-profile-content.tsx)
  - [ ] **Breadcrumbs:** Ensure bc.funcName helper exists in breadcrumb-builder.ts
  - [ ] Does this replace an existing page or add new functionality?

  **Example:** For Member Notes (`/lists/[id]/members/[subscriber_hash]/notes`):
  - Parent page: Member Profile (`/lists/[id]/members/[subscriber_hash]`)
  - Add "View All Notes" button in "Last Note" card header (following "View All Tags" pattern)

- [ ] **Review existing schemas** - Check `src/schemas/mailchimp/` for reusable common schemas before creating new ones

**Quick References:**

- Error handling: `docs/error-handling-quick-reference.md`
- Comprehensive error analysis: `docs/error-handling-analysis.md`
- Pattern examples: `src/app/mailchimp/lists/[id]/segments/page.tsx` (reference implementation)

---

## AI-First Development Workflow

This project uses an **AI-assisted, automated workflow** for implementing new Mailchimp dashboard pages with **mandatory user checkpoints**.

### ⚠️ CRITICAL: Always Start on a Feature Branch

**BEFORE starting ANY feature work:**

1. Check current branch: `git branch --show-current`
2. If on `main` or `master`, **STOP** and create a feature branch first
3. Never commit directly to `main`

This is enforced in Phase 0 below.

### Overview

**Phase 0: Git Setup** 🔧 (Automatic - Create branch)
**Phase 1: Schema Creation & Review** ✋ (STOP POINT - User approval required)
**Phase 2: Page Generation & Implementation** 🚀 (Automatic - After approval, NO docs update)
**Phase 2.4: Quick Smoke Test** 🧪 (STOP POINT - User tests in browser before commit)
**Phase 2.5: Initial Local Commit** ✅ (Automatic LOCAL commit - DO NOT PUSH)
**Phase 2.75: User Review & Testing Loop** ⏸️ (STOP POINT - Iterate with `git commit --amend`)
**Phase 3: Push & Create PR** 📤 (ONLY after explicit "ready to push" approval)
**Phase 4: Post-Merge Cleanup & Documentation** 📝 (Automatic - Update docs AFTER PR merged)

**Key Workflow Change:** All iterations in Phase 2.75 use `git commit --amend --no-edit` to maintain ONE clean commit. PR is only created in Phase 3 after user explicitly approves.

### Phase 0: Git Setup (Automatic)

**BEFORE starting any feature work, AI automatically:**

1. Checks current branch: `git branch --show-current`
2. If on `main` or `master`:
   - Creates feature branch: `git checkout -b feature/{endpoint-name}`
   - Example: `git checkout -b feature/location-activity-endpoint`
   - Notifies user: "✅ Created branch: feature/{endpoint-name}"
3. If already on a feature branch: Continues work

**Branch Naming Convention:**

- Features: `feature/{descriptive-name}` (lowercase with hyphens)
- Fixes: `fix/{descriptive-name}`

**DO NOT** wait for user to request branch creation.

### Phase 1: Schema Creation & Review

When implementing a new Mailchimp API endpoint:

1. **AI attempts to fetch Mailchimp API documentation:**

   **Attempt 1:** Use WebFetch on official API docs URL

   **Attempt 2:** If WebFetch fails, use WebSearch for response examples

   **If both fail:**

   **⏸️ STOP and ask user:**

   > "I cannot access the Mailchimp API documentation for [endpoint].
   >
   > Options:
   >
   > - **A)** You visit [URL] and paste the response example
   > - **B)** You test the endpoint and share actual API response
   > - **C)** I create schemas based on Mailchimp API patterns (marked as ⚠️ ASSUMED - requires verification)
   >
   > Which would you prefer?"

   **DO NOT proceed with assumptions (Option C) without user explicitly choosing it.**

2. **AI creates Zod schemas** in `src/schemas/mailchimp/`:
   - `{endpoint}-params.schema.ts` - Request parameters (path + query params)
   - `{endpoint}-success.schema.ts` - Successful response structure
   - `{endpoint}-error.schema.ts` (optional) - Error response structure
   - Every field name must match API documentation exactly
   - Include source URL in schema file comments
   - If using assumptions: Mark with `⚠️ ASSUMED FIELDS` and document reasoning

3. **AI presents schemas for review** with:
   - Schema files created
   - Source documentation link (or note about assumptions)
   - API response example (if available)

4. **⏸️ STOP - User reviews schemas**
   - Check field names match Mailchimp API exactly
   - Verify types are correct (string, number, boolean, etc.)
   - Confirm pagination structure if applicable
   - Request changes if needed

5. **User approves schemas** - Say "approved" or "looks good" to proceed

### Phase 1 Verification Checklist

Before presenting schemas for review, AI must run this self-checklist:

**API Documentation:**

- [ ] ✅ Fetched official Mailchimp API documentation (or used assumptions with user approval)
- [ ] ✅ Located exact response example in docs
- [ ] ✅ Extracted all field names from response
- [ ] ✅ Verified field types match API
- [ ] ✅ Added source documentation URL to schema comments

**Architecture & Best Practices:**

- [ ] ✅ No type exports in schema files (types go in `/src/types`)
- [ ] ✅ Used modern Zod 4 syntax (`z.email()`, `z.ipv4()`, not `.string().email()`)
- [ ] ✅ Applied DRY principle (imported shared schemas from `common/`)
- [ ] ✅ Created shared constants for enums used in multiple schemas
- [ ] ✅ All ID fields use `.min(1)` to prevent empty strings
- [ ] ✅ Input schemas use `.strict()` to reject unknown properties
- [ ] ✅ DateTime fields use `z.iso.datetime({ offset: true })`
- [ ] ✅ Used proper `z.record()` syntax: `z.record(keyType, valueType)`

**Documentation & Readability:**

- [ ] ✅ Used JSDoc comments above declarations (not inline comments)
- [ ] ✅ Named nested schemas for readability (avoid deeply nested objects)
- [ ] ✅ Checked `common/` folder for reusable schemas before creating new ones
- [ ] ✅ Verified enum values match API documentation exactly

**If using assumptions (user approved Option C):**

- [ ] ✅ Marked schemas with `⚠️ ASSUMED FIELDS`
- [ ] ✅ Documented what was assumed and why
- [ ] ✅ Told user: "These schemas need verification with real API response during testing"

### Commit Strategy: Option A vs Option B

After user approves schemas, choose ONE of these commit strategies:

#### ✅ Option A - Single Atomic Commit (RECOMMENDED - Default)

**Pattern**: Complete Phase 2 fully, then commit everything together.

**When user approves schemas**, AI responds:

> "✅ Schemas approved. Proceeding to Phase 2 (implementation)..."

**After Phase 2 complete and validation passes**, make ONE commit:

```bash
git add .
git commit -m "feat: implement {Endpoint Name} (Phase 1 & 2 complete)

Implements comprehensive {feature description} following AI-first workflow.

**Phase 1: Schema Creation & Review**
- Created Zod schemas for {Endpoint} API endpoint
- Params schema: {key validation patterns}
- Success schema: {key data structures}
- {Special validations: IP addresses, currency codes, etc.}

**Phase 2: Page Generation & Implementation**
- Added PageConfig to registry (src/generation/page-configs.ts:XXX-YYY)
- Generated infrastructure using page generator
- Created TypeScript types (src/types/mailchimp/{endpoint}.ts)
- Implemented {ComponentName} component
- Built complete page.tsx with proper error handling

**Infrastructure Updates:**
- Updated DAL method with proper schemas
- Added breadcrumb builder function
- Created metadata helper
- Updated API coverage documentation

**Validation:**
- ✅ Type-check: passed
- ✅ Lint: passed
- ✅ Format: passed
- ✅ Tests: {count} passed"
```

**Pros**:

- ✅ Atomic feature delivery (all or nothing)
- ✅ Easier PR review (complete context in one place)
- ✅ No broken intermediate states
- ✅ Pre-commit hooks validate everything together
- ✅ Clean revert (entire feature removed)

**Cons**:

- ⚠️ Larger commits (~1000 lines, but still reviewable)
- ⚠️ Can't cherry-pick just schemas (rare need)

**When to use**: Default for all feature implementations

#### Option B - Separate Schema Commit (Alternative)

**Pattern**: Commit schemas immediately after approval, then commit implementation separately.

**When user approves schemas**, AI immediately commits:

```bash
git add src/schemas/mailchimp/*{endpoint}*
git commit -m "feat: add {Endpoint Name} schemas (Phase 1)

Created Zod schemas for {endpoint description}:
- {endpoint}-params.schema.ts
- {endpoint}-success.schema.ts
- {endpoint}-error.schema.ts

Source: {API documentation URL}"
```

Then notifies user: "✅ Schemas committed. Proceeding to Phase 2..."

**After Phase 2 complete**, commit implementation:

```bash
git add .
git commit -m "feat: implement {Endpoint Name} page (Phase 2)"
```

**Pros**:

- ✅ Granular history (clear phase separation)
- ✅ Can cherry-pick schemas to other branches

**Cons**:

- ⚠️ Phase 1 commit isn't independently useful
- ⚠️ Extra workflow step
- ⚠️ More commits to manage
- ⚠️ Potential for broken state between commits

**When to use**: Only if team/user specifically requires phase separation

---

**DEFAULT: Use Option A unless user requests Option B**

### Phase 2: Page Generation (After Approval)

**⚠️ CRITICAL:** DO NOT update `docs/api-coverage.md` during this phase. Documentation is updated in Phase 4 (post-merge).

Once schemas are approved, the AI follows these steps:

#### Step 1: Add Config to Registry

6. **AI adds PageConfig** to `src/generation/page-configs.ts`:
   ```typescript
   "report-endpoint": {
     schemas: { apiParams: "...", apiResponse: "...", apiError: "..." },
     route: { path: "/mailchimp/reports/[id]/endpoint", params: ["id"] },
     api: { endpoint: "/reports/{campaign_id}/endpoint", method: "GET" },
     page: { type: "nested-detail", title: "...", description: "...", features: [...] },
     ui: { hasPagination: true, breadcrumbs: { parent: "report-detail", label: "..." } },
   } satisfies PageConfig,
   ```

#### Step 2: Run Page Generator

7. **AI runs generator programmatically** (creates infrastructure files):
   ```typescript
   // Creates page skeleton with TODOs/placeholders
   const config = getPageConfig("report-endpoint");
   const result = await generatePageFromConfig(config, "report-endpoint");
   ```

**Generator Output:** Creates infrastructure files with TODOs and type errors (this is expected!)

#### Step 3: Manual Implementation (AI completes these)

8. **AI creates proper TypeScript types** in `src/types/mailchimp/{endpoint}.ts`:
   - Export types inferred from Zod schemas
   - Follow existing pattern from `abuse-reports.ts`, `opens.ts`, etc.

9. **AI creates skeleton component** in `src/skeletons/mailchimp/`:
   - Copy pattern from similar pages (e.g., `CampaignAbuseReportsSkeleton.tsx`)
   - Export from `src/skeletons/mailchimp/index.ts`

10. **AI replaces generated page.tsx** with proper implementation:
    - Follow exact pattern from `abuse-reports/page.tsx` or `opens/page.tsx`
    - Use proper types (not `any`)
    - Include proper error handling with `handleApiError()`
    - Add metadata generation

11. **AI implements table/display component**:
    - **IMPORTANT:** Use existing shared components whenever possible:
      - **For ALL tables:** Use shadcn/ui `Table` component (from `@/components/ui/table`)
        - Simple lists: `Card` + `Table` (see `campaign-unsubscribes-table.tsx`, `reports-overview.tsx`)
        - Complex tables with sorting: `Card` + TanStack Table + shadcn `Table` (see `click-details-content.tsx`)
        - **NEVER use raw HTML `<table>` markup** - always use shadcn/ui components
      - For data display: Use `StatCard`, `StatsGridCard`, or `StatusCard`
    - **If no suitable component exists:** Create placeholder Card with TODO:
      ```tsx
      <Card>
        <CardHeader>
          <CardTitle>TODO: Implement {ComponentName}</CardTitle>
        </CardHeader>
        <CardContent>Data structure ready, UI pending</CardContent>
      </Card>
      ```

12. **AI creates not-found.tsx** (copy from similar page, update text)

13. **AI updates DAL method** in `src/dal/mailchimp.dal.ts`:
    - Replace `unknown` types with proper schemas
    - Follow existing method patterns

14. **AI runs validation**:
    - `pnpm type-check` - Must pass with zero errors
    - `pnpm lint:fix` - Auto-fix linting issues
    - `pnpm format` - Format all files
    - `pnpm test` - All tests pass

15. **AI updates `docs/api-coverage.md`** - Mark endpoint as ✅ complete

16. **⚠️ CRITICAL: AI adds navigation links** (MANDATORY - Do NOT skip):

    **For ALL new pages, check and add navigation links:**

    a. **Nested pages** (e.g., `/lists/[id]/members/[subscriber_hash]/notes`):
    - **MUST add link from parent page** to new child page
    - Example: Add "View All Notes" button to Member Profile page
    - Pattern: Follow existing navigation buttons (see Tags card in member-profile-content.tsx)
    - Location: Usually in CardHeader alongside the CardTitle

    b. **Top-level pages** (e.g., `/reports`, `/lists`):
    - Check if should be linked from main dashboard (`/mailchimp`)
    - Add navigation card if appropriate

    c. **Verify breadcrumbs**:
    - Ensure breadcrumb helpers exist (bc.funcName in breadcrumb-builder.ts)
    - Verify breadcrumbs render correctly in page

    **Common Patterns:**

    ```tsx
    // Pattern 1: Button in CardHeader (for nested pages)
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Section Title</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href={`/path/to/detail`}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </CardHeader>

    // Pattern 2: Navigation card (for dashboard pages)
    <Card>
      <CardHeader>
        <CardTitle>Feature Name</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/feature/path">Go to Feature</Link>
        </Button>
      </CardContent>
    </Card>
    ```

    **⚠️ DO NOT PROCEED to Phase 2.4 without completing this step!**

### Phase 2.4: Quick Smoke Test (BEFORE COMMIT)

**⚠️ NEW: Mandatory smoke test to catch runtime issues before committing**

**AI must verify the page works in browser:**

1. **Check if dev server is running:**
   - If `pnpm dev` is already running (background process), use existing server
   - If not running, start it: `pnpm dev` (run in background if possible)

2. **Inform user to perform quick smoke test:**

   ```
   ✅ Validation passed. Before committing, please verify:

   **Quick Smoke Test (2-3 minutes):**
   1. Visit: https://127.0.0.1:3000/mailchimp/{route-path}
   2. Check browser console for errors/warnings
   3. Verify page loads without errors
   4. Test basic functionality (search, pagination, etc.)

   **Common issues to check:**
   - ❌ Duplicate React keys (console warnings)
   - ❌ Missing data / API errors
   - ❌ Layout issues / broken UI
   - ❌ Console errors

   Reply "smoke test passed" to proceed with commit, or describe any issues found.
   ```

3. **⏸️ STOP - Wait for user confirmation**
   - User tests page in browser
   - User checks console for warnings
   - User verifies basic functionality

4. **If user reports issues:**
   - Fix the issues
   - Re-run validation
   - Request smoke test again

5. **If user says "smoke test passed":**
   - Proceed to Phase 2.5 (commit)

**Rationale:** Catches runtime-only bugs (duplicate keys, React warnings, API errors) before committing.

**Time Cost:** 2-3 minutes (saves hours of debugging post-commit)

### Phase 2.5: Initial Local Commit (LOCAL ONLY - DO NOT PUSH)

**⚠️ CRITICAL: Commit to LOCAL branch only - DO NOT push to origin**

**After ALL Phase 2 steps complete and smoke test passes:**

1. **Create initial local commit:**

```bash
git add -A
git commit -m "feat: implement {Endpoint Name} (Issue #XXX)

Implements comprehensive {feature description} following AI-first workflow.

**Phase 1: Schema Creation & Review**
- Created Zod schemas for {Endpoint} API endpoint
- Params schema: {list key validation patterns used}
- Success schema: {list key data structures}
- {List special validations: IP addresses, ISO 8601 timestamps, currency codes, etc.}

**Phase 2: Page Generation & Implementation**
- Added PageConfig to registry (src/generation/page-configs.ts:{line}-{line})
- Generated infrastructure using page generator
- Created TypeScript types (src/types/mailchimp/{endpoint}.ts)
- Implemented {SkeletonName} skeleton component
- Built complete page.tsx with proper error handling
- Created {ComponentName} table/display component with:
  - {List key features: Server-side pagination, badges, formatting, etc.}

**Infrastructure Updates:**
- Updated DAL method with proper schemas (src/dal/mailchimp.dal.ts:{line}-{line})
- Added breadcrumb builder function (bc.{functionName})
- Created metadata helper (generate{Endpoint}Metadata)

**Files Created:**
- {List all new files}

**Validation:**
- ✅ Type-check: passed
- ✅ Lint: passed
- ✅ Format: passed
- ✅ Tests: {count} passed
- ✅ Smoke test: passed

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

2. **DO NOT push** - Commit stays local for iteration

#### After Commit Complete

**⏸️ STOP and present to user:**

> "✅ Phase 2 implementation complete - 1 atomic commit on local branch
>
> **Commit:** `{short-hash} - feat: implement {Endpoint Name} (Phase 1 & 2 complete)`
>
> **Changes:**
>
> - {count} files created, {count} modified
> - {total} lines added
>
> **Validation Results:**
>
> - ✅ Type-check: passed
> - ✅ Lint: passed
> - ✅ Format: passed
> - ✅ Tests: {count} passed
>
> ⚠️ PR has NOT been created yet - please review and test first
>
> **Next:** Phase 2.75 (your review & testing)
>
> When ready to push: Say 'ready to push' or 'create PR'"

**Why single atomic commit:**

- ✅ Complete feature in one reviewable unit
- ✅ Atomic delivery (all or nothing)
- ✅ No broken intermediate states
- ✅ Clean revert if needed
- ✅ Matches deployment model (features as units)

**DO NOT push to origin. DO NOT create PR. DO NOT proceed to Phase 3 without explicit user approval.**

### Phase 2.75: User Review & Testing Loop ⏸️ (REQUIRED CHECKPOINT)

**⚠️ CRITICAL: This happens entirely on LOCAL branch before any push to origin**

**User reviews implementation:**

1. Review code locally
2. **Test page in browser with REAL Mailchimp data**
3. Verify schemas match actual API responses
4. Check navigation and UX
5. Test edge cases (empty data, errors, etc.)

**If user identifies improvements:**

1. User describes needed changes (e.g., "move pagination outside card", "add navigation link")
2. AI implements improvements
3. AI stages changes: `git add -A`
4. **AI amends the existing commit** (keeping history clean):
   ```bash
   git commit --amend --no-edit
   ```
5. AI informs user: "✅ Changes applied and commit amended. Please test again."
6. Return to user testing

**Key Rule: Use `git commit --amend` for ALL iterations**

- ✅ **CORRECT:** `git commit --amend --no-edit` (keeps one clean commit)
- ❌ **WRONG:** `git commit -m "fix: ..."` (creates multiple commits)

**Why amend instead of new commits:**

- One atomic commit instead of 4-5 small commits
- Cleaner PR review (final state, not iteration history)
- Easier to revert if needed
- Professional git history

**Repeat until user is satisfied**

**Benefits of local-only workflow:**

- ✅ Single, clean commit history (or 2-3 logical commits)
- ✅ No wasted CI runs on every small change
- ✅ PR is complete and tested when created
- ✅ Faster iteration (no push/pull cycles)

**Why manual testing is CRITICAL:**

**AI CANNOT:**

- ❌ Test pages in browser
- ❌ Access real Mailchimp API
- ❌ Verify actual data structures
- ❌ Test user experience
- ❌ See rendered HTML/CSS
- ❌ Click links and verify navigation

**USER MUST:**

- ✅ Test with real Mailchimp data
- ✅ Verify schema matches API response (especially if schemas were assumed)
- ✅ Check all links work
- ✅ Verify HTML renders correctly
- ✅ Test error states and edge cases

**When user is satisfied, they explicitly say:**

- "ready to push"
- "create PR"
- "push to origin"
- "ready for PR"

**Only then proceed to Phase 3.**

---

## Git Amend Workflow Reference

**Use during Phase 2.75 (User Review & Testing Loop)**

### When to Use `git commit --amend`

Use amend for ALL fixes and improvements during local iteration:

- ✅ Bug fixes discovered during testing
- ✅ Layout improvements requested by user
- ✅ Navigation enhancements
- ✅ Code refactoring
- ✅ Import path corrections
- ✅ Schema adjustments
- ✅ Any change that belongs to the same feature

**DO NOT amend if:**

- ❌ Commit has already been pushed to origin
- ❌ Creating a completely different feature
- ❌ User explicitly requests separate commit (rare)

### Amend Workflow

**Basic amend (most common):**

```bash
# 1. Make changes to files
# 2. Stage all changes
git add -A

# 3. Amend without changing commit message
git commit --amend --no-edit
```

**Amend with message update:**

```bash
git add -A
git commit --amend
# Editor opens - update message, save, close
```

**Verify amend worked:**

```bash
git log --oneline -1
# Should show same commit hash (or new hash if message changed)
# Should show updated timestamp
```

### Example Iteration Flow

**Initial commit:**

```bash
git add -A
git commit -m "feat: implement Member Tags endpoint"
# Commit: abc1234
```

**User: "Move pagination outside card"**

```bash
# Fix pagination layout
git add -A
git commit --amend --no-edit
# Still commit: abc1234 (or abc5678 with updated changes)
```

**User: "Add navigation link from profile"**

```bash
# Add navigation link
git add -A
git commit --amend --no-edit
# Still ONE commit with all changes
```

**Result:** One clean commit instead of 3 commits

### Amend vs New Commit Comparison

**❌ Without amend (messy history):**

```
abc1234 feat: implement Member Tags endpoint
def5678 refactor: move pagination outside card
ghi9012 feat: add navigation link
```

**PR shows:** 3 commits, reviewer sees iteration process

**✅ With amend (clean history):**

```
abc1234 feat: implement Member Tags endpoint
```

**PR shows:** 1 commit, reviewer sees final polished state

### Safety Notes

**Amend is safe when:**

- ✅ Commit is only on your local branch
- ✅ Commit has NOT been pushed to origin
- ✅ No one else is working on your branch

**Amend is dangerous when:**

- ❌ Commit has been pushed to origin (would require force-push)
- ❌ Others have pulled your branch
- ❌ PR has already been created (can still amend, but see below)

### Amending After PR Created

**If you already created PR and need to fix something:**

**Option 1 (Preferred): New commit**

```bash
git add -A
git commit -m "fix: address review feedback"
git push origin feature/branch-name
```

**Option 2 (Only if PR is fresh/no reviews yet): Amend + force-push**

```bash
git add -A
git commit --amend --no-edit
git push --force-with-lease origin feature/branch-name
```

⚠️ **Only force-push if:**

- PR just created (< 30 minutes ago)
- No one has reviewed yet
- No CI/CD running
- You're confident no one pulled your branch

**Our workflow prevents this:** We don't create PR until Phase 3, so all iterations use amend safely.

---

### Phase 3: Push & Create PR (ONLY after explicit approval)

**⚠️ CRITICAL: AI must NOT proceed to Phase 3 without user explicitly saying:**

- "ready to push"
- "create PR"
- "push to origin"
- "ready for PR"

**DO NOT accept vague approval like "looks good" - user must explicitly request PR creation.**

**After explicit approval, AI automatically:**

1. Pushes branch to origin: `git push -u origin {branch-name}`
2. Creates PR using GitHub CLI:

   ```bash
   gh pr create --title "feat: implement {Endpoint Name}" --body "$(cat <<'EOF'
   ## Summary
   Implements {Endpoint Name} endpoint following AI-First Development Workflow.

   ## Implementation
   - Complete page with all components
   - Type-safe with Zod schemas
   - Proper error handling
   - Loading states and skeletons
   - Navigation integration

   ## Validation
   - ✅ Type-check: Passes
   - ✅ Lint: Passes
   - ✅ Tests: XXX/XXX passing
   - ✅ Manual testing: Complete

   ## Test Plan
   - [x] Tested with real Mailchimp data
   - [x] Verified schema matches API response
   - [x] Checked navigation works
   - [x] Tested error states

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

3. Presents PR URL: "✅ PR created: {URL}"
4. Waits for user to merge and confirm

### Phase 4: Post-Merge Cleanup & Documentation (Automatic)

**Trigger**: User says "PR merged", "merged and deleted remote", "merge complete", or similar confirmation

**AI automatically executes these steps in order:**

#### Step 1: Branch Cleanup

```bash
git checkout main && git pull origin main && git branch -d {branch-name}
```

#### Step 2: Update API Coverage Documentation

**⚠️ CRITICAL:** Documentation updates happen AFTER merge, not during implementation.

**For Mailchimp endpoint implementations only:**

1. Update `docs/api-coverage.md`:
   - Mark endpoint as ✅ Implemented
   - Add implementation details (route, features, PR number)
   - Update coverage stats (X/Y endpoints, Z%)

2. Commit documentation update:
   ```bash
   git add docs/api-coverage.md
   git commit -m "docs: mark {Endpoint Name} as implemented (Issue #{N})"
   git push origin main
   ```

**Why post-merge?** If PR is rejected or requires major changes, pre-merge docs would claim "implemented" but code wouldn't be in main.

**Then notifies user:**

> "✅ Post-merge tasks complete
>
> - Switched to main branch
> - Pulled latest changes (fast-forward: {old-hash}..{new-hash})
> - Deleted local branch: {branch-name}
> - Updated API coverage documentation (committed to main)
>
> Ready for next feature!"

**Important**:

- DO NOT wait for user to request cleanup or documentation
- DO NOT update `docs/api-coverage.md` during implementation (Phase 2)
- Only run after user explicitly confirms merge
- Verify branch deletion succeeded
- Documentation commits go directly to main (docs-only exception)

### Enhancement Commits Pattern

**When user requests small improvements AFTER main feature is merged:**

Make separate focused commits (< 20 lines ideal):

```bash
# Example: User requests "make emails clickable for future detail page"
git add src/components/mailchimp/lists/list-members-content.tsx
git commit -m "feat: make member emails clickable links to detail pages

Prepares for future Member Info implementation by converting email
addresses in the members table to clickable links that navigate to
/lists/{list_id}/members/{subscriber_hash}.

Changes:
- Added Link component to list-members-content.tsx
- Email addresses now link to member detail pages
- Applied primary color and hover underline styling

Related to future endpoint: GET /lists/{list_id}/members/{subscriber_hash}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Guidelines**:

- Separate commit when user explicitly requests enhancement
- Include "Related to" or "Prepares for" context
- Reference future work in commit message
- Keep focused and small
- Create new PR if needed

### What Gets Generated Automatically

The programmatic API generates complete, working infrastructure:

```
src/app/mailchimp/{resource}/[id]/{endpoint}/
├── page.tsx              # Main page with data fetching
├── loading.tsx           # Loading skeleton
└── not-found.tsx         # 404 page (for detail pages)

src/schemas/components/mailchimp/
└── {endpoint}-page-params.ts  # UI schema for route/search params

src/components/mailchimp/{resource}/
└── {endpoint}-content.tsx     # Placeholder component (AI implements)

src/dal/mailchimp.dal.ts        # New method added
src/utils/breadcrumbs/breadcrumb-builder.ts  # New function added
src/utils/mailchimp/metadata.ts              # New helper added
```

### Benefits of This Approach

✅ **Quality Control** - User reviews API contract before building infrastructure
✅ **Learning** - User sees and understands schema structure
✅ **Easy Corrections** - Fix schemas before generating 500+ lines of code
✅ **Clear Checkpoints** - Explicit approval makes workflow predictable
✅ **Async-Friendly** - User can review schemas later, then approve
✅ **Consistency** - All pages follow same patterns automatically
✅ **Speed** - 2-3 hours → 5-10 minutes per page

### Tracking Progress

Check `docs/api-coverage.md` to see:

- ✅ Implemented endpoints
- ⭐ Priority endpoints (next to implement)
- 📋 Planned endpoints
- Implementation progress (X/Y endpoints, Z%)

### Workflow Summary

**User Involvement Required:**

- ✅ Approve Phase 1 schemas (after review)
- ✅ Confirm PR has been merged

**Fully Automatic (No User Action Needed):**

- ✅ Branch creation
- ✅ Phase 1 commit (after approval)
- ✅ Phase 2 implementation
- ✅ Phase 2 commit (after validation)
- ✅ PR creation and push
- ✅ Post-merge cleanup (after confirmation)

### Example Session Flow

```
User: "Implement the Location Activity endpoint"

AI: [Automatically creates feature/location-activity-endpoint branch]
AI: "✅ Created branch: feature/location-activity-endpoint"
AI: [Fetches Mailchimp API docs]
AI: [Creates schemas matching API exactly]
AI: [Presents schemas with source docs and response example]
AI: "I've created schemas based on Mailchimp API docs. Please review."

User: "Approved"

AI: [Automatically commits Phase 1]
AI: "✅ Phase 1 committed (4240049)"
AI: [Runs page generator]
AI: [Implements components, types, skeleton]
AI: [Updates DAL with proper types]
AI: [Runs validation: type-check, lint, format, test]
AI: [Automatically commits Phase 2]
AI: "✅ Phase 2 committed (fb17638)"
AI: [Automatically pushes branch]
AI: [Automatically creates PR]
AI: "✅ PR created: https://github.com/.../pull/218"
AI: "⏸️ Please review and merge the PR. Say 'PR merged' when done."

User: "PR merged"

AI: [Automatically checks out main, pulls, deletes branch]
AI: "✅ Cleanup complete. On main branch, ready for next feature!"
```

**Key Points:**

- User only interacts at 2 checkpoints (approve schemas, confirm merge)
- All git operations happen automatically
- Clean, atomic commits for each phase
- No need to manually request branches, commits, or PRs

### Programmatic API Reference

**High-Level API** (recommended):

```typescript
import { generatePage } from '@/scripts/generators/api';

const result = await generatePage({
  apiParamsPath: string,
  apiResponsePath: string,
  apiErrorPath?: string,
  routePath: string,
  pageTitle: string,
  pageDescription: string,
  apiEndpoint: string,
  configKey?: string,  // auto-derived if not provided
  overrides?: {
    httpMethod?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    pageType?: "list" | "detail" | "nested-detail",
    enablePagination?: boolean,
    breadcrumbLabel?: string,
    breadcrumbParent?: string,
    features?: string[]
  }
});
```

**Low-Level API** (full control):

```typescript
import { generatePageFromConfig } from "@/scripts/generators/api";
import type { PageConfig } from "@/generation/page-configs";

const config: PageConfig = {
  /* complete config */
};
const result = await generatePageFromConfig(config, "config-key");
```

**See Also:**

- `scripts/generators/README.md` - Full generator documentation
- `scripts/generators/api/index.ts` - API documentation and examples
- `docs/execution-plans/page-generator-execution-plan.md` - Implementation details

---

## Large-Scale Refactoring Workflow

This section documents best practices for large-scale refactoring work based on successful schema reorganization (Issues #222, #223, October 2025).

### When to Use This Workflow

Use this workflow when:

- Refactoring affects 20+ files
- Changes impact multiple layers (schemas, types, components, DAL)
- There's risk of breaking existing functionality
- You need to test incrementally before committing

**Examples:** Schema reorganization, folder restructuring, API layer refactoring, component pattern migrations

### Pre-Flight Checklist

Before starting any large refactoring:

#### 1. Analysis Phase

- [ ] Document current state (file count, structure, pain points)
- [ ] Identify all affected files and layers
- [ ] Check for existing patterns to follow
- [ ] Create GitHub issues for tracking
- [ ] Read `docs/ai-workflow-learnings.md` for similar past work

#### 2. Planning Phase

- [ ] Break work into logical phases (2-4 phases recommended)
- [ ] Identify mandatory stop points for user review
- [ ] Plan rollback strategy for each phase
- [ ] Document expected outcomes per phase
- [ ] Create test plan (which tests must pass after each phase)

#### 3. Git Setup

- [ ] Create dedicated feature branch: `refactor/{description}`
- [ ] Ensure you're NOT on main: `git branch --show-current`
- [ ] Link branch to GitHub issues if applicable

#### 4. Baseline Validation

- [ ] Run full test suite: `pnpm test`
- [ ] Type-check passes: `pnpm type-check`
- [ ] Lint passes: `pnpm lint`
- [ ] Record baseline (e.g., "801 tests passing")

### Phased Refactoring Strategy

**Phase 0: Common Patterns** (if applicable)

- Create reusable patterns/utilities first
- Write comprehensive tests (70+ tests recommended)
- Commit when tests pass
- **User checkpoint:** Review common patterns before applying

**Phase 1: Low-Risk Refactoring**

- Start with files that have fewest dependencies
- Refactor incrementally (5-10 files at a time)
- Run tests after each batch
- **User checkpoint:** Review results, confirm approach works

**Phase 2: Medium-Risk Refactoring**

- Apply patterns to more complex files
- Update import paths if needed
- Test thoroughly
- **User checkpoint:** Review before proceeding to structural changes

**Phase 3: High-Risk Structural Changes**

- Folder reorganization, file moves
- Bulk import path updates (use automation)
- Final validation
- **User checkpoint:** Full testing before PR

### Mandatory Stop Points During Refactoring

**⏸️ STOP POINT 1: After Creating Common Patterns**

User must:

- Review factory functions/utilities for correctness
- Verify tests cover edge cases
- Approve approach before applying to real files

**⏸️ STOP POINT 2: After First Batch (5-10 files)**

User must:

- Verify refactored files maintain functionality
- Check type inference still works
- Confirm no regressions in tests

**⏸️ STOP POINT 3: After Type Errors**

If TypeScript errors appear after refactoring:

- **STOP immediately**
- Analyze root cause (type inference issue? missing import?)
- **DO NOT proceed** if errors indicate fundamental problem
- Consider rollback if approach is flawed

**⏸️ STOP POINT 4: Before Structural Changes**

User must:

- Approve folder structure plan
- Review import path update strategy
- Confirm all previous phases successful

**⏸️ STOP POINT 5: Before Creating PR**

User must:

- Test affected functionality in browser
- Verify all validation passes
- Review commit history for clarity

### Refactoring Automation Scripts

**Import Path Bulk Updates:**

```bash
#!/bin/bash
# Update import paths after folder reorganization
# Save as /tmp/update-imports.sh

# Example: Move schema files to nested folders
declare -A PATH_MAPPINGS=(
  ["abuse-reports-params.schema"]="reports/abuse-reports/params.schema"
  ["abuse-reports-success.schema"]="reports/abuse-reports/success.schema"
  ["abuse-reports-error.schema"]="reports/abuse-reports/error.schema"
  # ... add more mappings
)

for old_path in "${!PATH_MAPPINGS[@]}"; do
  new_path="${PATH_MAPPINGS[$old_path]}"

  # Update all imports across codebase
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
    "s|@/schemas/mailchimp/${old_path}|@/schemas/mailchimp/${new_path}|g" {} +

  echo "✅ Updated imports: ${old_path} → ${new_path}"
done

echo "🎉 All import paths updated"
```

**File Move Script (preserves git history):**

```bash
#!/bin/bash
# Move schema files to new structure with git mv
# Save as /tmp/reorganize-schemas.sh

# Create target directories
mkdir -p src/schemas/mailchimp/reports/{abuse-reports,advice,click-details}

# Move files with git mv (preserves history)
git mv src/schemas/mailchimp/abuse-reports-params.schema.ts \
       src/schemas/mailchimp/reports/abuse-reports/params.schema.ts

git mv src/schemas/mailchimp/abuse-reports-success.schema.ts \
       src/schemas/mailchimp/reports/abuse-reports/success.schema.ts

# ... repeat for all files

echo "✅ Files moved with git history preserved"
```

**Validation After Automation:**

```bash
#!/bin/bash
# Run after automated changes to verify everything works
# Save as /tmp/validate-refactoring.sh

echo "🔍 Running validation..."

echo "1️⃣ Type-checking..."
pnpm type-check || { echo "❌ Type errors found"; exit 1; }

echo "2️⃣ Linting..."
pnpm lint || { echo "❌ Lint errors found"; exit 1; }

echo "3️⃣ Running tests..."
pnpm test || { echo "❌ Tests failing"; exit 1; }

echo "4️⃣ Checking imports..."
# Ensure no leftover old import paths
if grep -r "@/schemas/mailchimp/abuse-reports-params.schema" src/; then
  echo "❌ Found old import paths"
  exit 1
fi

echo "✅ All validation passed!"
```

### Rollback Procedures

**Before Each Phase:**

```bash
# Tag current state for easy rollback
git tag refactor-phase-1-start
git tag refactor-phase-2-start
# etc.
```

**To Rollback a Single Commit:**

```bash
# If last commit broke something
git reset HEAD~1          # Undo commit, keep changes
git restore <files>       # Discard changes to specific files

# Or hard reset (lose all changes)
git reset --hard HEAD~1
```

**To Rollback Entire Phase:**

```bash
# Return to phase start
git reset --hard refactor-phase-2-start

# Or return to specific commit
git log --oneline  # Find commit hash
git reset --hard <commit-hash>
```

**To Rollback After Push (requires force push):**

```bash
# ⚠️ ONLY on feature branches, NEVER on main
git reset --hard <commit-hash>
git push --force-with-lease origin refactor/branch-name
```

### Red Flags During Refactoring

**🚩 STOP if you see:**

1. **Type errors increase** - Refactoring should maintain or improve type safety
2. **Tests start failing** - Indicates regression or breaking change
3. **Import cycles appear** - Suggests architectural problem
4. **Bundle size increases significantly** - May indicate duplication or bloat
5. **More than 3 attempts needed to fix validation** - Approach may be flawed

**When to Abort and Revert:**

- Multiple TypeScript errors that spread across codebase
- Fundamental type inference breaks (e.g., factory functions losing specificity)
- Tests fail and root cause is unclear
- Refactoring creates more complexity than it removes

**How to Document Failures:**

```markdown
## Attempted Refactoring: [Name]

**Goal:** [What we tried to achieve]

**Approach:** [How we tried to do it]

**Result:** ❌ Reverted

**Why it failed:**

- Root cause explanation
- TypeScript limitation / architectural constraint
- Example of what broke

**Lessons learned:**

- What we learned about the codebase
- Why the original pattern exists
- When to accept duplication
```

### Commit Strategy for Large Refactorings

**Granular Commits (Recommended):**

Break refactoring into 5-7 small commits:

```bash
# 1. Common patterns
git add src/schemas/mailchimp/common/
git commit -m "refactor: add common schema patterns

- Created pagination-params.schema with reusable patterns
- Added path-params.schema for campaign/list IDs
- Includes 70 comprehensive tests"

# 2. First batch of refactored files
git add src/schemas/mailchimp/{file1,file2,file3}*.ts
git commit -m "refactor: apply common patterns to 8 parameter schemas

- Reduced code duplication by 110 lines (39%)
- Maintains full type safety
- All tests passing"

# 3. Folder reorganization
git add src/schemas/mailchimp/
git commit -m "refactor: reorganize schemas into hierarchical structure

- Moved 47 schema files to resource-based folders
- Used 'git mv' to preserve file history
- Updated src/schemas/mailchimp/index.ts"

# 4. Import path updates
git add src/
git commit -m "refactor: update import paths after schema reorganization

- Updated 61 files with new schema paths
- Automated with bash script for consistency"

# 5. Documentation
git add docs/ CLAUDE.md
git commit -m "docs: document schema refactoring learnings

- Added refactoring workflow to CLAUDE.md
- Updated api-coverage.md with new paths"
```

**Benefits of Granular Commits:**

- Easy to review (5-10 minutes per commit)
- Clear progression through refactoring
- Easy to rollback specific changes
- Better git blame/history

### Post-Refactoring Checklist

After completing all phases:

- [ ] All tests passing: `pnpm test`
- [ ] Type-check passes: `pnpm type-check`
- [ ] Lint passes: `pnpm lint`
- [ ] Format check passes: `pnpm format:check`
- [ ] No TODO comments left (or documented in issues)
- [ ] Updated relevant documentation (CLAUDE.md, README, etc.)
- [ ] Import paths updated everywhere
- [ ] Git history preserved (used `git mv` for file moves)
- [ ] Commit history is clean and logical
- [ ] PR description explains motivation and approach

### Example: Schema Refactoring Session (October 2025)

**Context:** Issues #222 (folder reorg) + #223 (DRY refactoring)

**Phases:**

1. **Phase 1:** Common patterns (70 tests, 3 schemas) ✅
2. **Phase 2a:** Parameter refactoring (8 files, 110 lines saved) ✅
3. **Phase 2b:** Success schema refactoring ❌ (Type inference broke, reverted)
4. **Phase 3:** Folder reorganization (47 files moved, 61 files updated) ✅

**Results:**

- 39% code reduction in parameter schemas
- Full type safety maintained
- All 801 tests passing
- Discovered TypeScript limitation with factory functions
- Documented learnings in CLAUDE.md

**Key Lesson:** Type safety > code deduplication. When factory functions broke type inference for success schemas, we kept the explicit pattern.

---

## Development Patterns

### Error Handling

**⚠️ CRITICAL: Standard Error Handling Pattern (Issue #240)**

All dynamic route pages MUST follow this pattern:

**Required Files:**

- ✅ **error.tsx** - Client Component for unexpected crashes
- ✅ **not-found.tsx** - Server Component for 404 errors
- ❌ **NO loading.tsx** - Interferes with 404 flow (NEVER use)

**Enforced by:** `src/test/architectural-enforcement/error-handling-enforcement.test.ts`

**Standard Pattern:**

```tsx
export default async function Page({ params, searchParams }: PageProps) {
  // 1. Parse route params
  const { id } = routeParamsSchema.parse(await params);

  // 2. Fetch data
  const response = await mailchimpDAL.fetchData(id, apiParams);

  // 3. Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // 4. Extract data safely
  const data = response.success ? response.data : null;

  // 5. Render with connection guard
  return (
    <PageLayout {...}>
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <ContentComponent data={data} {...} />
        ) : (
          <DashboardInlineError error="Failed to load data" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

**Utilities:** `src/utils/errors/`

- `handleApiError(response)` - Auto-handles 404s with `notFound()`, returns error message for UI
- `handleApiErrorWithFallback(response, fallback)` - Same with custom fallback
- `is404Error(message)` - Detects 404/not found errors

**Key Principles:**

1. ✅ **404 Handling**: Always use `handleApiError()` - it auto-triggers `notFound()`
2. ✅ **Connection Errors**: Always use `MailchimpConnectionGuard` with `errorCode`
3. ✅ **Other Errors**: Use `DashboardInlineError` component (not raw divs)
4. ❌ **Never**: Call `notFound()` manually - `handleApiError()` does it
5. ❌ **Never**: Use loading.tsx - interferes with 404 flow
6. 📄 **error.tsx**: Only for unexpected crashes, not API errors

**Philosophy:** Return expected errors as values, use `notFound()` for 404s, let error boundaries catch unexpected errors.

### Breadcrumbs

**Utility:** `bc` from `@/utils/breadcrumbs`

**Usage:** `<BreadcrumbNavigation items={[bc.home, bc.mailchimp, bc.reports, bc.report(id), bc.current("Details")]} />`

**Routes:** `bc.home`, `bc.mailchimp`, `bc.reports`, `bc.lists`, `bc.generalInfo`, `bc.settings`, `bc.integrations`, `bc.report(id)`, `bc.list(id)`, `bc.reportOpens(id)`, `bc.reportAbuseReports(id)`, `bc.current(label)`, `bc.custom(label, href)`

### Standard Card Components

**Components:** `StatCard` (single metric) | `StatsGridCard` (multi-metric grid) | `StatusCard` (status + badge + metrics)

**Decision:**

- StatCard: Single metric with optional trend
- StatsGridCard: 2-4 related metrics (simple value + label)
- StatusCard: Status info with badge
- Custom: Interactive features, charts, tables

**Import types:** `@/types/components/ui` (StatCardProps, StatsGridCardProps, StatusCardProps)

### URL Params Processing

**Decision tree:**

- Pagination (`?page=N&perPage=M`) → `validatePageParams()` from `@/utils/mailchimp/page-params`
- Route params (`[id]`, `[slug]`) → `processRouteParams()` from `@/utils/mailchimp/route-params`
- Neither → No utility needed

**Docs:** `src/utils/params/README.md`

### Data Formatting

**Number Formatting:**

```tsx
// Format large numbers with thousand separators
<CardTitle>Email Activity ({totalItems.toLocaleString()})</CardTitle>;
// Output: "Email Activity (7,816)"

// Format percentages
const percentage = ((clicks / total) * 100).toFixed(2);
// Output: "12.34"

// Format currency
const amount = revenue.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
});
// Output: "$1,234.56"
```

**Date Formatting:**

Use `formatDateTimeSafe()` from `@/utils/mailchimp/date`:

```tsx
import { formatDateTimeSafe } from "@/utils/mailchimp/date";

// ISO 8601 → "Jan 15, 2025 at 2:30 PM"
<TableCell>{formatDateTimeSafe(email.timestamp)}</TableCell>;
```

**Display Priority Guidelines:**

1. **Card Titles:** Always format numbers (`.toLocaleString()`)
2. **Table Headers:** Format if displaying counts
3. **Table Cells:** Format dates, large numbers, percentages
4. **Badges:** Raw values are okay (e.g., status badges)

**See:** `docs/ai-workflow-learnings.md` for complete formatting guide

### Adding Navigation Links to Detail Pages

When implementing a new detail page (like Growth History), add navigation links from parent pages following this standard pattern:

**Pattern** (used in campaign/list detail pages):

1. **Location**: Add to the relevant tab (Stats, Details, Overview, etc.)
2. **Component**: Use `CardFooter` with border styling
3. **Button**: `Button` with `asChild`, `variant="outline"`, `size="sm"`
4. **Link**: Next.js `Link` component
5. **Icon**: Include `ArrowRight` icon for consistency

**Example Implementation:**

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

<Card>
  <CardHeader>
    <CardTitle>Engagement Metrics</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Metrics content */}
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Open Rate:</span>
        <span className="font-semibold">{openRate.toFixed(1)}%</span>
      </div>
      {/* More metrics... */}
    </div>
  </CardContent>
  <CardFooter className="border-t pt-4">
    <Button asChild variant="outline" size="sm" className="w-full">
      <Link href={`/mailchimp/lists/${list.id}/growth-history`}>
        View Growth History
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </CardFooter>
</Card>;
```

**Key Points:**

- `CardFooter` always has `className="border-t pt-4"` for visual separation
- Button uses `variant="outline"` for secondary action appearance
- Button uses `size="sm"` and `className="w-full"` for consistent sizing
- Arrow icon uses `className="ml-2 h-4 w-4"` for spacing and size
- Text should be action-oriented: "View X", "Explore Y", "See Z"

**Reference Implementation:**

- Campaign Reports: `src/components/dashboard/reports/CampaignReportDetail.tsx`
- List Details: `src/components/mailchimp/lists/list-detail.tsx:369-381`

### Table Implementation Patterns

#### Pagination Placement (CRITICAL)

**✅ CORRECT** - Pagination OUTSIDE Card:

```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Title ({total.toLocaleString()})</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>{/* Table rows */}</Table>
    </CardContent>
  </Card>

  {/* Pagination Controls - OUTSIDE Card */}
  {total_items > 0 && (
    <div className="flex items-center justify-between">
      <PerPageSelector
        value={pageSize}
        createPerPageUrl={createPerPageUrl}
        itemName="items"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </div>
  )}
</div>
```

**❌ INCORRECT** - Pagination inside CardContent:

```tsx
<Card>
  <CardContent>
    <Table>{/* Table rows */}</Table>

    {/* DON'T PUT PAGINATION HERE - breaks visual hierarchy */}
    <div className="flex items-center justify-between pt-4">
      <PerPageSelector ... />
      <Pagination ... />
    </div>
  </CardContent>
</Card>
```

**Why**: Pagination controls should be siblings of the Card, not children of CardContent, to maintain proper visual separation and spacing consistency.

**Reference Files**:

- `src/components/mailchimp/reports/campaign-email-activity-table.tsx:148-163`
- `src/components/mailchimp/reports/click-details-content.tsx:196-212`
- `src/components/mailchimp/lists/list-activity-content.tsx:127-141`

#### Server Component Tables (Default Pattern)

**Use for:** Simple lists, paginated data, read-only displays

```typescript
// Server Component (no "use client")
export function CampaignUnsubscribesTable({
  data,
  currentPage,
  pageSize,
  campaignId,
}: Props) {
  const baseUrl = `/mailchimp/reports/${campaignId}/unsubscribes`;

  // URL generation functions
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unsubscribes ({data.total_items.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.members.map((member) => (
                <TableRow key={member.email_id}>
                  <TableCell>{member.email_address}</TableCell>
                  <TableCell>{formatDateShort(member.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination OUTSIDE Card */}
      {data.total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector value={pageSize} createPerPageUrl={createPerPageUrl} itemName="members" />
          <Pagination currentPage={currentPage} totalPages={Math.ceil(data.total_items / pageSize)} createPageUrl={createPageUrl} />
        </div>
      )}
    </div>
  );
}
```

**Benefits**:

- Server Component (smaller bundle, better performance)
- URL-based pagination (SEO-friendly, shareable links)
- No hooks needed (simpler code)
- Always use shadcn/ui `Table` component (never raw HTML `<table>`)

**See:** `docs/ai-workflow-learnings.md` for complete table patterns and decision tree

### PageLayout Component

**Usage:** All dashboard pages use `PageLayout` from `@/components/layout`

**Patterns:**

- **Static pages:** `breadcrumbs={[bc.home, bc.current("Page")]}`
- **Dynamic pages:** `breadcrumbsSlot={<Suspense><BreadcrumbContent /></Suspense>}`

**Props:** title, description, skeleton (required) + breadcrumbs XOR breadcrumbsSlot

### Metadata Helpers

**Helpers:** `generateCampaignReportMetadata`, `generateCampaignOpensMetadata`, `generateCampaignAbuseReportsMetadata` from `@/utils/metadata`

**Usage:** `export const generateMetadata = generateCampaignOpensMetadata;` (1 line vs 30+ inline)

**Type helper:** `import type { GenerateMetadata } from "@/types/components/metadata"` for type-safe metadata functions

### Page Component Headers

**Template:**

```tsx
/**
 * [Page Title]
 * [1-2 sentence description]
 *
 * @route [/path/to/page]
 * @requires [None | Kinde Auth | Mailchimp connection | Both]
 * @features [Feature 1, Feature 2, Feature 3]
 */
```

**VSCode snippet:** Type `pageheader` + Tab

### Schema & API Patterns

**IMPORTANT: Schema refactoring in progress** (Issues #222, #223)

- Folder reorganization: Moving to hierarchical structure
- DRY refactoring: Extracting common patterns
- Comment standardization: Enforcing consistent style
- Branch: `refactor/schema-organization`

**Until refactoring is complete, follow these standards for new schemas:**

#### Comment Standards (User-Approved Pattern)

**File Header - Always Include:**

```typescript
/**
 * [Resource Name] [Params|Success|Error] Schema
 * Schema for [description]
 *
 * Endpoint: [METHOD] /[full/path]
 * Documentation: [Mailchimp API URL]
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
```

**Property Comments - Inline Only (NOT JSDoc @property):**

```typescript
export const schema = z.object({
  field_name: z.string(), // Brief description without period
  count: z.number().int().min(0), // Integer count of items
  rate: z.number().min(0).max(1), // Decimal rate (0-1)
  timestamp: z.iso.datetime({ offset: true }), // ISO 8601 with timezone
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

**Strict Mode - Always Comment:**

```typescript
export const schema = z
  .object({
    // properties...
  })
  .strict(); // Reject unknown properties for input validation
```

**Common Field Comments (Standardized):**

- `fields` → `// Comma-separated fields to include`
- `exclude_fields` → `// Comma-separated fields to exclude`
- `count` → `// Number of records (1-1000)`
- `offset` → `// Records to skip for pagination`
- `total_items` → `// Total count`
- `_links` → `// HATEOAS navigation links`
- IDs → `// [Resource] ID`
- Rates → `// Decimal rate (0-1)`
- Dates → `// ISO 8601 with timezone`

#### Common Schemas (Use When Applicable)

**Path Parameters:**

```typescript
// For campaign endpoints
import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = campaignIdPathParamsSchema;

// For list endpoints
import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = listIdPathParamsSchema;
```

**Query Parameters:**

```typescript
// Standard pagination + field filtering (most common)
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
export const queryParamsSchema = standardQueryParamsSchema;

// With additional parameters
export const queryParamsSchema = standardQueryParamsSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
});
```

**Paginated Response:**

```typescript
// ⚠️ DO NOT use factory function - it breaks TypeScript type inference
// TypeScript cannot infer specific property names from computed object keys
// See "Schema Refactoring Learnings" section below for details

// Instead, define the schema explicitly:
export const responseSchema = z.object({
  resource_name: z.array(itemSchema), // Array of items
  campaign_id: z.string().min(1), // Parent resource ID (optional)
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

**Error Schemas:**

```typescript
// Always use common error schema
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";
export const endpointErrorSchema = errorSchema;
```

**Before creating new schemas, always check existing patterns:**

```bash
# Check parameter schema patterns
grep -r "ParamsSchema" src/schemas/mailchimp/*-params.schema.ts

# Check for reusable common schemas
grep -r "schemaName" src/schemas/mailchimp/common/

# Find similar endpoint schemas (for pattern reference)
ls src/schemas/mailchimp/*-success.schema.ts
```

#### Schema Creation Checklist (Critical Rules)

**Parameter Schemas (`*-params.schema.ts`):**

1. ✅ **Export path and query schemas separately** (do NOT use `.merge()`)

   ```typescript
   // ✅ Good
   export const pathParamsSchema = z.object({ id: z.string().min(1) }).strict();
   export const queryParamsSchema = z
     .object({ count: z.coerce.number() })
     .strict();

   // ❌ Bad - DO NOT merge
   export const paramsSchema = pathParamsSchema.merge(queryParamsSchema);
   ```

2. ✅ **Always add `.strict()` with comment**

   ```typescript
   .strict(); // Reject unknown properties for input validation
   ```

3. ✅ **ID fields MUST use `.min(1)` to prevent empty strings**

   ```typescript
   campaign_id: z.string().min(1), // Campaign ID
   list_id: z.string().min(1), // List ID
   ```

4. ✅ **Use const arrays for enums**

   ```typescript
   export const SORT_FIELD = "month" as const;
   export const SORT_DIRECTIONS = ["ASC", "DESC"] as const;

   sort_field: z.literal(SORT_FIELD).optional(),
   sort_dir: z.enum(SORT_DIRECTIONS).optional(),
   ```

**Zod 4 Best Practices:**

- ✅ **Optional with default:** Use `.default(value)` alone
  ```typescript
  count: z.coerce.number().min(1).max(1000).default(10), // NOT .default(10).optional()
  ```
- ✅ **Optional without default:** Use `.optional()` alone
  ```typescript
  fields: z.string().optional(),
  ```
- ❌ **NEVER use `.default().optional()`** (redundant - `.default()` makes it optional automatically)

**Success Schemas (`*-success.schema.ts`):**

1. ✅ **All ID fields MUST use `.min(1)`**

   ```typescript
   list_id: z.string().min(1), // List ID
   campaign_id: z.string().min(1), // Campaign ID
   email_id: z.string().min(1), // Email ID
   ```

2. ✅ **Compare with similar endpoints** to match flat vs nested patterns
   - Check if other endpoints for same resource use nested objects or flat structure

3. ✅ **Check `common/` directory** for reusable schemas before inlining
   - `linkSchema`, `errorSchema`, `campaignIdPathParamsSchema`, etc.

4. ✅ **If duplicating schemas**, create GitHub issue for future refactoring
   - Add TODO comment with issue number

**Advanced Validation Patterns:**

From List Members implementation (October 2025):

```typescript
// ISO 8601 datetime with timezone offset
since_timestamp_opt: z.iso.datetime({ offset: true }).optional();

// IP address (IPv4 or IPv6)
ip_signup: z.union([z.ipv4(), z.ipv6()]).optional();

// ISO 4217 currency code (3 uppercase letters)
currency_code: z.string().length(3).toUpperCase();

// Boolean from query param (requires coercion)
vip_only: z.coerce.boolean().optional();

// Extracted enum constants (reusable)
export const MEMBER_STATUS_FILTER = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;
status: z.enum(MEMBER_STATUS_FILTER).optional();
```

**Schema validation checklist:**

- ✅ Use `z.iso.datetime({ offset: true })` for timestamps with timezone
- ✅ Use `z.union([z.ipv4(), z.ipv6()])` for IP addresses
- ✅ Use `.length(3).toUpperCase()` for ISO 4217 currency codes
- ✅ Use `z.coerce.boolean()` for boolean query parameters
- ✅ Extract enums to constants for reusability and type safety

**Deprecated Fields:**

- Use inline comments (not TypeScript `@deprecated` JSDoc):
  ```typescript
  existing: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  imports: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  ```

#### Schema File Structure Standards

**File Header Format (JSDoc)**:

```typescript
/**
 * {Endpoint Name} {Params|Success|Error} Schema
 * {1-line description of what this validates}
 *
 * Endpoint: {METHOD} {/api/path}
 * Source: {URL to Mailchimp API docs or "User-provided actual structure"}
 */
```

**Property Comments (inline, NOT JSDoc blocks)**:

```typescript
export const listActivityItemSchema = z.object({
  day: z.iso.datetime({ offset: true }), // ISO 8601 date
  emails_sent: z.number().int().min(0), // Integer count of emails sent
  unique_opens: z.number().int().min(0), // Integer count of unique opens
});
```

**Schema Files Should Contain**:

- ✅ Import statements
- ✅ Constant arrays (enums): `export const STATUS = ["active", "inactive"] as const;`
- ✅ Schema definitions with inline comments
- ✅ Schema exports
- ❌ NO type exports (use `z.infer` in `/src/types` instead)
- ❌ NO helper functions (put in `/src/utils`)
- ❌ NO JSDoc blocks on individual properties (use inline comments)

**Error Schema Pattern (Minimal)**:

```typescript
/**
 * {Endpoint Name} Error Response Schema
 * Validates error responses from {endpoint description}
 *
 * Endpoint: {METHOD} {/path}
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const {endpoint}ErrorSchema = errorSchema;
```

**Reference**: `src/schemas/mailchimp/domain-performance-error.schema.ts`

#### Schema Creation Rules

**Before creating new schemas, always check existing patterns:**

```bash
# Check parameter schema patterns
grep -r "ParamsSchema" src/schemas/mailchimp/*-params.schema.ts

# Check for reusable common schemas
grep -r "schemaName" src/schemas/mailchimp/common/

# Find similar endpoint schemas (for pattern reference)
ls src/schemas/mailchimp/*-success.schema.ts
```

**Example:**

```typescript
/**
 * Mailchimp API Campaign Location Activity Success Response Schema
 *
 * Endpoint: GET /reports/{campaign_id}/locations
 * Documentation: https://mailchimp.com/developer/marketing/api/location-reports/list-top-open-activities/
 *
 * ✅ VERIFIED FIELDS (from API response example):
 * - country_code: string (ISO 3166-1 alpha-2)
 * - region: string (optional)
 * - region_name: string (default: "Rest of Country")
 * - opens: number
 * - proxy_excluded_opens: number
 *
 * Last verified: 2025-01-22
 */
```

**Schema Creation Rules:**

1. **Parameter Schemas** (`*-params.schema.ts`):
   - Export path and query schemas separately (do NOT use `.merge()`)
   - Path params: `{endpoint}PathParamsSchema`
   - Query params: `{endpoint}QueryParamsSchema`
   - Always add `.strict()` with comment: `// Reject unknown properties for input validation`
   - ID fields MUST use `.min(1)` to prevent empty strings
   - Include schema file header with API documentation URL

2. **Zod 4 Best Practices**:
   - Optional with default: `.default(value)` alone (NOT `.default().optional()`)
   - Optional without default: `.optional()` alone
   - NEVER use `.default().optional()` (redundant, `.default()` makes field optional automatically)

3. **Success Schemas** (`*-success.schema.ts`):
   - All ID fields (`campaign_id`, `list_id`, `email_id`, etc.) MUST use `.min(1)`
   - Compare with similar endpoints to match flat vs nested patterns
   - Check `common/` directory for reusable schemas before inlining
   - If duplicating schemas, create GitHub issue for future refactoring

4. **Error Schemas** (`*-error.schema.ts`):
   - Usually just extends `errorSchema` from `@/schemas/mailchimp/common/error.schema`

**Standard Patterns:**

- **API naming:** Always match API property names in Zod schemas and types
- **Enums:** `export const VISIBILITY = ["pub", "prv"] as const;` + `z.enum(VISIBILITY)`
- **DateTime:** Use `z.iso.datetime({ offset: true })` for ISO 8601 (recommended), `z.iso.datetime()` for UTC-only
- **Deprecated:** Never use `z.string().datetime()` (enforced by tests)

**Example Pattern** (from `report-click-details-params.schema.ts`):

```typescript
// Path params
export const clickListPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

// Query params
export const clickListQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10), // Note: .default() alone
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation

// Do NOT export a merged schema
```

### Table Implementation Patterns

**Decision Tree:**

1. **Simple List Display** (recommended default):
   - Use shadcn/ui `Table` component in a Server Component
   - URL-based pagination with `URLSearchParams`
   - Examples: `reports-table.tsx`, `campaign-unsubscribes-table.tsx`, `campaign-email-activity-table.tsx`
   - **When:** Read-only tables, simple sorting, no complex filtering

2. **Interactive Tables** (only when necessary):
   - Use TanStack Table + shadcn/ui `Table` in a Client Component
   - Examples: `campaign-opens-table.tsx`, `campaign-abuse-reports-table.tsx`, `click-details-content.tsx`
   - **When:** Multi-column sorting, column visibility toggles, complex filtering

**Server Component Pagination Pattern:**

```tsx
export function MyTable({ data, currentPage, pageSize, totalItems }: Props) {
  const baseUrl = `/path/to/page`;

  // URL generation functions
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Card>
      {/* Table content */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / pageSize)}
        createPageUrl={createPageUrl}
      />
      <PerPageSelector
        value={pageSize}
        createPerPageUrl={createPerPageUrl}
        itemName="items per page"
      />
    </Card>
  );
}
```

**⚠️ NEVER use raw HTML `<table>` markup** - always use shadcn/ui `Table` components

**See:** `docs/ai-workflow-learnings.md` for complete decision tree and examples

### Component Development

**Server Components by default:**

- **CRITICAL:** layouts (`layout.tsx`, `dashboard-shell.tsx`) and `not-found.tsx` MUST be Server Components (404 status codes)
- Only use `"use client"` for hooks (useState, useEffect) or browser APIs
- Extract client logic to child components, keep parent as Server Component
- **Tables:** Default to Server Components with URL-based pagination (see Table Implementation Patterns above)
- Enforced by architectural tests

**Patterns:** Atomic design, shadcn/ui base, JSDoc comments

### UI Component Patterns

#### Star Rating Display

**When to use**: Member ratings, reviews, quality scores (0-5 scale)

```typescript
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}
```

**Key points**:

- 5-star maximum (industry standard)
- Dark mode support with conditional classes
- Small size (`h-3 w-3`) for inline display
- Yellow fill for active stars, gray for inactive

#### Badge Variant Mapping

**Problem**: shadcn/ui Badge only has 4 variants, but you have 6+ statuses

**Solution**: Map multiple statuses to available variants

```typescript
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "subscribed":
      return "default"; // Positive/active
    case "unsubscribed":
      return "destructive"; // Negative/error
    case "cleaned":
      return "secondary"; // Neutral/inactive
    case "pending":
      return "outline"; // Pending/transitional
    case "transactional":
      return "outline";
    case "archived":
      return "secondary";
    default:
      return "default";
  }
}
```

**Mapping strategy**:

- **default**: Positive/active states (subscribed, success, active)
- **destructive**: Negative/error states (unsubscribed, failed, error)
- **secondary**: Neutral/inactive states (cleaned, archived, disabled)
- **outline**: Pending/transitional states (pending, transactional, processing)

#### Clickable Primary Identifier with Subtext

**When to use**: Table cells with primary identifier + optional secondary info

```typescript
<TableCell>
  <div className="space-y-1">
    <Link
      href={`/mailchimp/lists/${listId}/members/${member.id}`}
      className="font-medium text-primary hover:underline"
    >
      {member.email_address}
    </Link>
    {member.full_name && (
      <div className="text-sm text-muted-foreground">
        {member.full_name}
      </div>
    )}
  </div>
</TableCell>
```

**Key points**:

- Primary identifier is clickable link
- `text-primary` for brand color consistency
- `hover:underline` for clear affordance
- Secondary info in smaller, muted text
- Conditional rendering of optional fields

**Examples**:

- Email + Name (list members)
- Campaign ID + Title (reports)
- List ID + Description (lists)

### Mailchimp Fetch Client Architecture

**Layers:** Server Actions → DAL → Action Wrapper → Fetch Client → Mailchimp API

**Files:**

- `src/lib/errors/mailchimp-errors.ts` - Error classes
- `src/lib/mailchimp-fetch-client.ts` - Native fetch client (Edge compatible)
- `src/lib/mailchimp-client-factory.ts` - `getUserMailchimpClient()`
- `src/lib/mailchimp-action-wrapper.ts` - `mailchimpApiCall()` returns ApiResponse<T>
- `src/dal/mailchimp.dal.ts` - Business logic (singleton)

**Usage:** `const result = await mailchimpDAL.fetchCampaignReports({ count: 10 }); if (!result.success) ...`

**Benefits:** 97% smaller bundle, Edge Runtime compatible, rate limit tracking, timeout handling

### OAuth Setup (Quick Reference)

**Mailchimp OAuth:**

1. Create Neon DB via Vercel (Storage tab)
2. `vercel env pull .env.local`
3. Register OAuth app at Mailchimp → Add client ID/secret to `.env.local`
4. Generate encryption key: `openssl rand -base64 32` → Add to `.env.local`
5. `pnpm db:push` → `pnpm dev`
6. Visit `/settings/integrations` to connect

**Kinde Local HTTPS:**

- **Required:** `KINDE_COOKIE_DOMAIN=127.0.0.1` in `.env.local` for OAuth state persistence
- **Troubleshooting "State not found":** `pkill -f "next dev"` → `pnpm clean` → `pnpm dev` → Clear browser cache → Test in incognito
- **Production:** Remove or set to custom domain

## Schema Refactoring Learnings

**Context:** During Issues #222 and #223 refactoring work (October 2025), we attempted to eliminate code duplication across schema files using factory functions and common patterns.

### When to Refactor Schemas

**Good Reasons to Refactor:**

- 10+ files with identical 5+ line patterns (e.g., pagination, path params)
- Schema patterns change frequently and need single source of truth
- New endpoint needs pattern that exists in 5+ places
- Adding validation that should apply to all similar schemas

**Bad Reasons to Refactor:**

- "Just because" DRY principle without concrete pain point
- Duplication is only 2-3 lines
- Pattern is stable and unlikely to change
- Refactoring would break type inference

**Red Flags That Suggest NOT to Refactor:**

- Success schemas with unique resource keys (e.g., `abuse_reports`, `clicks`, `opens`)
- Patterns that are self-documenting when inline
- Duplication that aids readability
- Cases where abstraction would require complex generics

### ✅ What Works: Parameter Schema Patterns

**Path Parameters** - Successfully refactored using re-exports:

```typescript
// ✅ WORKS: Direct re-export preserves types
import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const myEndpointPathParamsSchema = campaignIdPathParamsSchema;

// Type inference: { campaign_id: string }
```

**Query Parameters** - Successfully refactored using composition:

```typescript
// ✅ WORKS: Extends standard schema
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
export const myQueryParamsSchema = standardQueryParamsSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(),
});

// Type inference: { fields?: string, exclude_fields?: string, count: number, offset: number, since?: string }
```

**Results:**

- 8 parameter schema files successfully refactored
- 110 lines of code eliminated (39% reduction)
- Full type safety maintained
- All 801 tests passing

### ❌ What Doesn't Work: Success Schema Factories

**Paginated Response Factory** - Attempted but breaks type inference:

```typescript
// ❌ BREAKS TYPE INFERENCE: Computed property names lose specificity
export function createPaginatedResponse<T extends ZodType>(
  itemSchema: T,
  resourceKey: string, // ← Dynamic key
  idKey?: string, // ← Dynamic key
) {
  const baseShape = {
    [resourceKey]: z.array(itemSchema), // ← TypeScript can't track this
    total_items: z.number().min(0),
    _links: z.array(linkSchema),
  };

  if (idKey) {
    return z.object({
      ...baseShape,
      [idKey]: z.string().min(1), // ← TypeScript can't track this
    });
  }

  return z.object(baseShape);
}

// Usage:
export const responseSchema = createPaginatedResponse(
  abuseReportSchema,
  "abuse_reports",
  "campaign_id",
);

// ❌ Type inference becomes: Record<string, unknown>
// ✅ Expected type: { abuse_reports: AbuseReport[], campaign_id: string, total_items: number, _links: Link[] }
```

**The Problem:**

1. TypeScript cannot infer specific property names from computed object keys `[resourceKey]` or `[idKey]`
2. The inferred type becomes `Record<string, ...>` instead of having named properties
3. This breaks type safety for all consuming code:
   - Page components can't access `data.abuse_reports` (property doesn't exist on `Record<string, ...>`)
   - Table components lose autocomplete
   - DAL methods have incorrect return types
4. Results in 27+ TypeScript errors across pages, components, and DAL

**Why This Is a TypeScript Limitation:**

TypeScript's structural type system cannot track dynamic object keys at compile time. When you write:

```typescript
const key = "abuse_reports";
const obj = { [key]: value };
```

TypeScript only knows `obj` has _some_ property, but not which specific property. This is fundamental to how TypeScript works and cannot be worked around without losing type information.

**Attempted Solutions (All Failed):**

1. ❌ Generic type parameters: `createPaginatedResponse<T, K extends string>(itemSchema: T, resourceKey: K)` - Still loses specificity
2. ❌ Const assertions: `as const` doesn't help with computed properties
3. ❌ Template literal types: Can't be used to construct object types dynamically
4. ❌ Type predicates: Would require manual type assertions everywhere

### 📊 Final Decision

**Code duplication is acceptable when:**

- The duplicated code is simple (4-5 lines)
- It's stable and unlikely to change
- Eliminating it breaks type safety
- The pattern is self-documenting

**For success schemas, we keep the explicit pattern:**

```typescript
// ✅ PREFERRED: Explicit schema with full type inference
export const abuseReportListSuccessSchema = z.object({
  abuse_reports: z.array(abuseReportSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});

// Type inference:
// {
//   abuse_reports: AbuseReport[],
//   campaign_id: string,
//   total_items: number,
//   _links: Link[]
// }
```

**Trade-offs:**

- ❌ ~95 lines of duplication across 8 success schema files (~12 lines per file)
- ✅ Full type safety with autocomplete
- ✅ Clear, readable schemas
- ✅ No TypeScript errors
- ✅ Self-documenting structure

### 🎓 Key Takeaway

**Type safety > code deduplication**

When refactoring creates type inference issues that ripple through the codebase, the duplication is worth keeping. TypeScript's primary value is catching errors at compile time - sacrificing that for DRY principles defeats the purpose.

### Testing Strategy for Schema Refactoring

**When Creating Common Schema Patterns:**

Write comprehensive tests (70+ recommended) covering:

- Valid inputs (basic cases)
- Edge cases (empty strings, max values, boundary conditions)
- Invalid inputs (wrong types, missing required fields, unknown properties)
- Schema composition (`.extend()`, `.merge()`, `.pick()`, `.omit()`)
- Type inference (verify `z.infer<typeof schema>` works correctly)

**Example Test Structure:**

```typescript
describe("Common Schema Pattern", () => {
  describe("Valid Cases", () => {
    it("should validate basic input", () => {});
    it("should apply defaults", () => {});
    it("should handle optional fields", () => {});
  });

  describe("Edge Cases", () => {
    it("should accept minimum values", () => {});
    it("should accept maximum values", () => {});
    it("should handle empty arrays", () => {});
  });

  describe("Invalid Cases", () => {
    it("should reject unknown properties (.strict())", () => {});
    it("should reject wrong types", () => {});
    it("should reject missing required fields", () => {});
  });

  describe("Composition", () => {
    it("should extend with additional fields", () => {});
    it("should override defaults when extended", () => {});
  });
});
```

**After Refactoring Existing Schemas:**

- Run full test suite: `pnpm test` (must show same pass count)
- Type-check: `pnpm type-check` (zero errors)
- Lint: `pnpm lint` (no new warnings)
- Manual verification: Import refactored schema in consuming code, verify autocomplete works

**Related Issues:** #222 (folder reorganization), #223 (DRY refactoring)

## Git Strategy

**Branches:** `feature/description` or `fix/description` (lowercase, hyphens)

**Commits:** Conventional commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`)

**Workflow:** Always use PRs, never push to main directly

### Pre-commit Hooks Setup

**First-time setup:**

```bash
# Configure Git to use Husky hooks
git config core.hooksPath .husky

# Verify hooks are enabled
git config core.hooksPath
# Should output: .husky
```

**Hooks run automatically on every commit:**

1. **Quick validation** (`pnpm type-check`) - **NEW:** Catches type errors BEFORE formatting
2. Format staged files (`pnpm lint-staged`)
3. Verify formatting (`pnpm format:check`)
4. Type-check again (`pnpm type-check`)
5. Run tests (`pnpm test`)
6. Accessibility tests (`pnpm test:a11y`)
7. Secret scan (`pnpm check:no-secrets-logged`)

**Note:** The early type-check (step 1) prevents lint-staged from removing "unused" type imports that are actually used. This improvement was added in Issue #213.

**Troubleshooting:**

If CI/CD fails with formatting errors but local commits succeed:

```bash
# Verify hooks are configured
git config core.hooksPath

# If empty, reconfigure
git config core.hooksPath .husky

# Verify hooks exist
ls -la .husky/pre-commit

# Test hooks with dummy commit
git add . && git commit -m "test: verify hooks" --allow-empty
```

**See:** `.husky/pre-commit` for complete hook configuration

## Security

- Never log env vars, API keys, OAuth tokens, secrets (auto-scanned)
- Environment validation: `src/lib/config.ts`
- All API endpoints use Zod validation
- OAuth tokens encrypted at rest (AES-256-GCM)
- HTTPS-only in production, CSRF protection via state params
