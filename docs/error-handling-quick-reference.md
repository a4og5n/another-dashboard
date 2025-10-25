# Error Handling Quick Reference

**Last Updated**: October 25, 2025
**See Also**: `docs/error-handling-analysis.md` (comprehensive analysis)

This is a quick reference for implementing error handling in Mailchimp dashboard pages. Use this for fast lookups during implementation.

---

## Standard Pattern (Use This) ✅

```tsx
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export default async function MyPage({ params }: PageProps) {
  // 1. Validate route params
  const { id } = myPageParamsSchema.parse(await params);

  // 2. Fetch data
  const response = await mailchimpDAL.fetchSomething(id);

  // 3. Handle 404s automatically
  handleApiError(response); // Triggers notFound() for 404s, returns error message

  // 4. Extract data safely
  const data = response.success ? response.data : null;

  // 5. Render with guard
  return (
    <PageLayout
      title="My Page"
      description="Description"
      skeleton={<MySkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <MyContent {...data} />
        ) : (
          <DashboardInlineError error="Failed to load data" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

---

## What Each Part Does

### `handleApiError(response)`

**Purpose**: Automatically triggers `notFound()` for 404 errors

**Returns**: Error message string (for non-404 errors) or `null` (for success)

**When to use**: Call once after every DAL fetch

```tsx
const response = await mailchimpDAL.fetchCampaign(id);
handleApiError(response); // Triggers notFound() if 404

// If we reach here, it's NOT a 404
// Could still be connection error, rate limit, etc.
```

**DO NOT**:

```tsx
❌ const error = handleApiError(response);
❌ if (error) { notFound(); }  // WRONG: handleApiError already called notFound()
```

### `MailchimpConnectionGuard`

**Purpose**: Shows connection error UI for Mailchimp-specific errors

**Props**: `errorCode` (from `response.errorCode`)

**Handles**:

- `MAILCHIMP_NOT_CONNECTED` - Shows "connect your account" message
- `MAILCHIMP_TOKEN_EXPIRED` - Shows "reconnect your account" message
- `undefined` - Renders children normally

```tsx
<MailchimpConnectionGuard errorCode={response.errorCode}>
  {/* Only renders if errorCode is undefined (no connection error) */}
  <MyContent />
