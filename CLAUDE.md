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

### Historical Context:

**2025-10-23**: Domain Performance endpoint was mistakenly pushed directly to main (commits c87c5f6 through cf324b4). While CI passed retroactively, this bypassed the PR review process. This mistake is documented here to ensure it never happens again.

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

---

## AI-First Development Workflow

This project uses an **AI-assisted, automated workflow** for implementing new Mailchimp dashboard pages with **mandatory user checkpoints**.

### Overview

**Phase 0: Git Setup** 🔧 (Automatic - Create branch)
**Phase 1: Schema Creation & Review** ✋ (STOP POINT - User approval required)
**Phase 1.5: Commit Phase 1** ✅ (Automatic - After user approval)
**Phase 2: Page Generation** 🚀 (Automatic - After commit)
**Phase 2.5: Commit Phase 2** ✅ (Automatic LOCAL commit only - After validation)
**Phase 2.75: User Review & Testing** ⏸️ (STOP POINT - User testing required)
**Phase 3: Push & Create PR** 📤 (ONLY after explicit "ready to push" approval)

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

Before presenting schemas for review:

**If API docs accessible:**

- [ ] ✅ Fetched official Mailchimp API documentation
- [ ] ✅ Located exact response example in docs
- [ ] ✅ Extracted all field names from response
- [ ] ✅ Verified field types
- [ ] ✅ Added source documentation URL to schema comments

**If using assumptions (user approved Option C):**

- [ ] ✅ Marked schemas with `⚠️ ASSUMED FIELDS`
- [ ] ✅ Documented what was assumed and why
- [ ] ✅ Told user: "These schemas need verification with real API response during testing"
- [ ] ✅ User aware they must test with real data to verify schema

### Phase 1.5: Commit Phase 1 (Automatic)

**IMMEDIATELY after user approves schemas, AI automatically:**

1. Stages schema files: `git add src/schemas/mailchimp/*{endpoint}*`
2. Commits with conventional commit message:

   ```
   feat: add {Endpoint Name} schemas (Phase 1)

   Created Zod schemas for {endpoint description}:
   - {endpoint}-params.schema.ts
   - {endpoint}-success.schema.ts
   - {endpoint}-error.schema.ts

   Source: {API documentation URL}
   ```

3. Notifies user: "✅ Phase 1 committed (commit hash)"
4. Proceeds to Phase 2

**DO NOT** wait for user to request commit. **DO NOT** proceed to Phase 2 without committing.

### Phase 2: Page Generation (After Approval)

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

### Phase 2.5: Commit Phase 2 Implementation (LOCAL ONLY)

**⚠️ CRITICAL: Commit to LOCAL branch only - DO NOT push to origin**

**IMMEDIATELY after all validation passes, AI automatically:**

1. Stages all Phase 2 files: `git add .`
2. Commits to **LOCAL branch** with detailed message:

   ```
   feat: implement {Endpoint Name} (Phase 2)

   Complete implementation with all components, types, and integration.

   Infrastructure:
   - Added PageConfig to page-configs.ts
   - Created route: /mailchimp/{route-path}

   Components & Types:
   - Created types from Zod schemas
   - Implemented display component
   - Created loading skeleton
   - Added not-found page

   Integration:
   - Updated DAL with proper types
   - Added breadcrumb helper
   - Created metadata function
   - Updated api-coverage.md

   Validation:
   - ✅ Type-check: Passes
   - ✅ Lint: Passes
   - ✅ Tests: XXX/XXX passing

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

3. **⏸️ STOPS and presents to user:**

   > "✅ Phase 2 implementation complete and committed locally (commit: abc123)
   >
   > **Ready for your review and testing**
   >
   > Files created/modified:
   >
   > - [list of files]
   >
   > ⚠️ PR has NOT been created yet - please review and test first
   >
   > Next: Phase 2.75 (your review & testing)"

**DO NOT push to origin. DO NOT create PR. DO NOT proceed to Phase 3.**

### Phase 2.75: User Review & Testing Loop ⏸️ (REQUIRED CHECKPOINT)

**⚠️ CRITICAL: This happens entirely on LOCAL branch before any push to origin**

**User reviews implementation:**

1. Review code locally
2. **Test page in browser with REAL Mailchimp data**
3. Verify schemas match actual API responses
4. Check navigation and UX
5. Test edge cases (empty data, errors, etc.)

**If user identifies improvements:**

- User describes needed changes
- AI implements improvements
- AI commits improvements to LOCAL branch
- Return to user testing

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

### Post-Merge Cleanup (Automatic)

**AFTER user confirms "PR merged" (or similar), AI automatically:**

1. Checks out main: `git checkout main`
2. Pulls latest changes: `git pull origin main`
3. Deletes feature branch: `git branch -d {branch-name}`
4. Notifies user: "✅ Cleanup complete. On main branch, ready for next feature!"

**DO NOT** wait for user to request cleanup.

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

## Development Patterns

### Error Handling

**Utilities:** `src/utils/errors/`

- `handleApiError(response)` - Auto-handles 404s with `notFound()`, returns error message for UI
- `handleApiErrorWithFallback(response, fallback)` - Same with custom fallback
- `is404Error(message)` - Detects 404/not found errors

**Usage:**

```tsx
import { handleApiError } from "@/utils/errors";
const response = await mailchimpDAL.fetchCampaignReport(id);
const error = handleApiError(response); // Triggers notFound() for 404s
if (error) return <ErrorDisplay message={error} />;
// Render success UI
```

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

**Before creating new schemas, always check existing patterns:**

```bash
# Check parameter schema patterns
grep -r "ParamsSchema" src/schemas/mailchimp/*-params.schema.ts

# Check for reusable common schemas
grep -r "schemaName" src/schemas/mailchimp/common/

# Find similar endpoint schemas (for pattern reference)
ls src/schemas/mailchimp/*-success.schema.ts
```

**Schema File Header Template:**

Every schema file MUST include a header documenting the API source:

```typescript
/**
 * Mailchimp API {Endpoint Name} Response Schema
 *
 * Endpoint: {HTTP_METHOD} {API_PATH}
 * Documentation: {MAILCHIMP_API_DOC_URL}
 *
 * ✅ VERIFIED FIELDS (from API response example):
 * - field_name: type (description/constraints)
 * - another_field: type (description)
 *
 * Last verified: {YYYY-MM-DD}
 */
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

1. Format staged files (`pnpm lint-staged`)
2. Verify formatting (`pnpm format:check`)
3. Type-check (`pnpm type-check`)
4. Run tests (`pnpm test`)
5. Accessibility tests (`pnpm test:a11y`)
6. Secret scan (`pnpm check:no-secrets-logged`)

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
