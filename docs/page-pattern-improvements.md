# Page Pattern Improvements

**Status:** Implementation in Progress (Phase 1: 50% Complete)
**Created:** 2025-10-15
**Last Updated:** 2025-10-17

## Quick Reference

✅ **Completed:** #1 Error Handling, #2 Breadcrumb Utility
⏭️ **Next:** #3 Layout Pattern (3-4h) → #4 Params Docs (1h)
📊 **Progress:** Phase 1 - 50% (2/4), Phase 2 - 0% (0/3), Phase 3 - 0% (0/1)

---

## Overview

This document outlines improvements to our page.tsx patterns to reduce duplication and improve maintainability across 13 pages. **Improvements are ordered by recommended implementation sequence.**

### Current Pattern

All pages follow a three-layer architecture:

1. **Layout Layer** - DashboardLayout + Suspense
2. **Data Fetching Layer** - Async content component with DAL calls
3. **Presentation Layer** - Pure UI components

Common elements: Breadcrumbs, page header, Suspense boundaries, MailchimpConnectionGuard, `dynamic = "force-dynamic"`, metadata.

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

### 3. Extract Common Layout Pattern

**Priority:** High | **Effort:** 3-4h | **Depends:** #2 (Breadcrumbs)

**Problem:** Every page repeats 30+ lines of layout boilerplate.

**Solution:** Create `src/components/layout/page-layout.tsx`

```tsx
export interface PageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  breadcrumbs,
  title,
  description,
  skeleton,
  children,
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BreadcrumbNavigation items={breadcrumbs} />
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Suspense fallback={skeleton}>{children}</Suspense>
      </div>
    </DashboardLayout>
  );
}
```

**Usage (with #2):**

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

**Impact:** Reduces 20-30 lines per page × 13 pages = 260-390 lines saved.

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
