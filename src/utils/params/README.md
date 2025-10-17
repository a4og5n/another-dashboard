# URL Parameter Processing Utilities

This directory contains documentation for two parameter processing utilities used across the Next.js App Router pages in this project.

## Overview

This project provides two distinct utilities for handling URL parameters in Next.js 15 App Router pages:

1. **`validatePageParams()`** - For list/table pages with pagination (`?page=N&perPage=M`)
2. **`processRouteParams()`** - For dynamic routes with route parameters (`/lists/[id]`)

**Why both exist:** They serve fundamentally different purposes. `validatePageParams()` handles optional search parameters for paginated lists and includes redirect logic to clean URLs. `processRouteParams()` validates required route segments and triggers 404 errors for invalid IDs.

## Quick Decision Guide

**Which utility should I use?**

```
Does your page have pagination? (e.g., ?page=2&perPage=10)
├─ YES → Use validatePageParams()
│         Location: src/utils/mailchimp/page-params.ts
│         Examples: /mailchimp/reports, /mailchimp/lists
│
└─ NO → Does your page have dynamic route segments? (e.g., /lists/[id])
    ├─ YES → Use processRouteParams()
    │         Location: src/utils/mailchimp/route-params.ts
    │         Examples: /mailchimp/reports/[id], /mailchimp/lists/[id]
    │
    └─ NO → No utility needed
              Use standard Next.js page patterns
```

## validatePageParams()

**Location:** [src/utils/mailchimp/page-params.ts](../../utils/mailchimp/page-params.ts)

**Purpose:** Handle list/table pages with pagination and search parameters

**When to use:**

- Pages with `?page=N&perPage=M` query parameters in the URL
- List pages that display paginated data (reports, lists, campaigns)
- Pages where you want to clean default values from URLs (e.g., redirect `/lists?page=1` to `/lists`)

**Features:**

- Validates URL search parameters using Zod schemas
- Automatically redirects to clean URLs (removes default page/perPage values)
- Transforms UI parameters (`page`, `perPage`) to API parameters (`count`, `offset`)
- Returns both API-ready params and UI display values

**Schema Naming Conventions:**

- **Page search params:** `*PageSearchParamsSchema` (e.g., `reportsPageSearchParamsSchema`)
  - Validates UI parameters from URL query string
  - Always includes `page?: string` and `perPage?: string`
- **API params:** `*ParamsSchema` (e.g., `reportListParamsSchema`)
  - Validates transformed parameters for API calls
  - Uses API naming conventions (`count`, `offset`, etc.)

**Real Example from Reports Page:**

```typescript
// src/app/mailchimp/reports/page.tsx
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { reportsPageSearchParamsSchema } from "@/schemas/components";
import { reportListParamsSchema } from "@/schemas/mailchimp";
import { transformCampaignReportsParams } from "@/utils/mailchimp/query-params";

async function ReportsPageContent({ searchParams }: ReportsPageProps) {
  // Validate page parameters: validate, redirect if needed, convert to API format
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: reportsPageSearchParamsSchema,
    apiSchema: reportListParamsSchema,
    basePath: "/mailchimp/reports",
    transformer: transformCampaignReportsParams,
  });

  // Fetch reports using transformed API params
  const response = await mailchimpDAL.fetchCampaignReports(apiParams);

  return (
    <ReportsOverview
      data={response.data}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}
```

**What This Does:**

1. **Validates** URL params like `?page=2&perPage=20&type=regular`
2. **Redirects** if default values are present (e.g., `?page=1` → clean URL)
3. **Transforms** UI params (`page: "2"`, `perPage: "20"`) to API params (`count: 20`, `offset: 20`)
4. **Returns** ready-to-use values for both API calls and UI display

**Schema Example:**

```typescript
// src/schemas/components/mailchimp/reports-page-params.ts
export const reportsPageSearchParamsSchema = z
  .object({
    page: z.string().optional(),
    perPage: z.string().optional(),
    type: z.string().optional(),
    before_send_time: z.string().optional(),
    since_send_time: z.string().optional(),
  })
  .strict();

// src/schemas/mailchimp/report-list-params.schema.ts
export const reportListParamsSchema = z
  .object({
    count: z.number().optional(),
    offset: z.number().optional(),
    type: z.string().optional(),
    before_send_time: z.string().optional(),
    since_send_time: z.string().optional(),
  })
  .strict();
```

**Return Type:**

