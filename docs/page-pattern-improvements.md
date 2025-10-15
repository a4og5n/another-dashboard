# Page Pattern Improvements

**Status:** Planning Phase
**Created:** 2025-10-15
**Last Updated:** 2025-10-15

## Overview

This document outlines improvements to our established page.tsx patterns based on analysis of existing pages. These improvements aim to reduce code duplication, increase maintainability, and provide consistent patterns for future development.

**The improvements are ordered by recommended implementation sequence** for optimal dependency management and quickest value delivery.

## Current Pattern Analysis

Our pages consistently follow a three-layer architecture:

1. **Layout Layer** - Default export with DashboardLayout + Suspense
2. **Data Fetching Layer** - Async content component with DAL calls
3. **Presentation Layer** - Pure UI components

All pages include:

- Breadcrumb navigation
- Page header (title + description)
- Suspense boundaries with skeleton fallbacks
- MailchimpConnectionGuard for error handling
- `dynamic = "force-dynamic"` export
- Metadata exports (static or generated)

## Improvement Proposals

**Implementation Order:** Follow the numbering below for optimal dependency management and quickest value delivery.

---

### 1. Standardize Error Handling ⭐ START HERE

**Priority:** High (Critical)
**Effort:** Low (1-2 hours)
**Impact:** Consistent error handling across all pages (13 pages)
**Dependencies:** None

#### Problem

Every page repeats this 404 detection logic:

```tsx
if (!response.success) {
  const errorMessage = response.error || "Failed to load data";
  if (
    errorMessage.toLowerCase().includes("not found") ||
    errorMessage.toLowerCase().includes("404")
  ) {
    notFound();
  }
}
```

#### Solution

Create utility functions for error handling:

**File:** `src/utils/errors/api-error-handler.ts`

```tsx
import { notFound } from "next/navigation";
import type { ApiResponse } from "@/types/api";

/**
 * Check if an error message indicates a 404/not found error
 */
export function is404Error(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("404") ||
    normalizedMessage.includes("does not exist")
  );
}

/**
 * Handle API response errors with automatic 404 detection
 * Calls Next.js notFound() for 404 errors
 *
 * @param response - API response from DAL
 * @throws Calls notFound() for 404 errors (doesn't technically throw)
 * @returns error message if not a 404
 */
export function handleApiError(response: ApiResponse<unknown>): string | null {
  if (!response.success) {
    const errorMessage = response.error || "Failed to load data";
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}

/**
 * Handle API errors with custom fallback message
 */
export function handleApiErrorWithFallback(
  response: ApiResponse<unknown>,
  fallbackMessage: string,
): string | null {
  if (!response.success) {
    const errorMessage = response.error || fallbackMessage;
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}
```

#### Usage Example

**Before:**

```tsx
const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

if (!response.success) {
  const errorMessage = response.error || "Failed to load campaign report";
  if (
    errorMessage.toLowerCase().includes("not found") ||
    errorMessage.toLowerCase().includes("404")
  ) {
    notFound();
  }
}
```

**After:**

```tsx
const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);
handleApiError(response);
```

#### Implementation Steps

1. Create `src/utils/errors/api-error-handler.ts`
2. Export from `src/utils/errors/index.ts`
3. Export from `src/utils/index.ts`
4. Add unit tests for error detection logic
5. Update pages incrementally

#### Testing Strategy

- Unit tests for `is404Error()` with various error messages
- Unit tests for `handleApiError()` behavior
- Integration tests to ensure `notFound()` is called correctly

---

### 2. Unified Params Processing Pattern (Documentation Only)

**Priority:** High (Foundational)
**Effort:** Low (1 hour)
**Impact:** Clearer documentation and utility usage
**Dependencies:** None

#### Problem

We have two similar utilities with different purposes:

- `processRouteParams()` - Used for detail pages
- `validatePageParams()` - Used for list pages with pagination

This can be confusing for developers adding new pages.

#### Solution

Create comprehensive documentation and consider merging utilities:

**File:** `src/utils/params/README.md`

````markdown
# Params Processing Utilities

This directory contains utilities for processing and validating URL parameters (both route params and search params).

## When to Use Which Utility

### `validatePageParams()` - For List/Table Pages with Pagination

Use when:

- Page has pagination (page, pageSize query params)
- Search params need validation and transformation
- URL cleanup/redirect needed for invalid params
- No dynamic route segments needed

