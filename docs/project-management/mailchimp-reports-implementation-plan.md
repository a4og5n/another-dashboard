## Mailchimp Reports Endpoint Implementation Plan

**Overview:**  
Implement the Mailchimp API Reports endpoint (`GET /reports`) to display a list of campaign reports, including key metrics and navigation to report details.

---

### Section 1: Schema Layer

### Section 1.0: Schema Refactoring (DRY Principle - New Addition)

**Goal**: Refactor `_links` schema to follow DRY principle before implementing reports endpoint.

**Tasks**:

1. **Create Common Link Schema**
   - **File**: `src/schemas/mailchimp/common/link.schema.ts`
   - **Content**:
     - Extract `HTTP_METHODS` enum from `root-success.schema.ts`
     - Extract and rename `RootLinkSchema` to `MailchimpLinkSchema`
     - **IMPORTANT**: Schema files are reserved for schemas only - no helper functions, utilities, or business logic

2. **Update Root Success Schema**
   - **File**: `src/schemas/mailchimp/root-success.schema.ts`
   - Import `MailchimpLinkSchema` and `HTTP_METHODS` from `@/schemas/mailchimp/common/link.schema`
   - Replace `RootLinkSchema` usage with `MailchimpLinkSchema`
   - Remove duplicated `HTTP_METHODS` and `RootLinkSchema` definitions

3. **Update Index Exports**
   - Add `link.schema` to `src/schemas/mailchimp/index.ts` exports
   - Update path aliases for new schema location

### Section 1.1: Reports Schema Implementation (Updated)

**Goal**: Implement reports endpoint schemas using the refactored common link schema.

**Files to Create**:

1. **`report-list-query.schema.ts`** - Query parameters schema
2. **`report-list-success.schema.ts`** - Success response schema
   - **\_links Implementation**: Use `MailchimpLinkSchema` from common folder for both:
     - Response wrapper `_links` (required)
     - Individual report item `_links` (required)
3. **`report-list-error-response.schema.ts`** - Reuse `mailchimpErrorResponseSchema` from common

### Section 1.2: Audience Schema Enhancement (Updated)

**Goal**: Add `_links` support to audience schemas using refactored common schema.

**File to Update**:

- **`audience-success.schema.ts`**
  - Add `_links: z.array(MailchimpLinkSchema)` to response wrapper (required)
  - Add `_links: z.array(MailchimpLinkSchema)` to individual audience items (required)
  - Import from `@/schemas/mailchimp/common/link.schema`

**Architectural Reminders**:

- ✅ **Schema files contain schemas only** - no functions, utilities, or business logic
- ✅ **DRY principle** - shared schemas go in `common/` folder
- ✅ **Path aliases** - use `@/schemas/mailchimp/common/*` imports
- ✅ **Naming convention** - `MailchimpLinkSchema` for domain specificity

---

Section 1: Schema Layer (Original Implementation Details)

Goal:
Define Zod schemas for query parameters, success response, and error response for the reports endpoint, following conventions in mailchimp.

1. Create Zod Schemas

**report-list-query.schema.ts**

The object containing all parameters should be optional.
Parameters:

- fields (optional string): Comma-separated list of fields to include
- exclude_fields (optional string): Comma-separated list of fields to exclude
- count (optional number): Default 10, max 1000
- offset (optional number): Default 0
- type (optional enum): "regular", "plaintext", "absplit", "rss", "variate"
- before_send_time (optional string): ISO 8601 format
- since_send_time (optional string): ISO 8601 format

**report-list-success.schema.ts**

