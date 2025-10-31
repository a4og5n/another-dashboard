# Development Patterns

Complete guide to development patterns and best practices used in this project.

## Table of Contents

- [Error Handling](#error-handling)
- [Breadcrumbs](#breadcrumbs)
- [Standard Card Components](#standard-card-components)
- [URL Params Processing](#url-params-processing)
- [Data Formatting](#data-formatting)
- [Adding Navigation Links](#adding-navigation-links)
- [Table Implementation Patterns](#table-implementation-patterns)
- [PageLayout Component](#pagelayout-component)
- [Metadata Helpers](#metadata-helpers)
- [Page Component Headers](#page-component-headers)
- [Component Development](#component-development)
- [UI Component Patterns](#ui-component-patterns)
- [Mailchimp Fetch Client Architecture](#mailchimp-fetch-client-architecture)
- [OAuth Setup](#oauth-setup)

---

## Error Handling

**⚠️ CRITICAL: Standard Error Handling Pattern (Issue #240)**

All dynamic route pages MUST follow this pattern:

### Required Files

- ✅ **error.tsx** - Client Component for unexpected crashes
- ✅ **not-found.tsx** - Server Component for 404 errors
- ❌ **NO loading.tsx** - Interferes with 404 flow (NEVER use)

**Enforced by:** `src/test/architectural-enforcement/error-handling-enforcement.test.ts`

### Standard Pattern

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

### Utilities

**Location:** `src/utils/errors/`

- `handleApiError(response)` - Auto-handles 404s with `notFound()`, returns error message for UI
- `handleApiErrorWithFallback(response, fallback)` - Same with custom fallback
- `is404Error(message)` - Detects 404/not found errors

### Key Principles

1. ✅ **404 Handling**: Always use `handleApiError()` - it auto-triggers `notFound()`
2. ✅ **Connection Errors**: Always use `MailchimpConnectionGuard` with `errorCode`
3. ✅ **Other Errors**: Use `DashboardInlineError` component (not raw divs)
4. ❌ **Never**: Call `notFound()` manually - `handleApiError()` does it
5. ❌ **Never**: Use loading.tsx - interferes with 404 flow
6. 📄 **error.tsx**: Only for unexpected crashes, not API errors

**Philosophy:** Return expected errors as values, use `notFound()` for 404s, let error boundaries catch unexpected errors.

---

## Breadcrumbs

**Utility:** `bc` from `@/utils/breadcrumbs`

**Usage:**

```tsx
<BreadcrumbNavigation
  items={[
    bc.home,
    bc.mailchimp,
    bc.reports,
    bc.report(id),
    bc.current("Details"),
  ]}
/>
```

**Available Routes:**

- `bc.home`
- `bc.mailchimp`
- `bc.reports`
- `bc.lists`
- `bc.generalInfo`
- `bc.settings`
- `bc.integrations`
- `bc.report(id)`
- `bc.list(id)`
- `bc.reportOpens(id)`
- `bc.reportAbuseReports(id)`
- `bc.current(label)`
- `bc.custom(label, href)`

---

## Standard Card Components

**Components:** `StatCard` | `StatsGridCard` | `StatusCard`

### Decision Tree

- **StatCard**: Single metric with optional trend
- **StatsGridCard**: 2-4 related metrics (simple value + label)
- **StatusCard**: Status info with badge
- **Custom**: Interactive features, charts, tables

**Import types:** `@/types/components/ui`

- `StatCardProps`
- `StatsGridCardProps`
- `StatusCardProps`

---

## URL Params Processing

### Decision Tree

- **Pagination** (`?page=N&perPage=M`) → `validatePageParams()` from `@/utils/mailchimp/page-params`
- **Route params** (`[id]`, `[slug]`) → `processRouteParams()` from `@/utils/mailchimp/route-params`
- **Neither** → No utility needed

**Docs:** `src/utils/params/README.md`

---

## Data Formatting

### Number Formatting

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

### Date Formatting

Use `formatDateTimeSafe()` from `@/utils/mailchimp/date`:

```tsx
import { formatDateTimeSafe } from "@/utils/mailchimp/date";

// ISO 8601 → "Jan 15, 2025 at 2:30 PM"
<TableCell>{formatDateTimeSafe(email.timestamp)}</TableCell>;
```

### Display Priority Guidelines

1. **Card Titles:** Always format numbers (`.toLocaleString()`)
2. **Table Headers:** Format if displaying counts
3. **Table Cells:** Format dates, large numbers, percentages
4. **Badges:** Raw values are okay (e.g., status badges)

**See:** `docs/ai-workflow-learnings.md` for complete formatting guide

---

## Adding Navigation Links

When implementing a new detail page, add navigation links from parent pages following this standard pattern:

### Pattern (used in campaign/list detail pages)

1. **Location**: Add to the relevant tab (Stats, Details, Overview, etc.)
2. **Component**: Use `CardFooter` with border styling
3. **Button**: `Button` with `asChild`, `variant="outline"`, `size="sm"`
4. **Link**: Next.js `Link` component
5. **Icon**: Include `ArrowRight` icon for consistency

### Example Implementation

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

### Key Points

- `CardFooter` always has `className="border-t pt-4"` for visual separation
- Button uses `variant="outline"` for secondary action appearance
- Button uses `size="sm"` and `className="w-full"` for consistent sizing
- Arrow icon uses `className="ml-2 h-4 w-4"` for spacing and size
- Text should be action-oriented: "View X", "Explore Y", "See Z"

### Reference Implementation

- Campaign Reports: `src/components/dashboard/reports/CampaignReportDetail.tsx`
- List Details: `src/components/mailchimp/lists/list-detail.tsx:369-381`

---

## Table Implementation Patterns

### Pagination Placement (CRITICAL)

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

### Server Component Tables (Default Pattern)

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

### Benefits

- Server Component (smaller bundle, better performance)
- URL-based pagination (SEO-friendly, shareable links)
- No hooks needed (simpler code)
- Always use shadcn/ui `Table` component (never raw HTML `<table>`)

**See:** `docs/ai-workflow-learnings.md` for complete table patterns and decision tree

---

## PageLayout Component

**Usage:** All dashboard pages use `PageLayout` from `@/components/layout`

### Patterns

- **Static pages:** `breadcrumbs={[bc.home, bc.current("Page")]}`
- **Dynamic pages:** `breadcrumbsSlot={<Suspense><BreadcrumbContent /></Suspense>}`

**Props:** title, description, skeleton (required) + breadcrumbs XOR breadcrumbsSlot

---

## Metadata Helpers

**Helpers:** Available from `@/utils/metadata`

- `generateCampaignReportMetadata`
- `generateCampaignOpensMetadata`
- `generateCampaignAbuseReportsMetadata`

**Usage:**

```tsx
export const generateMetadata = generateCampaignOpensMetadata;
```

(1 line vs 30+ inline)

**Type helper:** `import type { GenerateMetadata } from "@/types/components/metadata"` for type-safe metadata functions

---

## Page Component Headers

### Template

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

---

## Component Development

### Server Components by Default

- **CRITICAL:** layouts (`layout.tsx`, `dashboard-shell.tsx`) and `not-found.tsx` MUST be Server Components (404 status codes)
- Only use `"use client"` for hooks (useState, useEffect) or browser APIs
- Extract client logic to child components, keep parent as Server Component
- **Tables:** Default to Server Components with URL-based pagination (see Table Implementation Patterns above)
- Enforced by architectural tests

**Patterns:** Atomic design, shadcn/ui base, JSDoc comments

---

## UI Component Patterns

### Star Rating Display

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

### Badge Variant Mapping

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

### Clickable Primary Identifier with Subtext

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

### HTML Content Preview with Iframe Isolation

**When to use**: Displaying user-generated or third-party HTML content (campaign content, landing pages, templates)

**Problem**: Injected HTML can conflict with page CSS (e.g., nested `<main>` elements, conflicting styles)

**Solution**: Use iframe with `srcDoc` for complete CSS isolation

```typescript
<div className="p-6 rounded-lg border bg-card">
  <iframe
    className="w-full min-h-[600px] border-0"
    srcDoc={htmlContent}
    title="Content Preview"
    sandbox="allow-same-origin"
  />
</div>
```

**Key points**:

- `srcDoc` creates isolated document context (no CSS leakage)
- `sandbox="allow-same-origin"` for security (prevents scripts, allows same-origin access)
- Wrapper div provides card styling (border, padding, background)
- Set appropriate `min-h-[XXpx]` based on content type
- Always provide descriptive `title` attribute for accessibility

**Use cases**:

- Campaign content preview (HTML, archive HTML)
- Landing page HTML preview
- Email template rendering
- Newsletter content display
- Any third-party HTML injection

**Example from campaign-content-content.tsx** (Issue #388):

```tsx
<iframe
  className="w-full min-h-[600px] border-0"
  srcDoc={data.html || ""}
  title="Campaign HTML Preview"
  sandbox="allow-same-origin"
/>
```

---

## Mailchimp Fetch Client Architecture

**Layers:** Server Actions → DAL → Action Wrapper → Fetch Client → Mailchimp API

### Files

- `src/lib/errors/mailchimp-errors.ts` - Error classes
- `src/lib/mailchimp-fetch-client.ts` - Native fetch client (Edge compatible)
- `src/lib/mailchimp-client-factory.ts` - `getUserMailchimpClient()`
- `src/lib/mailchimp-action-wrapper.ts` - `mailchimpApiCall()` returns ApiResponse<T>
- `src/dal/mailchimp.dal.ts` - Business logic (singleton)

### Usage

```tsx
const result = await mailchimpDAL.fetchCampaignReports({ count: 10 });
if (!result.success) {
  // Handle error
}
```

**Benefits:** 97% smaller bundle, Edge Runtime compatible, rate limit tracking, timeout handling

---

## OAuth Setup

### Mailchimp OAuth

1. Create Neon DB via Vercel (Storage tab)
2. `vercel env pull .env.local`
3. Register OAuth app at Mailchimp → Add client ID/secret to `.env.local`
4. Generate encryption key: `openssl rand -base64 32` → Add to `.env.local`
5. `pnpm db:push` → `pnpm dev`
6. Visit `/settings/integrations` to connect

### Kinde Local HTTPS

- **Required:** `KINDE_COOKIE_DOMAIN=127.0.0.1` in `.env.local` for OAuth state persistence
- **Troubleshooting "State not found":** `pkill -f "next dev"` → `pnpm clean` → `pnpm dev` → Clear browser cache → Test in incognito
- **Production:** Remove or set to custom domain