**Examples:** `/mailchimp/lists`, `/mailchimp/reports`, `/mailchimp/reports/[id]/opens`

**Usage:**

```tsx
const { apiParams, currentPage, pageSize } = await validatePageParams({
  searchParams,
  uiSchema: listsPageSearchParamsSchema, // Validates UI params (page, pageSize)
  apiSchema: listsParamsSchema, // Validates API params (count, offset)
  basePath: "/mailchimp/lists",
  transformer: transformToApiParams, // Optional: Custom transformer
});
```
````

### `processRouteParams()` - For Detail Pages with Route Params

Use when:

- Page has dynamic route segments (e.g., `[id]`)
- Need to validate both route params and search params
- Params are used for data fetching, not pagination

**Examples:** `/mailchimp/lists/[id]`, `/mailchimp/reports/[id]`

**Usage:**

```tsx
const { validatedParams, validatedSearchParams } = await processRouteParams({
  params,
  searchParams,
  paramsSchema: listPageParamsSchema, // Validates route params ({ id: string })
  searchParamsSchema: listPageSearchParamsSchema, // Validates search params ({ tab: string })
});
```

## Creating a New Page

### Pagination Page Checklist

1. Create UI search params schema (`[page]PageSearchParamsSchema`)
2. Create or reuse API params schema (e.g., `listsParamsSchema`)
3. Create transformer if needed (UI → API params)
4. Use `validatePageParams()` in page content component
5. Pass `currentPage` and `pageSize` to UI component

### Detail Page Checklist

1. Create route params schema (`[page]PageParamsSchema`)
2. Create search params schema if needed
3. Use `processRouteParams()` in page content component
4. Extract validated params for data fetching

## Schema Naming Conventions

- Route params: `[page]PageParamsSchema` (e.g., `listPageParamsSchema`)
- Search params: `[page]PageSearchParamsSchema` (e.g., `listsPageSearchParamsSchema`)
- API params: `[resource]ParamsSchema` (e.g., `listsParamsSchema`)

All schemas should be defined in `src/schemas/components/` or `src/schemas/mailchimp/`.

````

#### Implementation Steps
1. Create `src/utils/params/README.md` documentation
2. Add examples to existing utility JSDoc comments
3. Update CLAUDE.md with params processing guidelines

#### Testing Strategy
- Documentation review for clarity
- Developer feedback on utility usage
- No code changes needed

---

### 3. Breadcrumb Generation Utility

