# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

---

## AI-First Development Workflow

This project uses an **AI-assisted, two-phase workflow** for implementing new Mailchimp dashboard pages.

### Overview

**Phase 1: Schema Creation & Review** ✋ (STOP POINT)
**Phase 2: Page Generation** 🚀 (After Approval)

### Phase 1: Schema Creation & Review

When implementing a new Mailchimp API endpoint:

1. **AI analyzes Mailchimp API documentation** for the target endpoint
2. **AI creates Zod schemas** in `src/schemas/mailchimp/`:
   - `{endpoint}-params.schema.ts` - Request parameters (path + query params)
   - `{endpoint}-success.schema.ts` - Successful response structure
   - `{endpoint}-error.schema.ts` (optional) - Error response structure
3. **AI presents schemas for review**
4. **⏸️ STOP - User reviews schemas**
   - Check field names match Mailchimp API exactly
   - Verify types are correct (string, number, boolean, etc.)
   - Confirm pagination structure if applicable
   - Request changes if needed
5. **User approves schemas** - Say "approved" or "looks good" to proceed

### Phase 2: Page Generation (After Approval)

Once schemas are approved:

6. **AI calls programmatic generator API**:

   ```typescript
   import { generatePage } from "@/scripts/generators/api";

   const result = await generatePage({
     apiParamsPath: "src/schemas/mailchimp/{endpoint}-params.schema.ts",
     apiResponsePath: "src/schemas/mailchimp/{endpoint}-success.schema.ts",
     apiErrorPath: "src/schemas/mailchimp/{endpoint}-error.schema.ts", // optional
     routePath: "/mailchimp/{resource}/[id]/{endpoint}",
     pageTitle: "...",
     pageDescription: "...",
     apiEndpoint: "/api/endpoint/path",
   });
   ```

7. **Generator creates infrastructure** (500-800 lines):
   - Page files (`page.tsx`, `loading.tsx`, `not-found.tsx`)
   - UI schemas (converts API schemas to page params)
   - Placeholder component (with Construction card)
   - DAL method
   - Breadcrumb function
   - Metadata helper
8. **AI implements component logic** (replaces Construction card)
9. **AI runs validation**:
   - `pnpm type-check` - TypeScript validation
   - `pnpm lint:fix` - Code style fixes
   - `pnpm test` - All tests pass
10. **AI updates `docs/api-coverage.md`** - Mark endpoint as ✅ complete

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

### Example Session

```
User: "Create schemas for the Campaign Clicks endpoint"

AI: [Analyzes Mailchimp docs, creates 3 schema files, shows them]
AI: "I've created the schemas. Please review and approve before proceeding."

User: [Reviews schemas]
User: "Approved"

AI: [Calls generatePage(), implements component, runs tests]
AI: "✅ Campaign Clicks page complete. Updated api-coverage.md."
```

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

**Schema Creation Rules:**

1. **Parameter Schemas** (`*-params.schema.ts`):
   - Export path and query schemas separately (do NOT use `.merge()`)
   - Path params: `{endpoint}PathParamsSchema`
   - Query params: `{endpoint}QueryParamsSchema`
   - Always add `.strict()` with comment: `// Reject unknown properties for input validation`
   - ID fields MUST use `.min(1)` to prevent empty strings

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

### Component Development

**Server Components by default:**

- **CRITICAL:** layouts (`layout.tsx`, `dashboard-shell.tsx`) and `not-found.tsx` MUST be Server Components (404 status codes)
- Only use `"use client"` for hooks (useState, useEffect) or browser APIs
- Extract client logic to child components, keep parent as Server Component
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

## Security

- Never log env vars, API keys, OAuth tokens, secrets (auto-scanned)
- Environment validation: `src/lib/config.ts`
- All API endpoints use Zod validation
- OAuth tokens encrypted at rest (AES-256-GCM)
- HTTPS-only in production, CSRF protection via state params