- total_items: number, minimum value 0
- \_links: Array, same structure as in audience-success.schema.ts
- reports: Array of objects, each containing:
  - id: string
  - campaign_title: string
  - type: enum "regular", "plain-text", "ab_split", "rss", "automation", "variate", "auto"
  - list_id: string
  - list_is_active: boolean
  - list_name: string
  - subject_line: string
  - preview_text: string
  - emails_sent: number, min 0
  - abuse_reports: number, min 0
  - unsubscribed: number, min 0
  - send_time: string, ISO 8601 format
  - rss_last_send: string, ISO 8601 format
  - bounces: object
    - hard_bounces: number, min 0
    - soft_bounces: number, min 0
    - syntax_errors: number, min 0
  - forwards: object
    - forwards_count: number, min 0
    - forwards_opens: number, min 0
  - opens: object
    - opens_total: number, min 0
    - proxy_excluded_opens: number, min 0
    - unique_opens: number, min 0
    - proxy_excluded_unique_opens: number, min 0
    - open_rate: number
    - proxy_excluded_open_rate: number
    - last_open: string, ISO 8601 format
  - clicks: object
    - clicks_total: number, min 0
    - unique_clicks: number, min 0
    - unique_subscriber_clicks: number, min 0
    - click_rate: number
    - last_click: string, ISO 8601 format
  - facebook_likes: object
    - recipient_likes: number, min 0
    - unique_likes: number, min 0
    - facebook_likes: number, min 0
  - industry_stats: object
    - type: string
    - open_rate: number
    - click_rate: number
    - bounce_rate: number
    - unopen_rate: number
    - unsub_rate: number
    - abuse_rate: number
  - list_stats: object
    - sub_rate: number
    - unsub_rate: number
    - open_rate: number, min 0, max 100
    - proxy_excluded_open_rate: number, min 0, max 100
    - click_rate: number, min 0, max 100
  - ab_split: object
    - a: object
      - bounces: number, min 0
      - abuse_reports: number, min 0
      - unsubs: number, min 0
      - recipient_clicks: number, min 0
      - forwards: number, min 0
      - forwards_opens: number, min 0
      - opens: number, min 0
      - last_open: string
      - unique_opens: number, min 0
    - b: object
      - bounces: number, min 0
      - abuse_reports: number, min 0
      - unsubs: number, min 0
      - recipient_clicks: number, min 0
      - forwards: number, min 0
      - forwards_opens: number, min 0
      - opens: number, min 0
      - last_open: string
      - unique_opens: number, min 0
  - timewarp: array of objects, each with:
    - gmt_offset: number
    - opens: number, min 0
    - last_open: string, ISO 8601 format
    - unique_opens: number, min 0
    - clicks: number, min 0
    - last_click: string, ISO 8601 format
    - unique_clicks: number, min 0
    - bounces: number, min 0
  - timeseries: array of objects, each with:
    - timestamp: string, ISO 8601 format
    - emails_sent: number, min 0
    - unique_opens: number, min 0
    - proxy_excluded_unique_opens: number, min 0
    - recipients_clicks: number, min 0
  - share_report: object
    - share_url: string
    - share_password: string
  - ecommerce: object
    - total_orders: number, min 0
    - total_spent: number, min 0
    - total_revenue: number, min 0
    - currency_code: string
  - delivery_status: object
    - enabled: boolean
    - can_cancel: boolean
    - status: enum "delivering", "delivered", "canceling", "canceled"
    - emails_sent: number, min 0
    - emails_canceled: number, min 0
  - \_links: Array, same structure as in audience-success.schema.ts

**report-list-error-response.schema.ts**

Reuse or extend common/error-response.schema.ts for error responses as needed.

2. Update Index

Update index.ts to export the new schemas using path aliases.

---

### Section 2: Types Layer

### Section 2.0: Common Types Refactoring (New)

- **File**: `src/types/mailchimp/common.ts`
- **Critical Issues**:
  - Current `MailchimpErrorResponse` uses manual type definition instead of `z.infer` pattern
  - Missing `instance` field from schema (schema has 5 fields, type has 4)
  - Architectural inconsistency with rest of types layer
- **Required Changes**:
  - **Refactor**: Update existing `MailchimpErrorResponse` to use `z.infer<typeof mailchimpErrorResponseSchema>`
  - **Add**: Import statement for error schema
  - **Add**: `MailchimpLink` type inferred from `MailchimpLinkSchema`
  - **Add**: `HttpMethod` type inferred from `HTTP_METHODS` enum