**Priority:** High
**Effort:** Low (2-3 hours)
**Impact:** Cleaner breadcrumb definitions, reduced typos
**Dependencies:** None (but works great with #4)

#### Problem
Breadcrumb arrays are manually created in every page:
```tsx
<BreadcrumbNavigation
  items={[
    { label: "Dashboard", href: "/" },
    { label: "Mailchimp", href: "/mailchimp" },
    { label: "Reports", href: "/mailchimp/reports" },
    { label: "Report", href: `/mailchimp/reports/${id}` },
    { label: "Opens", isCurrent: true },
  ]}
/>
````

This leads to:

- Typos in labels or URLs
- Inconsistent labeling
- Repeated code

#### Solution

Create a breadcrumb builder utility:

**File:** `src/utils/breadcrumbs/breadcrumb-builder.ts`

````tsx
import type { BreadcrumbItem } from "@/types/components/ui";

/**
 * Breadcrumb builder utility for consistent breadcrumb generation
 *
 * @example
 * ```tsx
 * const breadcrumbs = [
 *   bc.home,
 *   bc.mailchimp,
 *   bc.reports,
 *   bc.report(campaignId),
 *   bc.current("Opens"),
 * ];
 * ```
 */
export const bc = {
  // Root navigation
  home: { label: "Dashboard", href: "/" } as BreadcrumbItem,

  // Mailchimp navigation
  mailchimp: { label: "Mailchimp", href: "/mailchimp" } as BreadcrumbItem,
  reports: { label: "Reports", href: "/mailchimp/reports" } as BreadcrumbItem,
  lists: { label: "Lists", href: "/mailchimp/lists" } as BreadcrumbItem,
  generalInfo: {
    label: "General Info",
    href: "/mailchimp/general-info",
  } as BreadcrumbItem,

  // Settings navigation
  settings: { label: "Settings", href: "/settings" } as BreadcrumbItem,
  integrations: {
    label: "Integrations",
    href: "/settings/integrations",
  } as BreadcrumbItem,

  // Dynamic items
  report: (id: string): BreadcrumbItem => ({
    label: "Report",
    href: `/mailchimp/reports/${id}`,
  }),

  list: (id: string): BreadcrumbItem => ({
    label: "List",
    href: `/mailchimp/lists/${id}`,
  }),

  // Current page (no href)
  current: (label: string): BreadcrumbItem => ({
    label,
    isCurrent: true,
  }),

  // Helper to build custom item
  custom: (label: string, href: string): BreadcrumbItem => ({
    label,
    href,
  }),
};

/**
 * Type-safe breadcrumb builder (alternative API)
 */
export class BreadcrumbBuilder {
  private items: BreadcrumbItem[] = [];

  home() {
    this.items.push(bc.home);
    return this;
  }

  mailchimp() {
    this.items.push(bc.mailchimp);
    return this;
  }

  reports() {
    this.items.push(bc.reports);
    return this;
  }

  lists() {
    this.items.push(bc.lists);
    return this;
  }

  report(id: string) {
    this.items.push(bc.report(id));
    return this;
  }

  list(id: string) {
    this.items.push(bc.list(id));
    return this;
  }

  current(label: string) {
    this.items.push(bc.current(label));
    return this;
  }

  custom(label: string, href: string) {
    this.items.push(bc.custom(label, href));
    return this;
  }

  build(): BreadcrumbItem[] {
    return this.items;
  }
}

/**
 * Create a new breadcrumb builder instance
 */
export function breadcrumbs() {
  return new BreadcrumbBuilder();
}
````

#### Usage Example

**Before:**

```tsx
<BreadcrumbNavigation
  items={[
    { label: "Dashboard", href: "/" },
    { label: "Mailchimp", href: "/mailchimp" },
    { label: "Reports", href: "/mailchimp/reports" },
    { label: "Report", href: `/mailchimp/reports/${id}` },
    { label: "Opens", isCurrent: true },
  ]}
/>
```

**After (Object API):**

```tsx
import { bc } from "@/utils/breadcrumbs";

<BreadcrumbNavigation
  items={[
    bc.home,
    bc.mailchimp,
    bc.reports,
    bc.report(id),
    bc.current("Opens"),
  ]}
/>;
```

**After (Builder API):**

```tsx
import { breadcrumbs } from "@/utils/breadcrumbs";

<BreadcrumbNavigation
  items={breadcrumbs()
    .home()
    .mailchimp()
    .reports()
    .report(id)
    .current("Opens")
    .build()}
/>;
```

#### Implementation Steps

1. Create `src/utils/breadcrumbs/breadcrumb-builder.ts`
2. Export from `src/utils/breadcrumbs/index.ts`
3. Export from `src/utils/index.ts`
4. Update one page as proof of concept
5. Update remaining pages incrementally

#### Testing Strategy

- Unit tests for breadcrumb builder functions
- Visual regression testing for breadcrumb display
- Ensure all URLs are correct

---

### 4. Extract Common Layout Pattern

**Priority:** High
**Effort:** Medium (3-4 hours)
**Impact:** Reduces ~30 lines of boilerplate per page
**Dependencies:** Works best after #3 (Breadcrumb utility)

#### Problem

Every page repeats this structure:

```tsx
<DashboardLayout>
  <div className="space-y-6">
    <BreadcrumbNavigation items={...} />
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Suspense fallback={<Skeleton />}>
      {children}
    </Suspense>
  </div>
</DashboardLayout>
```

#### Solution

Create a reusable `PageLayout` component:

**File:** `src/components/layout/page-layout.tsx`

````tsx
import { Suspense } from "react";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { DashboardLayout } from "./dashboard-layout";
import type { BreadcrumbItem } from "@/types/components/ui";

export interface PageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  children: React.ReactNode;
  skeleton: React.ReactNode;
}

/**
 * PageLayout
 *
 * Standard layout wrapper for all dashboard pages
 * Includes breadcrumbs, page header, and suspense boundary
 *
 * @example
 * ```tsx
 * <PageLayout
 *   breadcrumbs={[...]}
 *   title="Reports"
 *   description="View your reports"
 *   skeleton={<ReportsSkeleton />}
 * >
 *   <ReportsContent />
 * </PageLayout>
 * ```
 */
export function PageLayout({
  breadcrumbs,
  title,
  description,
  children,
  skeleton,
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation items={breadcrumbs} />

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
````

#### Usage Example

**Before:**

```tsx
export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Reports", isCurrent: true },
          ]}
        />
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your Mailchimp reports
          </p>
        </div>
        <Suspense fallback={<ReportsOverviewSkeleton />}>
          <ReportsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
