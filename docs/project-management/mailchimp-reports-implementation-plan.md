## Mailchimp Reports Endpoint Implementation Plan

**Overview:**  
Implement the Mailchimp API Reports endpoint (`GET /reports`) to display a list of campaign reports, including key metrics and navigation to report details.

---

### Section 1: Schema Layer

1. **Create Zod Schemas in `src/schemas/mailchimp/`:**
   - `report-list-query.schema.ts`
     - Query parameters: `fields`, `exclude_fields`, `count`, `offset`, `type`, `status`, etc. (as per API docs)
     - Internal schema for service layer (arrays, parsed values)
   - `report-list-success.schema.ts`
     - `ReportSchema`: report object (id, campaign_id, type, status, emails_sent, abuse_reports, etc.)
     - `ReportListSuccessSchema`: main response schema (array of reports, total_items, \_links)
   - `report-list-error-response.schema.ts`
     - Reuse/extend common error schema as needed

2. **Update `src/schemas/mailchimp/index.ts`**  
   Only add the following three schema files to `src/schemas/mailchimp/index.ts`:

   ```ts
   export * from "@/schemas/mailchimp/report-list-query.schema";
   export * from "@/schemas/mailchimp/report-list-success.schema";
   export * from "@/schemas/mailchimp/report-list-error-response.schema";
   ```

   This ensures only the new schemas for the reports endpoint are exported, following project conventions.

---

### Section 2: Types Layer

1. **Create TypeScript Types in `src/types/mailchimp/`:**
   - `reports.ts`
     - Types inferred from Zod schemas:
       - `Report`
       - `ReportListSuccess`
       - `ReportListErrorResponse`
       - Query types
   - Export types in `src/types/mailchimp/index.ts` using path aliases.

---

### Section 3: Actions Layer

1. **Service Layer (`src/services/mailchimp.service.ts`):**
   - Add `getReports(params?: ReportListQueryInternal)` method
   - Handle query parameters, error handling, and return typed response

2. **Actions Layer (`src/actions/mailchimp-reports.ts`):**
   - Validation function for query parameters
   - Server action `getMailchimpReports()`:
     - Validates input
     - Calls service method
     - Returns typed response with error handling

---

### Section 4: UI Components Layer

1. **Create Dashboard Components in `src/components/dashboard/`:**
   - `reports-overview.tsx`
     - Props: reports data, loading state
     - Card/table layout for report list
     - Sections for key metrics (emails sent, open rate, click rate, bounces, etc.)
     - Loading and error states
   - Metric components for report stats
   - Export in `src/components/dashboard/index.ts` using path aliases

---

### Section 5: Navigation & Routing

1. **Create App Router Page:**
   - `src/app/mailchimp/reports/page.tsx`
     - Suspense wrapper, server-side data fetching, error boundaries
     - Use `getMailchimpReports()` action

2. **Update Sidebar Navigation:**
   - Add "Reports" item to Mailchimp section
   - Use appropriate Lucide icon (e.g., FileText)
   - Route: `/mailchimp/reports`

---

### Section 6: Testing Layer

1. **Schema Tests (`src/test/reports-schema.test.ts`):**
   - Validate success/error schemas with sample data

2. **Action Tests (`src/actions/mailchimp-reports.test.ts`):**
   - Test query validation and action logic

3. **Component Tests (`src/components/dashboard/reports-overview.test.tsx`):**
   - Render with valid/invalid data, accessibility checks

---

### Section 7: Documentation

- Update README and developer docs to describe new endpoint, schemas, types, actions, and UI components.

---

**Ready to proceed with the schema layer for reports?**