</MailchimpConnectionGuard>
```

### `DashboardInlineError`

**Purpose**: Displays error message with icon

**Props**: `error` (string message)

**When to use**: When `response.success === false` but NOT a 404 or connection error

```tsx
{
  data ? (
    <MyContent {...data} />
  ) : (
    <DashboardInlineError error="Failed to load campaign data" />
  );
}
```

**DO NOT**:

```tsx
❌ <div className="text-red-600">{error}</div>  // Use DashboardInlineError instead
```

---

## Error Types & How to Handle Them

| Error Type       | Indicator                       | Handler                    | User Sees                      |
| ---------------- | ------------------------------- | -------------------------- | ------------------------------ |
| 404 (Not Found)  | `statusCode === 404`            | `handleApiError()`         | not-found.tsx page             |
| Connection Error | `errorCode === 'MAILCHIMP_...'` | `MailchimpConnectionGuard` | "Connect your account" message |
| API Error        | `response.success === false`    | `DashboardInlineError`     | Error card with message        |
| Unexpected Error | Thrown exception                | Error boundary             | error.tsx page                 |

---

## Common Patterns

### Pattern 1: Simple Detail Page

```tsx
export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = paramsSchema.parse(await params);
  const response = await mailchimpDAL.fetchCampaign(id);

  handleApiError(response);
  const data = response.success ? response.data : null;

  return (
    <PageLayout title="Campaign" skeleton={<Skeleton />}>
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <CampaignContent campaign={data} />
        ) : (
          <DashboardInlineError error="Failed to load campaign" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

### Pattern 2: Nested Detail Page (Validate Parent First)

```tsx
export default async function CampaignOpensPage({ params }: PageProps) {
  const { id: campaignId } = paramsSchema.parse(await params);

  // 1. Validate parent exists
  const campaignResponse = await mailchimpDAL.fetchCampaign(campaignId);
  handleApiError(campaignResponse); // 404 if campaign doesn't exist

  // 2. Fetch child data
  const opensResponse = await mailchimpDAL.fetchOpens(campaignId);
  handleApiError(opensResponse);

  const opensData = opensResponse.success ? opensResponse.data : null;

  return (
    <PageLayout title="Opens" skeleton={<Skeleton />}>
      <MailchimpConnectionGuard errorCode={opensResponse.errorCode}>
        {opensData ? (
          <OpensTable data={opensData} />
        ) : (
          <DashboardInlineError error="Failed to load opens" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

### Pattern 3: List Page (No 404s Expected)

```tsx
export default async function CampaignsListPage({ searchParams }: PageProps) {
  const { page, perPage } = pageParamsSchema.parse(await searchParams);
  const response = await mailchimpDAL.fetchCampaigns({ count: perPage });

  // No handleApiError() call - list pages don't 404
  const data = response.success ? response.data : null;

  return (
    <PageLayout title="Campaigns" skeleton={<Skeleton />}>
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <CampaignsTable campaigns={data.campaigns} />
        ) : (
          <DashboardInlineError error="Failed to load campaigns" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

### Pattern 4: Breadcrumb Component (Optional Error Handling)

```tsx
async function MyBreadcrumbs({ id }: { id: string }) {
  const response = await mailchimpDAL.fetchCampaign(id);

  // Breadcrumbs are not critical - show fallback on error
  if (!response.success || !response.data) {
    return (
      <BreadcrumbNavigation
        items={[bc.home, bc.mailchimp, bc.campaigns, bc.campaign(id)]}
      />
    );
  }

  // Use campaign name if available
  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.campaigns,
        bc.custom(response.data.name, `/mailchimp/campaigns/${id}`),
      ]}
    />
  );
}
```

---

## Common Mistakes ❌

### Mistake 1: Redundant notFound() Call

```tsx
❌ WRONG:
const response = await mailchimpDAL.fetchCampaign(id);
const error = handleApiError(response);

if (error || !response.data) {
  notFound();  // Already called by handleApiError()
}

✅ CORRECT:
const response = await mailchimpDAL.fetchCampaign(id);
handleApiError(response);  // That's it!
const data = response.success ? response.data : null;
```

### Mistake 2: Missing MailchimpConnectionGuard

```tsx
❌ WRONG:
const response = await mailchimpDAL.fetchCampaign(id);
handleApiError(response);

if (!response.data) {
  notFound();  // Treats connection error as 404!
}

return <CampaignContent campaign={response.data} />;

✅ CORRECT:
const response = await mailchimpDAL.fetchCampaign(id);
handleApiError(response);
const data = response.success ? response.data : null;

return (
  <MailchimpConnectionGuard errorCode={response.errorCode}>
    {data ? (
      <CampaignContent campaign={data} />
    ) : (
      <DashboardInlineError error="Failed to load campaign" />
    )}
  </MailchimpConnectionGuard>
);
```

### Mistake 3: Custom Error Display

```tsx
❌ WRONG:
<div className="text-center text-red-600">{error}</div>

✅ CORRECT:
<DashboardInlineError error={error} />
```

### Mistake 4: Checking handleApiError() Return Value

```tsx
❌ WRONG:
const error = handleApiError(response);
if (error) {
  return <ErrorDisplay message={error} />;
}

✅ CORRECT:
handleApiError(response);  // Don't capture return value
const data = response.success ? response.data : null;

return (
  <MailchimpConnectionGuard errorCode={response.errorCode}>
    {data ? <Content /> : <DashboardInlineError error="Failed" />}
  </MailchimpConnectionGuard>
);
```

### Mistake 5: Using errorCode for API Errors

```tsx
❌ WRONG:
<MailchimpConnectionGuard errorCode={response.errorCode}>
  {response.errorCode ? (
    <DashboardInlineError error="Error" />  // errorCode is for connection errors only!
  ) : (
    <Content />
  )}
</MailchimpConnectionGuard>

✅ CORRECT:
<MailchimpConnectionGuard errorCode={response.errorCode}>
  {data ? (
    <Content />
  ) : (
    <DashboardInlineError error="Failed to load" />
  )}
</MailchimpConnectionGuard>
```

---

## Decision Tree

Use this flowchart to decide which error handling to use:

```
START
  │
  ├─ Is this a detail page with [id]?
  │    YES → Call handleApiError() to auto-trigger 404s
  │    NO  → Skip handleApiError()
  │
  ├─ Does the page fetch Mailchimp data?
  │    YES → Wrap content in MailchimpConnectionGuard
  │    NO  → No guard needed
  │
  ├─ Could API call fail for non-404, non-connection reasons?
  │    YES → Show DashboardInlineError when data is null
  │    NO  → Just render content
  │
END
```

---

## Testing Error States

### Manual Testing Checklist

When implementing a new page, test these scenarios:

- [ ] **Valid data**: Page renders correctly
- [ ] **404 error**: Invalid ID shows not-found.tsx
- [ ] **Connection error**: Disconnect Mailchimp, see connection guard message
- [ ] **API error**: Force API error (rate limit?), see inline error
- [ ] **Empty state**: Valid ID but no data (if applicable)
- [ ] **Loading state**: Skeleton shows while loading

### How to Test Connection Error

1. Go to `/settings/integrations`
2. Click "Disconnect" on Mailchimp
3. Navigate to your page
4. Should see: "Connect your Mailchimp account" message
5. Should NOT see: 404 page or blank screen

### How to Test 404 Error

1. Navigate to page with invalid ID (e.g., `/mailchimp/campaigns/invalid-id`)
2. Should see: not-found.tsx page
3. Should NOT see: Error boundary or blank screen

---

## Import Statements

Always import these at the top:

```tsx
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
```

---

## Related Files

- **Comprehensive Analysis**: `docs/error-handling-analysis.md`
- **Error Utilities**: `src/utils/errors/`
- **Guard Component**: `src/components/mailchimp/mailchimp-connection-guard.tsx`
- **Error Display**: `src/components/dashboard/shared/dashboard-inline-error.tsx`
- **Error Boundaries**: `src/app/mailchimp/**/error.tsx`
- **404 Pages**: `src/app/mailchimp/**/not-found.tsx`

---

## Quick Checklist

Before merging, verify:

- [ ] `handleApiError()` called for detail pages (with [id])
- [ ] `MailchimpConnectionGuard` wraps Mailchimp data display
- [ ] `DashboardInlineError` used (not custom divs)
- [ ] No redundant `notFound()` calls after `handleApiError()`
- [ ] Tested connection error state manually
- [ ] Tested 404 error state manually
- [ ] not-found.tsx exists for detail pages

---

## When in Doubt

**Use the List Segments pattern** (`src/app/mailchimp/lists/[id]/segments/page.tsx:87-119`)

This is the reference implementation that follows all best practices.

**Or ask**: Check `docs/error-handling-analysis.md` Table (Part 7) to see which pattern similar pages use.