- **Pattern**: All types must use `z.infer<typeof SchemaName>` for consistency with architecture

### Section 2.1: Reports Types Implementation

- **File**: `src/types/mailchimp/reports.ts`
- **Types needed**:
  - `Report` (inferred from report schema)
  - `ReportListQuery` (inferred from query schema)
  - `ReportListSuccess` (inferred from success schema)
  - `ReportListErrorResponse` (inferred from error schema)
  - Component props types if needed

### Section 2.2: Updated Audience Types

- **File**: `src/types/mailchimp/audience.ts`
- **Update**: Add types for enhanced audience schemas with `_links`
- **Pattern**: Follow existing `z.infer<typeof SchemaName>` approach

### Section 2.3: Index Exports Update

- **File**: `src/types/mailchimp/index.ts`
- **Add**: Export path aliases for new `reports.ts` file
- **Update**: Ensure all common types are exported

---

### Section 3: Actions Layer

1. **Service Layer (`src/services/mailchimp.service.ts`):**
   - Use existing `getCampaignReports(params?: ReportListQueryInternal)` method
   - Note: Method already exists - will be used for campaign reports specifically
   - Future: Other report types (audience reports, etc.) will use different methods
   - Handle query parameters, error handling, and return typed response

2. **Actions Layer (`src/actions/mailchimp-reports.ts`):**
   - Create new action file following established patterns
   - Validation function `validateMailchimpReportsQuery()` for query parameters
   - Server action `getMailchimpCampaignReports()`:
     - Validates input using report query schema
     - Calls `getCampaignReports()` service method
     - Returns typed response with error handling
   - Follow patterns from `mailchimp-audiences.ts` (ValidationError class, etc.)

---

### Section 4: UI Components Layer

1. **Create Dashboard Components in `src/components/dashboard/`:**
   - `reports-overview.tsx`
     - Props: reports data, loading state, error state
     - Follow `audiences-overview.tsx` component pattern
     - **Reuse existing components**:
       - `MetricCard` for key metrics (emails sent, open rate, click rate, bounces, etc.)
       - `Table` component from `@/components/ui/table` for report list display
       - `ListSkeleton` for loading states
       - Dashboard error components from `./shared/` folder
     - Card/table hybrid layout for comprehensive report display
     - Loading and error states with established patterns

2. **Component Reuse Strategy:**
   - **Leverage existing MetricCard**: Perfect for report statistics display
   - **Use shared dashboard components**: Error handling, pagination, loading states
   - **Follow established patterns**: Consistent with audiences and campaigns components
   - **Export in index.ts**: Add path alias export for new reports component

3. **Icon Selection:**
   - Use appropriate Lucide React icon (e.g., `FileText`, `BarChart3`, `TrendingUp`)
   - Follow existing icon usage patterns from other dashboard components

---

### Section 5: Navigation & Routing

1. **Create App Router Page:**
   - `src/app/mailchimp/reports/page.tsx`
     - **Follow established pattern**: Use `audiences/page.tsx` as template
     - **Server-side data fetching**: Direct service calls (`mailchimp.getCampaignReports(params)`)
     - **Async searchParams**: Support pagination, filtering, sorting query parameters
     - **Layout structure**: `DashboardLayout`, breadcrumbs, header section
     - **Error handling**: `DashboardError` component with retry/navigation
     - **Suspense wrapper**: Proper loading fallbacks
     - **Component composition**: Reports stats + `ReportsOverview` component

2. **Update Sidebar Navigation:**
   - **File**: `src/components/layout/dashboard-sidebar.tsx`
   - **Add to Mailchimp children**: Insert "Reports" item in navigation array
   - **Icon selection**: Use `FileText` or `BarChart3` (consistent with Lucide React pattern)
   - **Route**: `/mailchimp/reports`
   - **Position**: Place after "Audiences", before "Campaigns"
   - **Status**: Active (not disabled like Campaigns)

3. **Breadcrumb Navigation:**
   - Follow existing pattern: Dashboard > Mailchimp > Reports
   - Consistent with `audiences/page.tsx` breadcrumb structure

