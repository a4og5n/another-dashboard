# Page Pattern Improvements

**Status:** Implementation in Progress (Phase 1: 75% Complete)
**Created:** 2025-10-15
**Last Updated:** 2025-10-17

## Quick Reference

✅ **Completed:** #1 Error Handling, #2 Breadcrumb Utility, #3 PageLayout Component
⏭️ **Next:** #4 Params Docs (1h) → Phase 2 improvements
📊 **Progress:** Phase 1 - 75% (3/4), Phase 2 - 0% (0/3), Phase 3 - 0% (0/1)

---

## Overview

This document outlines improvements to our page.tsx patterns to reduce duplication and improve maintainability across 13 pages. **Improvements are ordered by recommended implementation sequence.**

### Current Pattern

All pages follow a three-layer architecture:

1. **Layout Layer** - DashboardLayout + Suspense
2. **Data Fetching Layer** - Async content component with DAL calls
3. **Presentation Layer** - Pure UI components

**Common elements across all pages:**

- Breadcrumbs (static or dynamic with `BreadcrumbContent` component)
- Page header (title + description)
- Suspense boundaries with skeleton fallbacks
- MailchimpConnectionGuard for error handling
- `dynamic = "force-dynamic"` export
- Metadata (static or dynamic with `generateMetadata`)

**Two Page Patterns:**

- **Static pages** (5): Direct breadcrumb rendering, no route params
- **Dynamic pages** (8): `BreadcrumbContent` async component, `await params` pattern

### Current Page Structures (As-Built)

**Pattern A Example** - Static Page (Reports List):

```tsx
export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Direct breadcrumb rendering */}
        <BreadcrumbNavigation
          items={[bc.home, bc.mailchimp, bc.current("Reports")]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your Mailchimp reports
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<ReportsOverviewSkeleton />}>
          <ReportsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
```

**Pattern B Example** - Dynamic Page (Campaign Opens):

```tsx
export default async function CampaignOpensPage({ params, searchParams }) {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  // ... validation and data fetching ...

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs in separate Suspense boundary */}
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Campaign Opens</h1>
          <p className="text-muted-foreground">
            Members who opened this campaign
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<CampaignOpensSkeleton />}>
          <CampaignOpensPageContent {...props} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Separate async component handles await params
async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = reportOpensPageParamsSchema.parse(await params);
  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Opens"),
      ]}
    />
  );
}
```

**Key Observations:**

- Static pages: 30-35 lines of layout boilerplate
- Dynamic pages: 40-50 lines of layout boilerplate (due to `BreadcrumbContent` extraction)
- All pages repeat: DashboardLayout wrapper, space-y-6 div, header structure, Suspense pattern

---

## Phase 1: Foundation (6-8 hours)

### 1. Standardize Error Handling ✅ COMPLETED

**Priority:** High | **Effort:** 1-2h | **Status:** ✅ Deployed

**What Was Built:**

- `src/utils/errors/api-error-handler.ts` with three functions:
  - `is404Error()` - Detects 404 patterns in error messages
  - `handleApiError()` - Auto-triggers `notFound()` for 404s
  - `handleApiErrorWithFallback()` - Same with custom fallback

**Key Features:**

- Checks both status codes (404, 400) and error messages
- Handles Mailchimp API quirk (400 status + "not found" message)
- Returns errors as values (Next.js best practice)
- 100% test coverage

**Usage:**

```tsx
const response = await mailchimpDAL.fetchCampaignReport(id);
handleApiError(response); // 7-10 lines of boilerplate eliminated
```

**Impact:** 4 pages updated, 7-10 lines saved per page.

---

### 2. Breadcrumb Generation Utility ✅ COMPLETED

**Priority:** High | **Effort:** 2-3h | **Status:** ✅ Deployed

**Problem:** Manual breadcrumb arrays in every page (5-8 lines) with risk of typos.

**What Was Built:**

- `src/utils/breadcrumbs/breadcrumb-builder.ts` with `bc` object:
  - Static routes: `home`, `mailchimp`, `reports`, `lists`, `generalInfo`, `settings`, `integrations`
  - Dynamic functions: `report(id)`, `list(id)`, `reportOpens(id)`, `reportAbuseReports(id)`
  - Helpers: `current(label)`, `custom(label, href)`
- Comprehensive unit tests (39 tests, 100% coverage)
- Updated 5+ pages to use the utility

**Key Features:**

- Type-safe using existing `BreadcrumbItem` type
- Centralized route definitions prevent typos
- Eliminates 5-8 lines of boilerplate per page
- Comprehensive JSDoc documentation

**Solution (Original Design):** Create `src/utils/breadcrumbs/breadcrumb-builder.ts`

```tsx
// Export object with common routes
export const bc = {
  home: { label: "Dashboard", href: "/" },
  mailchimp: { label: "Mailchimp", href: "/mailchimp" },
  reports: { label: "Reports", href: "/mailchimp/reports" },
  lists: { label: "Lists", href: "/mailchimp/lists" },
  report: (id: string) => ({
    label: "Report",
    href: `/mailchimp/reports/${id}`,
  }),
  list: (id: string) => ({ label: "List", href: `/mailchimp/lists/${id}` }),
  current: (label: string) => ({ label, isCurrent: true }),
};
```