```

**After (with breadcrumb utility from #3):**

```tsx
import { bc } from "@/utils/breadcrumbs";
import { PageLayout } from "@/components/layout";

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

#### Implementation Steps

1. Create `src/components/layout/page-layout.tsx`
2. Export from `src/components/layout/index.ts`
3. Update one page as proof of concept
4. Run tests to ensure no breaking changes
5. Update remaining pages (can be done incrementally)

#### Testing Strategy

- Visual regression testing for layout consistency
- Accessibility testing for heading hierarchy
- Ensure Suspense boundaries work correctly

---

### 5. Consistent Comment Headers

**Priority:** Medium
**Effort:** Low (2 hours)
**Impact:** Better code documentation and discoverability
**Dependencies:** None (but better after patterns are stable)

#### Problem

Page files have inconsistent documentation:

- Some have detailed JSDoc headers
- Some have minimal comments
- No standard format for route, features, requirements

#### Solution

Create standard page header template:

**Template:**

```tsx
/**
 * [Page Name]
 *
 * [Brief description of what this page displays/does]
 *
 * @route /path/to/page
 * @requires Mailchimp connection
 * @features Pagination, Sorting, Filtering (comma-separated list)
 *
 * @see Related documentation links
 * @see Issue #123 - Initial implementation
 * @see docs/implementation-plans/page-name-plan.md
 */
```

**Example:**

```tsx
/**
 * Campaign Abuse Reports Page
 *
 * Server component that displays abuse/spam complaints for a specific campaign.
 * Shows a paginated table of recipients who marked the campaign as spam.
 *
 * @route /mailchimp/reports/[id]/abuse-reports
 * @requires Mailchimp connection
 * @features Real-time data, Error handling, Empty states
 *
 * @see docs/api/mailchimp-reports-api.md - API documentation
 * @see Issue #147 - Abuse reports implementation
 */

import { Suspense } from "react";
// ... rest of imports
```

#### Implementation Steps

1. Document the standard in CLAUDE.md
2. Create VSCode snippet for page headers
3. Update existing pages incrementally
4. Add to code review checklist

#### VSCode Snippet

**File:** `.vscode/page-header.code-snippets`

```json
{
  "Next.js Page Header": {
    "scope": "typescriptreact",
    "prefix": "pageheader",
    "body": [
      "/**",
      " * ${1:Page Name}",
      " * ",
      " * ${2:Brief description of what this page displays/does}",
      " * ",
      " * @route ${3:/path/to/page}",
      " * @requires ${4:Mailchimp connection}",
      " * @features ${5:Feature list}",
      " * ",
      " * @see ${6:Related documentation}",
      " */"
    ],
    "description": "Standard page header documentation"
  }
}
```

---

### 6. Type Safety for Metadata Functions

**Priority:** Low
**Effort:** Low (2 hours)
**Impact:** Better TypeScript inference and error detection
**Dependencies:** None

#### Problem

Metadata functions have inconsistent type signatures:

```tsx
// Some pages use this
export const metadata = { ... };

// Some pages use this
export const generateMetadata = someFunction;

// Some pages use inline async function
export async function generateMetadata({ params }) { ... }
```

#### Solution

Create type-safe metadata utilities:

**File:** `src/types/components/page-metadata.ts`

```tsx
import type { Metadata } from "next";

/**
 * Static metadata (no params needed)
 */
export type StaticMetadata = Metadata;

/**
 * Dynamic metadata with route params
 */
export type DynamicMetadataWithParams<TParams = { id: string }> = (props: {
  params: Promise<TParams>;
}) => Promise<Metadata> | Metadata;

/**
 * Dynamic metadata with route params and search params
 */
export type DynamicMetadataWithParamsAndSearch<
  TParams = { id: string },
  TSearchParams = Record<string, string | string[] | undefined>,
> = (props: {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}) => Promise<Metadata> | Metadata;

/**
 * Helper to create strongly-typed metadata function
 */
export function createMetadataFunction<TParams = { id: string }>(
  fn: DynamicMetadataWithParams<TParams>,
): DynamicMetadataWithParams<TParams> {
  return fn;
}

/**
 * Helper to create strongly-typed metadata function with search params
 */
export function createMetadataFunctionWithSearch<
  TParams = { id: string },
  TSearchParams = Record<string, string | string[] | undefined>,
>(
  fn: DynamicMetadataWithParamsAndSearch<TParams, TSearchParams>,
): DynamicMetadataWithParamsAndSearch<TParams, TSearchParams> {
  return fn;
}
```