---

### Section 6: Testing Layer

1. **Schema Tests (`src/test/reports-schema.test.ts`):**
   - **Follow pattern**: Use `campaigns-schema.test.ts` as template
   - **Test cases**: Valid data, missing required fields, wrong types, edge cases
   - **Schemas to test**:
     - `ReportListQuerySchema` - query parameter validation
     - `ReportListSuccessSchema` - API response validation
     - `ReportListErrorResponseSchema` - error response validation
   - **Sample data**: Create realistic test data matching Mailchimp API structure

2. **Action Tests (`src/actions/mailchimp-reports.test.ts`):**
   - **Follow pattern**: Use `mailchimp-audiences.test.ts` as template
   - **Test validation functions**:
     - `validateMailchimpReportsQuery()` - valid/invalid parameters, defaults, type coercion
     - Error handling with `ValidationError` class
   - **Test server actions** (if implemented):
     - Success scenarios with valid data
     - Error scenarios and structured error responses
   - **Edge cases**: Empty parameters, malformed input, boundary values

3. **Component Tests (`src/components/dashboard/reports-overview.test.tsx`):**
   - **Follow pattern**: Use `campaigns-table.test.tsx` as template
   - **Render tests**: Valid data, invalid data, undefined props
   - **Loading states**: Skeleton components, loading indicators
   - **Error states**: Empty state, error boundaries, retry functionality
   - **Accessibility tests**:
     - ARIA attributes (`aria-live`, `role`, `aria-label`)
     - Screen reader compatibility
     - Keyboard navigation
     - Use `@/test/axe-helper.tsx` for axe-core testing
   - **MetricCard integration**: Test metric display and formatting

4. **Page Tests (`src/app/mailchimp/reports/page.test.tsx`):**
   - **Follow pattern**: Use `audiences/page.test.tsx` as template
   - **Server component testing**: Mock service calls and data fetching
   - **Error boundary testing**: Service failures, network errors
   - **Search params handling**: Pagination, sorting, filtering
   - **Layout integration**: Breadcrumbs, navigation, layout components

5. **Integration Considerations:**
   - **API Route Tests** (if API routes are created): Follow existing API route test patterns
   - **Architectural Enforcement**: Ensure new schemas pass architectural tests
   - **Accessibility Testing**: Run `pnpm test:a11y` to verify WCAG 2.1 AA compliance
   - **Test Coverage**: Maintain comprehensive test coverage across all layers

---

### Section 7: Documentation

1. **Update Main README.md:**
   - **Features section**: Add "Reports endpoint with comprehensive metrics"
   - **Project structure**: Reflect new reports schemas, types, components, and pages
   - **Mailchimp integration**: Update description to include reports functionality

2. **Update Technical Guide (`docs/project-management/technical-guide.md`):**
   - **API Integration section**: Document reports endpoint implementation
   - **Schema patterns**: Include reports schemas in architecture examples
   - **Component patterns**: Add reports components to UI architecture
   - **Testing patterns**: Include reports testing examples

3. **Create/Update API Documentation:**
   - **File**: `docs/api/mailchimp-reports-api.md` (follow pattern from `mailchimp-dashboard-api.md`)
   - **Content**: Endpoint specification, request/response schemas, error handling
   - **Examples**: Sample requests, responses, and error scenarios

4. **Update Development Roadmap (`docs/project-management/development-roadmap.md`):**
   - Mark reports endpoint as completed
   - Update current status and next priorities
   - Document performance impact and metrics

5. **Code Documentation:**
   - **JSDoc comments**: Comprehensive documentation for all new components, functions, and schemas
   - **README files**: Update component folder READMEs if applicable
   - **Type documentation**: Clear descriptions for all new TypeScript interfaces

6. **Implementation Notes:**
   - **Architecture decisions**: Document DRY refactoring and common schema patterns
   - **Performance considerations**: Note any optimizations or monitoring additions
   - **Future extensibility**: Document how to add other report types (audience reports, etc.)

---

**Implementation Plan Complete - Ready to proceed with development phase**
