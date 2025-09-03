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

### Section 3.5: Schema-UI Consistency Layer (CRITICAL - Added from Experience)

**Purpose**: Prevent schema-UI mismatches that cause test failures and runtime errors.

**MANDATORY SCHEMA-UI VALIDATION WORKFLOW:**

1. **Schema Validation Step**:
   ```bash
   # Run schema tests FIRST - must be 100% passing
   pnpm test src/test/schemas/reports-schema.test.ts
   ```

2. **Type Generation Verification**:
   ```typescript
   // In component files, ONLY use z.infer types:
   type ReportProps = z.infer<typeof CampaignReportSchema>;
   type QueryParams = z.infer<typeof ReportListQueryInternalSchema>;
   
   // NEVER create manual interfaces that duplicate schema fields
   ```

3. **Mock Data Generation Pattern**:
   ```typescript
   // Test utilities must generate schema-valid data:
   const createValidReport = (): CampaignReport => {
     const mockData = { /* ... */ };
     return CampaignReportSchema.parse(mockData); // Validates against schema
   };
   ```

4. **Component Interface Alignment**:
   ```typescript
   // Component props must match schema exactly:
   interface ReportsOverviewProps {
     reports: z.infer<typeof ReportListSuccessSchema>['reports'];
     totalItems: z.infer<typeof ReportListSuccessSchema>['total_items'];
     // Use schema field names exactly - no camelCase conversion
   }
   ```

**COMMON SCHEMA-UI MISMATCH PATTERNS TO AVOID:**

❌ **Field Name Mismatches**:
- Schema: `total_items` → UI Component: `totalItems` 
- Schema: `campaign_title` → UI Component: `campaignTitle`

❌ **Type Definition Mismatches**:
- Schema has 5 fields → Manual type has 4 fields
- Schema uses enum → Manual type uses string literal union

❌ **Test Data Mismatches**:
- Mock data created manually → Doesn't match schema validation rules
- Test expects `getByDisplayValue()` → shadcn/ui Select doesn't expose displayValue

✅ **Correct Patterns**:
- Use exact schema field names in UI components
- Generate all types with `z.infer<typeof SchemaName>`
- Validate all mock data with actual schema `.parse()` calls
- Test shadcn/ui components using proper selectors (`getByRole`, `getByText`)

**SCHEMA-UI INTEGRATION CHECKLIST:**
- [ ] Schema tests pass 100% before UI development
- [ ] Component interfaces use only `z.infer` types
- [ ] Mock data passes schema validation
- [ ] UI displays exact schema field names
- [ ] Tests use appropriate selectors for shadcn/ui components
- [ ] No manual type definitions that duplicate schema fields

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

**CRITICAL SCHEMA-UI CONSISTENCY RULES:**
1. **Schema-First Testing**: Create comprehensive schema tests BEFORE implementing UI components
2. **UI Schema Alignment**: Ensure UI components consume exactly what schemas produce - no manual type definitions
3. **Test Data Validation**: All test data must pass actual schema validation before being used in component tests

1. **Schema Tests (`src/test/schemas/reports-schema.test.ts`):**
   - **⚠️ CRITICAL**: Create schema tests FIRST to validate all schema definitions
   - **Schema-to-Test-Data**: Use actual schema validation to generate valid test data
   - **Test all schemas**:
     - `ReportListQuerySchema` - query parameter validation with defaults
     - `ReportListSuccessSchema` - full API response validation including nested objects
     - `CampaignReportSchema` - individual report structure validation
     - All nested schemas (bounces, opens, clicks, etc.)
   - **Required field coverage**: Test both required and optional fields
   - **Enum validation**: Test all enum values defined in schemas
   - **Edge cases**: Boundary values, empty arrays, null/undefined handling