#### Usage Example

**Before:**

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ...
}
```

**After:**

```tsx
import { createMetadataFunction } from "@/types/components/page-metadata";

export const generateMetadata = createMetadataFunction<{ id: string }>(
  async ({ params }) => {
    // TypeScript knows params is Promise<{ id: string }>
    // ...
  },
);
```

#### Implementation Steps

1. Create `src/types/components/page-metadata.ts`
2. Export from `src/types/components/index.ts`
3. Update pages incrementally (optional, no breaking changes)
4. Add JSDoc examples to type definitions

#### Testing Strategy

- TypeScript compilation tests
- Ensure type inference works correctly
- No runtime changes needed

---

### 7. Create Metadata Helper Functions

**Priority:** Medium
**Effort:** Medium (4-5 hours)
**Impact:** Reduces metadata duplication, improves SEO consistency
**Dependencies:** Optional: #6 (Type Safety)

#### Problem

Metadata generation is repeated across pages with similar patterns:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = schema.parse(rawParams);
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Title - Not Found",
      description: "Description not found.",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Subtitle`,
    description: `Description...`,
    openGraph: {
      title: `${report.campaign_title} - Subtitle`,
      description: `Description...`,
      type: "website",
    },
  };
}
```

#### Solution

Create metadata builder utilities:

**File:** `src/utils/metadata/campaign-metadata.ts`

```tsx
import type { Metadata } from "next";
import type { CampaignReport } from "@/types/mailchimp";

/**
 * Create metadata for a campaign-related page
 */
export function createCampaignMetadata(
  report: CampaignReport,
  subtitle: string,
  description: string,
  ogDescription?: string,
): Metadata {
  return {
    title: `${report.campaign_title} - ${subtitle}`,
    description,
    openGraph: {
      title: `${report.campaign_title} - ${subtitle}`,
      description: ogDescription || description,
      type: "website",
    },
  };
}

/**
 * Create fallback metadata when campaign is not found
 */
export function createCampaignNotFoundMetadata(subtitle: string): Metadata {
  return {
    title: `${subtitle} - Campaign Not Found`,
    description: "The requested campaign could not be found.",
  };
}

/**
 * Create metadata for campaign opens page
 */
export function createCampaignOpensMetadata(report: CampaignReport): Metadata {
  const totalOpens = report.opens.opens_total.toLocaleString();
  const emailsSent = report.emails_sent.toLocaleString();

  return createCampaignMetadata(
    report,
    "Opens",
    `View all members who opened ${report.campaign_title}. Total opens: ${totalOpens}`,
    `${totalOpens} total opens from ${emailsSent} recipients`,
  );
}

/**
 * Create metadata for campaign abuse reports page
 */
export function createCampaignAbuseReportsMetadata(
  report: CampaignReport,
): Metadata {
  const abuseReportCount = report.abuse_reports || 0;
  const emailsSent = report.emails_sent.toLocaleString();

  const description =
    abuseReportCount === 0
      ? "No abuse reports recorded."
      : `${abuseReportCount.toLocaleString()} ${abuseReportCount === 1 ? "report" : "reports"} received.`;

  const ogDescription =
    abuseReportCount === 0
      ? `No abuse reports - Campaign sent to ${emailsSent} recipients`
      : `${abuseReportCount.toLocaleString()} abuse ${abuseReportCount === 1 ? "report" : "reports"} from ${emailsSent} recipients`;

  return createCampaignMetadata(
    report,
    "Abuse Reports",
    `View abuse reports and spam complaints for ${report.campaign_title}. ${description}`,
    ogDescription,
  );
}
```

**File:** `src/utils/metadata/fetch-campaign-metadata.ts`

```tsx
import type { Metadata } from "next";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import type { CampaignReport } from "@/types/mailchimp";
import { createCampaignNotFoundMetadata } from "./campaign-metadata";

// Type for metadata builder functions
export type CampaignMetadataBuilder = (report: CampaignReport) => Metadata;

/**
 * Fetch campaign and generate metadata with custom builder
 */