**Usage:**

```tsx
// Before: 8 lines
<BreadcrumbNavigation items={[
  { label: "Dashboard", href: "/" },
  { label: "Mailchimp", href: "/mailchimp" },
  { label: "Reports", href: "/mailchimp/reports" },
  { label: "Report", href: `/mailchimp/reports/${id}` },
  { label: "Opens", isCurrent: true },
]} />

// After: 1 line
<BreadcrumbNavigation items={[bc.home, bc.mailchimp, bc.reports, bc.report(id), bc.current("Opens")]} />
```

**Impact:** 5+ pages updated, 5-8 lines saved per page, centralized breadcrumb management.

**Execution Plan:** [breadcrumb-utility-execution-plan.md](execution-plans/breadcrumb-utility-execution-plan.md)

---

### 3. Extract Common Layout Pattern ✅

**Status:** COMPLETED (PR #184 merged)
**Priority:** High | **Effort:** 3-4h | **Depends:** #2 (Breadcrumbs)

**Problem:** Every page repeats 30+ lines of layout boilerplate.

**Current Reality - Two Page Patterns:**

After reviewing actual implementations, we have **two distinct patterns**:

**Pattern A - Static Pages** (no dynamic route params):

- Pages: `/mailchimp/reports`, `/mailchimp/lists`, `/settings/integrations`
- Breadcrumbs rendered directly with static `bc` items
- Simpler structure, no `await params` needed

**Pattern B - Dynamic Pages** (with `[id]` route segments):

- Pages: `/mailchimp/reports/[id]`, `/mailchimp/reports/[id]/opens`, `/mailchimp/reports/[id]/abuse-reports`
- Breadcrumbs extracted to separate `BreadcrumbContent` async component
- Wrapped in `<Suspense fallback={null}>` to handle `await params`
- Required because breadcrumbs need the dynamic `id` from route params

**Key Architecture Insight:**

`BreadcrumbNavigation` component has built-in spacing:

- `pt-20` (80px) - pushes content below fixed header
- `pb-4` (16px) - spacing below breadcrumbs
- This affects overall page layout design

**Solution:** Create `src/components/layout/page-layout.tsx` supporting both patterns

```tsx
export interface PageLayoutProps {
  breadcrumbs?: BreadcrumbItem[]; // For static pages (Pattern A)
  breadcrumbsSlot?: React.ReactNode; // For dynamic pages (Pattern B)
  title: string;
  description: string;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  breadcrumbs,
  breadcrumbsSlot,
  title,
  description,
  skeleton,
  children,
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs - support both static and dynamic patterns */}
        {breadcrumbs && <BreadcrumbNavigation items={breadcrumbs} />}
        {breadcrumbsSlot && breadcrumbsSlot}

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Main Content */}
        <Suspense fallback={skeleton}>{children}</Suspense>
      </div>
    </DashboardLayout>
  );
}
```

**Usage Pattern A - Static Pages:**

```tsx
// Before: 30 lines → After: 10 lines
export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
      title="Reports"
      description="View and analyze your Mailchimp reports"
      skeleton={<ReportsOverviewSkeleton />}
    >
      <ReportsPageContent searchParams={searchParams} />
    </PageLayout>
  );
}
```

**Usage Pattern B - Dynamic Pages:**

```tsx
// Before: 40 lines → After: 15 lines
export default async function CampaignOpensPage({ params, searchParams }) {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  // ... validation and data fetching ...

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Opens"
      description="Members who opened this campaign"
      skeleton={<CampaignOpensSkeleton />}
    >
      <CampaignOpensPageContent {...props} />
    </PageLayout>
  );
}

// Separate async component for breadcrumbs (already extracted in pages)
async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = reportOpensPageParamsSchema.parse(await params);
  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Opens"),
      ]}
    />
  );
}
```

**Impact:**

- Pattern A: 20-30 lines saved per page × 5 static pages = 100-150 lines
- Pattern B: 25-35 lines saved per page × 8 dynamic pages = 200-280 lines
- **Total: 300-430 lines saved across 13 pages**

**Implementation Notes:**

- Use `breadcrumbs` prop for simple pages without dynamic params
- Use `breadcrumbsSlot` prop for pages with `[id]` segments
- Never pass both props - choose one based on page type
- The `BreadcrumbContent` pattern is already established in dynamic pages

**Execution Plan:** [page-layout-component-execution-plan.md](execution-plans/page-layout-component-execution-plan.md)

**Completion Summary:**

- ✅ Created `PageLayout` component with full test coverage (7/7 tests passing)
- ✅ Updated 3 pages as proof of concept: Reports, Lists, Campaign Opens
- ✅ Reduced 74 lines of boilerplate across 3 pages
- ✅ Documentation added to CLAUDE.md
- ⏭️ Optional: Migrate remaining 10 pages incrementally

---

### 4. Unified Params Processing Pattern (Documentation Only)

**Priority:** Medium | **Effort:** 1h | **Type:** Documentation

**Problem:** Two similar utilities (`processRouteParams`, `validatePageParams`) confuse developers.

**Solution:** Create `src/utils/params/README.md` documenting:

- **When to use `validatePageParams()`** - List/table pages with pagination
- **When to use `processRouteParams()`** - Detail pages with route params
- **Usage examples** for each
- **Schema naming conventions**

**Key Decision Guide:**

- Has pagination? → `validatePageParams()`
- Has `[id]` route segment? → `processRouteParams()`

**Steps:** Write README → Update JSDoc comments → Add to CLAUDE.md

---

## Phase 2: Polish (6-7 hours)

### 5. Consistent Comment Headers

**Priority:** Medium | **Effort:** 2h

**Solution:** Standard JSDoc header template for all pages:

```tsx
/**
 * [Page Name]
 * [Brief description]
 *
 * @route /path/to/page
 * @requires Mailchimp connection
 * @features Pagination, Filtering, etc.
 */
```

Create VSCode snippet (`pageheader`) and document in CLAUDE.md.

---

### 6. Type Safety for Metadata Functions

**Priority:** Low | **Effort:** 2h

**Solution:** Create `src/types/components/page-metadata.ts` with type helpers:

```tsx
export type DynamicMetadataWithParams<TParams = { id: string }> = (props: {
  params: Promise<TParams>;
}) => Promise<Metadata> | Metadata;

export function createMetadataFunction<TParams>(
  fn: DynamicMetadataWithParams<TParams>,
): DynamicMetadataWithParams<TParams> {
  return fn;
}
```

**Usage:** `export const generateMetadata = createMetadataFunction<{ id: string }>(async ({ params }) => { ... });`

---

### 7. Create Metadata Helper Functions ✅ PARTIALLY COMPLETED

**Priority:** Medium | **Effort:** 4-5h | **Status:** 50% done

**Already Implemented:** `src/utils/mailchimp/metadata.ts`

- `generateCampaignMetadata()` - Generic campaign metadata
- `generateCampaignReportMetadata()` - Report detail pages
- `generateCampaignOpensMetadata()` - Opens pages

**Missing:**

- List page metadata helpers
- Abuse reports metadata (currently inline)
- Unified export from `@/utils/metadata`

**Usage Pattern:**

```tsx
// Before: 30+ lines inline
export async function generateMetadata({ params }) { ... }

// After: 3 lines
import { fetchCampaignMetadata, createCampaignOpensMetadata } from "@/utils/metadata";
export const generateMetadata = ({ params }) =>
  fetchCampaignMetadata(params.id, "Opens", createCampaignOpensMetadata);
```

---

## Phase 3: Scaling (8-10 hours)

### 8. Create Page Template/Generator

**Priority:** Low | **Effort:** 8-10h | **When:** Only after all patterns are stable

**Solution:** CLI tool `pnpm generate:page <route> --type=<list|detail|simple>`

Generates:

1. page.tsx with proper structure
2. Schema files for validation
3. Type files for props
4. Skeleton component
5. Component placeholder

**Only implement this after Phase 1 & 2 are complete and patterns are proven.**

---

## Implementation Strategy

### Roadmap

**Phase 1 (Week 1):**

- [x] Day 1: #1 Error Handling (1-2h) ✅
- [x] Day 2: #2 Breadcrumbs (2-3h) ✅
- [ ] Day 3: #3 Layout Pattern (3-4h) ⏭️ NEXT
- [ ] Day 4: #4 Params Docs (1h)

**Phase 2 (Week 2):**

- [ ] #5 Comment Headers (2h)
- [ ] #6 Type Safety (2h)
- [ ] #7 Metadata Helpers (4-5h)

**Phase 3 (Week 3+):**

- [ ] #8 Page Generator (8-10h) - Only when patterns are stable

### Migration Approach

For each improvement:

1. Create utility with tests
2. Update ONE page as proof of concept
3. Run tests (`pnpm test`, `pnpm type-check`)
4. Review diff - is it cleaner?
5. Update 2-3 more pages in same PR
6. Merge - no need to migrate all at once

**Key principle:** Incremental adoption. New and old patterns coexist.

### Fast Track (4-5 hours, 80% value)

1. ✅ #1 Error Handling (done)
2. ✅ #2 Breadcrumbs (done)
3. ⏭️ #3 Layout Pattern (next)

---

## Key Learnings from #1

1. **Check actual API behavior** - Don't assume patterns
2. **Support variations** - Multiple 404 message formats, status codes (404, 400)
3. **Test coverage critical** - Caught edge cases
4. **Centralized exports** - Export from `@/utils` for easy imports

**Apply to remaining improvements:**

- #2 (Breadcrumbs): Support both object and builder APIs
- #3 (Layout): Keep flexible for special cases
- #7 (Metadata): Handle inline vs extracted patterns

---

## Related Docs

- [CLAUDE.md](/CLAUDE.md) - Development guidelines
- [PRD.md](/docs/PRD.md) - Product requirements
- [Technical Guide](/docs/project-management/technical-guide.md)