```typescript
interface ValidatedPageParams<T, U> {
  apiParams: U; // Transformed params for API (e.g., { count: 20, offset: 20 })
  uiParams: T; // Validated UI params (e.g., { page: "2", perPage: "20" })
  currentPage: number; // Extracted page number for display (e.g., 2)
  pageSize: number; // Extracted page size for display (e.g., 20)
}
```

## processRouteParams()

**Location:** [src/utils/mailchimp/route-params.ts](../../utils/mailchimp/route-params.ts)

**Purpose:** Validate route parameters in dynamic routes and trigger 404 for invalid IDs

**When to use:**

- Pages with dynamic route segments like `[id]` or `[slug]`
- Detail pages that display a single resource (campaign report, list details)
- Pages where invalid IDs should return a 404 error

**Features:**

- Validates route parameters (e.g., `id` from `/reports/[id]`)
- Validates search parameters (e.g., `tab` from `?tab=overview`)
- Automatically triggers `notFound()` for invalid parameters (proper 404 status)
- Returns validated data with full type safety

**Schema Naming Conventions:**

- **Route params:** `*PageParamsSchema` (e.g., `reportPageParamsSchema`)
  - Validates dynamic route segments like `[id]`
  - Always requires the route parameter (e.g., `id: z.string().min(1)`)
- **Search params:** `*PageSearchParamsSchema` (e.g., `reportPageSearchParamsSchema`)
  - Validates optional query parameters like `?tab=overview`
  - Often includes defaults (e.g., `tab: z.enum(TABS).default("overview")`)

**Real Example from Campaign Report Page:**

```typescript
// src/app/mailchimp/reports/[id]/page.tsx
import { processRouteParams } from "@/utils/mailchimp/route-params";
import {
  reportPageParamsSchema,
  reportPageSearchParamsSchema
} from "@/schemas/components";

export default async function CampaignReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  // Validate route params and search params (triggers 404 for invalid ID)
  const { validatedParams, validatedSearchParams } = await processRouteParams({
    params,
    searchParams,
    paramsSchema: reportPageParamsSchema,
    searchParamsSchema: reportPageSearchParamsSchema,
  });

  // Use validated ID to fetch data
  const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

  return (
    <CampaignReportDetail
      report={response.data}
      activeTab={validatedSearchParams.tab}
    />
  );
}
```

**What This Does:**

1. **Validates** the `id` from `/reports/abc123` route segment
2. **Validates** the `tab` from `?tab=overview` query parameter
3. **Triggers 404** via `notFound()` if either validation fails
4. **Returns** type-safe validated data for use in the page

**Schema Example:**

```typescript
// src/schemas/components/mailchimp/report-page-params.ts
export const reportPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

export const reportPageSearchParamsSchema = z.object({
  tab: z.enum(["overview", "details"]).default("overview"),
});
```

**Return Type:**

```typescript
{
  validatedParams: T; // Validated route params (e.g., { id: "abc123" })
  validatedSearchParams: U; // Validated search params (e.g., { tab: "overview" })
}
```

## Schema Naming Conventions

Consistent schema naming helps identify purpose and usage at a glance:

| Schema Type            | Pattern                   | Example                       | Purpose                                                               |
| ---------------------- | ------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| **Page Search Params** | `*PageSearchParamsSchema` | `listsPageSearchParamsSchema` | Validates URL query parameters (e.g., `?page=2&perPage=10`)           |
| **Route Params**       | `*PageParamsSchema`       | `reportPageParamsSchema`      | Validates dynamic route segments (e.g., `[id]` in `/reports/[id]`)    |
| **API Params**         | `*ParamsSchema`           | `listsParamsSchema`           | Validates parameters for API calls (e.g., `{ count: 10, offset: 0 }`) |

**Examples from the Codebase:**

```typescript
// Page search params - for validatePageParams()
reportsPageSearchParamsSchema; // /mailchimp/reports?page=2&perPage=20
listsPageSearchParamsSchema; // /mailchimp/lists?page=1&perPage=10

// Route params - for processRouteParams()
reportPageParamsSchema; // /mailchimp/reports/[id]
listPageParamsSchema; // /mailchimp/lists/[id]

// API params - for DAL/service calls
reportListParamsSchema; // mailchimpDAL.fetchCampaignReports(params)
listsParamsSchema; // mailchimpDAL.fetchLists(params)
```

## Common Patterns

### Pattern 1: Paginated List Page

**Use Case:** Display a paginated list of items (reports, lists, campaigns)

**File:** [src/app/mailchimp/reports/page.tsx](../../../app/mailchimp/reports/page.tsx)