export async function fetchCampaignMetadata(
  campaignId: string,
  subtitle: string,
  builder: CampaignMetadataBuilder,
): Promise<Metadata> {
  const response = await mailchimpDAL.fetchCampaignReport(campaignId);

  if (!response.success || !response.data) {
    return createCampaignNotFoundMetadata(subtitle);
  }

  return builder(response.data as CampaignReport);
}
```

#### Usage Example

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

  if (!response.success || !response.data) {
    return {
      title: "Campaign Opens - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Opens`,
    description: `View all members who opened ${report.campaign_title}...`,
    openGraph: {
      /* ... */
    },
  };
}
```

**After:**

```tsx
import {
  fetchCampaignMetadata,
  createCampaignOpensMetadata,
} from "@/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  return fetchCampaignMetadata(id, "Opens", createCampaignOpensMetadata);
}
```

#### Implementation Steps

1. Create `src/utils/metadata/campaign-metadata.ts`
2. Create `src/utils/metadata/fetch-campaign-metadata.ts`
3. Create `src/utils/metadata/index.ts` for exports
4. Add similar utilities for List-based pages
5. Update pages incrementally
6. Add unit tests for metadata builders

#### Testing Strategy

- Unit tests for metadata builder functions
- Snapshot tests for generated metadata
- SEO validation (title length, description length, OpenGraph tags)

---

### 8. Create Page Template/Generator

**Priority:** Low (Long-term investment)
**Effort:** High (8-10 hours)
**Impact:** Consistent page creation, reduced setup time
**Dependencies:** Requires ALL previous improvements to be stable

#### Problem

Creating a new page requires:

1. Creating the page.tsx file
2. Setting up the three-layer architecture
3. Creating schemas for params validation
4. Creating types for props
5. Adding breadcrumbs, metadata, etc.
6. Creating skeleton component
7. Creating main component

This is repetitive and error-prone.

#### Solution

Create a CLI tool to scaffold new pages:

**File:** `scripts/generate-page.ts`

```typescript
#!/usr/bin/env node
/**
 * Page Generator CLI
 *
 * Scaffolds a new Next.js page following our established patterns
 *
 * Usage:
 *   pnpm generate:page mailchimp/campaigns/[id]/clicks --type=detail
 *   pnpm generate:page mailchimp/segments --type=list
 */

import { parseArgs } from "node:util";
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