2. **Action Tests (`src/actions/mailchimp-reports.test.ts`):**
   - **Schema integration**: Use validated schemas for mock data generation
   - **Test validation functions**:
     - `validateMailchimpReportsQuery()` - Test schema defaults (count: 10, offset: 0)
     - Error handling with schema-derived `ValidationError` class
   - **Service integration**: Mock service responses using schema-valid data
   - **Edge cases**: Invalid parameters must match schema validation errors

3. **Component Tests (`src/components/dashboard/reports-overview.test.tsx`):**
   - **⚠️ SCHEMA-UI MISMATCH PREVENTION**:
     - Use ONLY schema-validated mock data for component tests
     - Generate test props using `z.infer<typeof SchemaName>` types
     - Test components with exact schema output, not manually created objects
   - **UI Component Testing Patterns**:
     - **shadcn/ui Select Components**: Use `screen.getByRole("combobox")` and `screen.getByText()` instead of `getByDisplayValue()`
     - **Pagination Controls**: Test button states and ARIA labels, not internal values
     - **Table Data**: Verify rendered content matches schema field names exactly
   - **Component-specific patterns**:
     - `PerPageSelector`: Test by role and text content, not display value
     - `PaginationControls`: Test navigation behavior and accessibility
     - Data tables: Validate column headers match schema property names
   - **Loading and error states**: Use schema-compliant mock data

4. **Page Tests (`src/app/mailchimp/reports/page.test.tsx`):**
   - **Server component focus**: Test data fetching and parameter handling
   - **Schema compliance**: All mock service responses must pass schema validation
   - **URL parameter handling**: Test searchParams parsing with schema defaults

5. **Schema-UI Integration Validation:**
   - **Pre-component testing**: Run schema tests and verify ALL pass before component development
   - **Component prop validation**: Ensure component interfaces match `z.infer<typeof Schema>` types
   - **Mock data generation**: Create test utilities that generate schema-valid mock data
   - **Field mapping validation**: Verify UI displays exact schema field names (no manual mapping)

**ARCHITECTURAL ENFORCEMENT:**
- **Schema-driven development**: UI components must consume schema types via z.infer, never manual interfaces
- **Test data integrity**: All test data must pass actual schema `.parse()` calls
- **UI-Schema coupling**: Any schema changes must trigger corresponding UI component updates
- **Component testing patterns**: Establish reusable test patterns that work with shadcn/ui components

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

## Implementation Lessons Learned & Best Practices

### Critical Schema-UI Integration Insights

**Problem Identified**: Schema definitions and UI implementation often diverge, causing test failures and runtime issues.

**Root Causes**:
1. **Manual type definitions** instead of using `z.infer<typeof Schema>`
2. **Field name inconsistencies** between schemas and UI components
3. **Test data generation** not validated against actual schemas
4. **Component testing patterns** not adapted to shadcn/ui component structure

**Solutions Applied**:
1. **Schema-First Development**: All schemas tested and validated before UI development
2. **Type Generation**: Strict use of `z.infer` pattern for all type definitions
3. **Mock Data Validation**: All test data must pass schema `.parse()` validation
4. **Component Test Patterns**: Established proper testing patterns for shadcn/ui components

### Architectural Enforcement Recommendations

**For Future Features**:
1. **Mandatory Schema Testing**: Schema tests must be 100% passing before proceeding to UI layer
2. **Component Interface Validation**: Use schema-derived types only, no manual interfaces
3. **Test Data Integrity**: Create utilities that generate schema-valid test data
4. **UI-Schema Coupling**: Any schema changes must trigger UI component reviews

### Testing Pattern Library

**shadcn/ui Component Testing**:
- `Select` components: Use `getByRole("combobox")` and `getByText()`, not `getByDisplayValue()`
- `Button` components: Test by role and accessibility attributes
- `Table` components: Validate data matches schema field names exactly

**Schema Validation Testing**:
- Test all enum values defined in schemas
- Validate required vs optional field handling
- Test boundary conditions and edge cases
- Ensure defaults are applied correctly

---

**Implementation Plan Complete - Enhanced with schema-UI consistency safeguards**