```typescript
import { validatePageParams } from "@/utils/mailchimp/page-params";

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: reportsPageSearchParamsSchema,
    apiSchema: reportListParamsSchema,
    basePath: "/mailchimp/reports",
    transformer: transformCampaignReportsParams,
  });

  const response = await mailchimpDAL.fetchCampaignReports(apiParams);

  return <ReportsOverview data={response.data} />;
}
```

### Pattern 2: Detail Page with Dynamic Route

**Use Case:** Display details of a single item by ID

**File:** [src/app/mailchimp/reports/[id]/page.tsx](../../../app/mailchimp/reports/[id]/page.tsx)

```typescript
import { processRouteParams } from "@/utils/mailchimp/route-params";

export default async function CampaignReportPage({
  params,
  searchParams
}: ReportPageProps) {
  const { validatedParams, validatedSearchParams } = await processRouteParams({
    params,
    searchParams,
    paramsSchema: reportPageParamsSchema,
    searchParamsSchema: reportPageSearchParamsSchema,
  });

  const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

  return <CampaignReportDetail report={response.data} />;
}
```

### Pattern 3: Detail Page with Pagination (Combined Pattern)

**Use Case:** Detail page that also has paginated sub-data (e.g., report opens)

**File:** [src/app/mailchimp/reports/[id]/opens/page.tsx](../../../app/mailchimp/reports/[id]/opens/page.tsx)

```typescript
import { processRouteParams } from "@/utils/mailchimp/route-params";
import { validatePageParams } from "@/utils/mailchimp/page-params";

export default async function ReportOpensPage({
  params,
  searchParams
}: ReportOpensPageProps) {
  // First, validate route params (the [id])
  const { validatedParams } = await processRouteParams({
    params,
    searchParams: Promise.resolve({}), // No search params for route validation
    paramsSchema: reportOpensPageParamsSchema,
    searchParamsSchema: z.object({}),
  });

  // Then, validate pagination search params
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: reportOpensPageSearchParamsSchema,
    apiSchema: reportOpensApiParamsSchema,
    basePath: `/mailchimp/reports/${validatedParams.id}/opens`,
  });

  // Use both validated ID and pagination params
  const response = await mailchimpDAL.fetchReportOpens(
    validatedParams.id,
    apiParams
  );

  return <ReportOpensTable data={response.data} />;
}
```

## Related Documentation

- **[CLAUDE.md](../../../CLAUDE.md)** - Project architecture and development guidelines
- **[Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)** - Official Next.js documentation on dynamic routes
- **[Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)** - Official Next.js documentation on error handling and `notFound()`
- **[Zod Documentation](https://zod.dev/)** - Schema validation library used by both utilities

## Quick Reference

### When to Use Each Utility

| Page Type                           | Has Pagination? | Has Dynamic Route? | Utility to Use                      |
| ----------------------------------- | --------------- | ------------------ | ----------------------------------- |
| List page                           | Yes             | No                 | `validatePageParams()`              |
| Detail page                         | No              | Yes                | `processRouteParams()`              |
| Detail page with paginated sub-data | Yes             | Yes                | Both (route first, then pagination) |
| Static page                         | No              | No                 | Neither                             |

### Import Statements

```typescript
// For paginated lists
import { validatePageParams } from "@/utils/mailchimp/page-params";

// For dynamic routes
import { processRouteParams } from "@/utils/mailchimp/route-params";

// Common schemas location
import { *PageSearchParamsSchema } from "@/schemas/components";
import { *ParamsSchema } from "@/schemas/mailchimp";
```

## Best Practices

1. **Always validate params BEFORE Suspense boundaries** - This ensures 404 errors work correctly
2. **Use consistent schema naming** - Follow the conventions outlined above
3. **Provide clear error messages** - Help developers understand validation failures
4. **Keep schemas in separate files** - Don't define schemas inline in page components
5. **Export inferred types** - Make TypeScript types available alongside schemas
6. **Use `.strict()` on schemas** - Prevent unexpected parameters from passing validation
7. **Set defaults in schemas** - Use `.default()` for optional params with fallback values

## Troubleshooting

### Common Issues

**Issue:** "State not found" or params are undefined

- **Solution:** Ensure you're awaiting the `params` and `searchParams` promises before validation

**Issue:** 404 not triggering for invalid IDs

- **Solution:** Make sure `processRouteParams()` is called BEFORE any Suspense boundaries

**Issue:** Redirect loops on paginated pages

- **Solution:** Check that your API schema has proper defaults and the transformer is working correctly

**Issue:** Type errors with schemas

- **Solution:** Ensure your UI schema matches the transformer output shape, and API schema matches the API requirements