// Command-line argument parsing
const {
  values: { type, help },
  positionals,
} = parseArgs({
  args: process.argv.slice(2),
  options: {
    type: {
      type: "string",
      short: "t",
      default: "list",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  allowPositionals: true,
});

if (help || positionals.length === 0) {
  console.log(`
Page Generator CLI

Usage:
  pnpm generate:page <route> [options]

Arguments:
  route         The route path (e.g., mailchimp/campaigns/[id]/clicks)

Options:
  -t, --type    Page type: list, detail, or simple (default: list)
  -h, --help    Show this help message

Examples:
  pnpm generate:page mailchimp/segments --type=list
  pnpm generate:page mailchimp/campaigns/[id]/clicks --type=detail
  pnpm generate:page mailchimp/settings --type=simple
  `);
  process.exit(0);
}

const route = positionals[0];
const pageType = type as "list" | "detail" | "simple";

// Templates would go here...
// See implementation details in the actual script

async function generatePage(route: string, type: string) {
  console.log(`Generating ${type} page for route: ${route}`);

  // 1. Parse route to extract page name, params, etc.
  // 2. Generate page.tsx file
  // 3. Generate schema files
  // 4. Generate type files
  // 5. Generate skeleton component
  // 6. Generate main component (optional)
  // 7. Update index.ts files

  console.log("✓ Page generated successfully!");
  console.log(`  Page: src/app/${route}/page.tsx`);
  console.log(`  Next steps:`);
  console.log(`  1. Implement the main component`);
  console.log(`  2. Add metadata generation if needed`);
  console.log(`  3. Run tests: pnpm test`);
}

generatePage(route, pageType);
```

**Add to package.json:**

```json
{
  "scripts": {
    "generate:page": "tsx scripts/generate-page.ts"
  }
}
```

#### Templates

The generator should create:

1. **Page file** with proper structure
2. **Schema files** for params/searchParams validation
3. **Type files** for component props
4. **Skeleton component** matching the layout
5. **Component placeholder** (optional)

#### Implementation Steps

1. Create `scripts/generate-page.ts`
2. Create template files for each page type
3. Add npm script to package.json
4. Test with sample page generation
5. Document usage in CLAUDE.md and README

#### Testing Strategy

- Generate test pages and verify structure
- Run type-checking on generated code
- Verify generated pages follow patterns
- Add to CI to ensure generator stays up-to-date

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1 - 6-8 hours total)

**Goal:** Establish core utilities that provide immediate value

- [ ] **Day 1:** #1 Standardize Error Handling (1-2h) ✅ Zero dependencies, immediate impact
- [ ] **Day 2:** #2 Unified Params Processing Pattern (1h) ✅ Documentation only, zero risk
- [ ] **Day 3:** #3 Breadcrumb Generation Utility (2-3h) ✅ Clean up navigation
- [ ] **Day 4:** #4 Extract Common Layout Pattern (3-4h) ✅ Major boilerplate reduction

**Outcome:** All pages are significantly cleaner and more maintainable

### Phase 2: Polish (Week 2 - 6-7 hours total)

**Goal:** Improve documentation and type safety

- [ ] **Day 1:** #5 Consistent Comment Headers (2h) ✅ Documentation consistency
- [ ] **Day 2:** #6 Type Safety for Metadata Functions (2h) ✅ Better type checking
- [ ] **Day 3:** #7 Create Metadata Helper Functions (4-5h) ✅ SEO consistency

**Outcome:** Professional, well-documented codebase with consistent SEO

### Phase 3: Scaling (Week 3+ - 8-10 hours)

**Goal:** Accelerate future development

- [ ] #8 Create Page Template/Generator ✅ Only when patterns are completely stable

**Outcome:** 50% faster page creation, perfect consistency

---

## Fast Track Strategy

If you want the **fastest impact with minimal effort** (4-5 hours, 80% of the value):

1. **#1 Error Handling** (1-2h) ✓ Most pages benefit immediately
2. **#3 Breadcrumb Utility** (2-3h) ✓ Every page navigation cleaner
3. **Update 2-3 example pages** to demonstrate the pattern

**Why this works:** You get immediate cleanup in the most repetitive areas, and other developers can follow the pattern in new pages.

---

## Migration Strategy

For each improvement, follow this pattern:

1. **Create the utility** (in isolation, with tests)
2. **Update ONE page** (e.g., `/mailchimp/reports/page.tsx`)
3. **Run tests** (`pnpm test`, `pnpm type-check`)
4. **Review the diff** - Does it look cleaner?
5. **Update 2-3 more pages** in the same PR
6. **Merge and move on** - No need to update all pages at once

**Key principle:** Incremental adoption. New utilities coexist with old patterns until you're ready to migrate.

---

## Success Metrics

- Reduced lines of boilerplate per page (target: 30% reduction)
- Faster page creation time (target: 50% reduction with generator)
- Fewer bugs from copy-paste errors
- Improved developer onboarding experience
- Consistent code style across all pages

---

## ROI Analysis

| Improvement           | Effort | Impact | ROI          | Priority |
| --------------------- | ------ | ------ | ------------ | -------- |
| #1 Error Handling     | 1-2h   | High   | 🔥 Excellent | 1st      |
| #2 Params Docs        | 1h     | Medium | 🔥 Excellent | 2nd      |
| #3 Breadcrumb Utility | 2-3h   | High   | 🔥 Excellent | 3rd      |
| #4 Layout Pattern     | 3-4h   | High   | 🔥 Excellent | 4th      |
| #5 Comment Headers    | 2h     | Medium | ✅ Good      | 5th      |
| #6 Type Safety        | 2h     | Low    | ⚡ Optional  | 6th      |
| #7 Metadata Helpers   | 4-5h   | Medium | ⚡ Optional  | 7th      |
| #8 Page Generator     | 8-10h  | High\* | 💎 Long-term | 8th      |

\*High impact only when creating many new pages

---

## Related Documentation

- [CLAUDE.md](/CLAUDE.md) - Development guidelines
- [PRD.md](/docs/PRD.md) - Product requirements
- [Technical Guide](/docs/project-management/technical-guide.md) - Technical architecture

---

## Next Steps

1. Review this document with the team
2. Begin with **#1 (Standardize Error Handling)** - takes 1-2 hours, zero risk, immediate value
3. Follow the implementation roadmap in order
4. Update CLAUDE.md after each improvement is completed
5. Track progress by checking off items in the roadmap above
