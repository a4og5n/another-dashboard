# Mailchimp Reports API Documentation

## Overview

The Mailchimp Reports API provides comprehensive campaign analytics and performance metrics. This endpoint implements server-side data fetching with pagination and filtering capabilities.

---

## Server Action

### `getMailchimpReports(params)`

Server action for retrieving paginated campaign reports with comprehensive analytics.

**Location:** `src/actions/mailchimp-reports.ts`

#### Parameters

```typescript
interface ReportListQueryInternal {
  fields?: string[];        // Array of field names to include in response
  exclude_fields?: string[]; // Array of field names to exclude from response
  count?: number;           // Number of reports to return (default: 10, max: 1000)
  offset?: number;          // Number of reports to skip (default: 0)
  type?: "regular" | "plaintext" | "absplit" | "rss" | "variate"; // Campaign type filter
  before_send_time?: string; // ISO 8601 date - reports sent before this time
  since_send_time?: string;  // ISO 8601 date - reports sent after this time
}
```

#### Response Format

**Success Response:**
```typescript
{
  success: true;
  data: {
    total_items: number;
    reports: CampaignReport[];
    _links: MailchimpLink[];
  }
}
```

**Error Response:**
```typescript
{
  success: false;
  error: string;
}
```

#### Campaign Report Structure

Each report contains comprehensive analytics data:

```typescript
interface CampaignReport {
  id: string;
  campaign_title: string;
  type: "regular" | "plain-text" | "ab_split" | "rss" | "automation" | "variate" | "auto";
  list_id: string;
  list_is_active: boolean;
  list_name: string;
  subject_line: string;
  preview_text: string;
  emails_sent: number;
  abuse_reports: number;
  unsubscribed: number;
  send_time: string; // ISO 8601
  rss_last_send: string; // ISO 8601
  bounces: {
    hard_bounces: number;
    soft_bounces: number;
    syntax_errors: number;
  };
  forwards: {
    forwards_count: number;
    forwards_opens: number;
  };
  opens: {
    opens_total: number;
    proxy_excluded_opens: number;
    unique_opens: number;
    proxy_excluded_unique_opens: number;
    open_rate: number;
    proxy_excluded_open_rate: number;
    last_open: string; // ISO 8601
  };
  clicks: {
    clicks_total: number;
    unique_clicks: number;
    unique_subscriber_clicks: number;
    click_rate: number;
    last_click: string; // ISO 8601
  };
  facebook_likes: {
    recipient_likes: number;
    unique_likes: number;
    facebook_likes: number;
  };
  industry_stats: {
    type: string;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unopen_rate: number;
    unsub_rate: number;
    abuse_rate: number;
  };
  list_stats: {
    sub_rate: number;
    unsub_rate: number;
    open_rate: number; // 0-100
    proxy_excluded_open_rate: number; // 0-100
    click_rate: number; // 0-100
  };
  ab_split?: {
    a: AbSplitData;
    b: AbSplitData;
  };
  timewarp?: TimewarpData[];
  timeseries?: TimeseriesData[];
  share_report?: {
    share_url: string;
    share_password: string;
  };
  ecommerce?: {
    total_orders: number;
    total_spent: number;
    total_revenue: number;
    currency_code: string;
  };
  delivery_status: {
    enabled: boolean;
    can_cancel: boolean;
    status: "delivering" | "delivered" | "canceling" | "canceled";
    emails_sent: number;
    emails_canceled: number;
  };
  _links: MailchimpLink[];
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { getMailchimpReports } from '@/actions/mailchimp-reports';

// Get first 10 reports
const result = await getMailchimpReports({});

if (result.success) {
  console.log(`Found ${result.data.total_items} total reports`);
  result.data.reports.forEach(report => {
    console.log(`${report.campaign_title}: ${report.emails_sent} emails sent`);
  });
}
```

### Pagination

```typescript
// Get reports 11-20
const paginatedResult = await getMailchimpReports({
  count: 10,
  offset: 10
});
```

### Filtering by Campaign Type

```typescript
// Get only regular campaigns
const regularReports = await getMailchimpReports({
  type: "regular",
  count: 25
});
```

### Date Range Filtering

```typescript
// Get reports from last 30 days
const recentReports = await getMailchimpReports({
  since_send_time: "2023-11-01T00:00:00Z",
  before_send_time: "2023-12-01T00:00:00Z"
});
```

---

## UI Integration

### Reports Overview Component

**Location:** `src/components/dashboard/reports-overview.tsx`

The Reports Overview component displays campaign reports in a paginated table format with the following columns:

- **Campaign Title** (linked to campaign details)
- **Type** (campaign type badge)
- **List Name** (linked to list details)
- **Status** (delivery status)
- **Emails Sent** (total emails sent)
- **Abuse Reports** (abuse report count)
- **Unsubscribed** (unsubscribe count)
- **Sent Date** (formatted send date)

### Page Implementation

**Location:** `src/app/mailchimp/reports/page.tsx`

Server-side rendered page with URL-based pagination:

```typescript
// URL: /mailchimp/reports?page=2&per_page=20
interface SearchParams {
  page?: string;
  per_page?: string;
  type?: string;
}
```

---

## Schema Validation

### Query Schema

**Location:** `src/schemas/mailchimp/report-list-query.schema.ts`

```typescript
export const ReportListQueryInternalSchema = z.object({
  fields: z.array(z.string()).optional(),
  exclude_fields: z.array(z.string()).optional(),
  count: z.number().min(1).max(1000).default(10).optional(),
  offset: z.number().min(0).default(0).optional(),
  type: z.enum(REPORT_TYPES).optional(),
  before_send_time: z.string().optional(),
  since_send_time: z.string().optional(),
}).optional();
```

### Success Response Schema

**Location:** `src/schemas/mailchimp/report-list-success.schema.ts`

Comprehensive schema validation for all response fields including nested objects for bounces, opens, clicks, and analytics data.

---

## Error Handling

### Validation Errors

```typescript
{
  success: false,
  error: "Parameter validation failed: Invalid Mailchimp reports query parameters"
}
```

### Service Errors

```typescript
{
  success: false,
  error: "Failed to fetch campaign reports"
}
```

### Common Error Scenarios

1. **Invalid count parameter**: Must be between 1-1000
2. **Invalid offset parameter**: Must be >= 0
3. **Invalid campaign type**: Must be one of the defined enum values
4. **Invalid date format**: Must be valid ISO 8601 format
5. **Service unavailable**: Mailchimp API connection issues

---

## Testing

### Test Coverage

- **Schema Tests:** 24/24 passing (100% schema validation coverage)
- **Action Tests:** 17/17 passing (parameter validation, service integration, error handling)
- **Component Tests:** 28/33 passing (UI rendering, pagination, accessibility)
- **Page Tests:** 9/9 passing (server-side integration, URL parameters)

### Test Files

- `src/test/schemas/reports-schema.test.ts` - Schema validation tests
- `src/test/actions/mailchimp-reports.test.ts` - Server action tests
- `src/test/components/reports-overview.test.tsx` - Component rendering tests
- `src/test/app/mailchimp/reports/page.test.tsx` - Page integration tests

---

## References

- **Mailchimp API Documentation:** [List Campaign Reports](https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/)
- **Schema Files:** `src/schemas/mailchimp/report-*.schema.ts`
- **Type Definitions:** `src/types/mailchimp/reports.ts`
- **Service Implementation:** `src/services/mailchimp.service.ts`
- **Component Implementation:** `src/components/dashboard/reports-overview.tsx`