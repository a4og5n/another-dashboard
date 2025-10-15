# Campaign Abuse Reports Page - Implementation Plan

**Feature**: Add abuse reports page for campaigns
**Endpoint**: `GET /reports/{campaign_id}/abuse-reports`
**Route**: `/mailchimp/reports/[id]/abuse-reports`
**Status**: In Progress
**Created**: 2025-10-15

## Overview

Create a new page to display abuse/spam complaints for individual campaigns, following the same architecture pattern as the campaign opens page (`/reports/[id]/opens`).

## Prerequisites - CREATED (Not Yet Committed)

- ✅ Mailchimp API schemas created:
  - `src/schemas/mailchimp/abuse-reports-params.schema.ts`
  - `src/schemas/mailchimp/abuse-reports-success.schema.ts`
  - `src/schemas/mailchimp/abuse-reports-error.schema.ts`
- ✅ TypeScript types added to `src/types/mailchimp/reports.ts`
- ✅ Schemas follow naming convention: `abuseReportsPathParamsSchema`, `abuseReportsQueryParamsSchema`

## Implementation Phases

### Phase -1: Commit Prerequisites (Current Phase)

**Goal**: Commit the foundational Mailchimp API schemas and types before creating feature branch

**Files to Commit**:

- `src/schemas/mailchimp/abuse-reports-params.schema.ts` (NEW)
- `src/schemas/mailchimp/abuse-reports-success.schema.ts` (NEW)
- `src/schemas/mailchimp/abuse-reports-error.schema.ts` (NEW)
- `src/types/mailchimp/reports.ts` (MODIFIED - added abuse reports types)

**Pre-Commit Validation**:

1. Run `pnpm type-check` - Ensure no TypeScript errors
2. Run `pnpm lint` - Ensure no linting errors
3. Review changes: `git status` and `git diff`

**Git Operations**:

```bash
# Stage the new schema files
git add src/schemas/mailchimp/abuse-reports-*.schema.ts

# Stage the updated types file
git add src/types/mailchimp/reports.ts

# Review staged changes
git diff --staged

# Commit with descriptive message
git commit -m "feat: add Mailchimp abuse reports API schemas and types

- Add abuse-reports-params.schema.ts with path and query params
- Add abuse-reports-success.schema.ts with response structure
- Add abuse-reports-error.schema.ts for error handling
- Add abuse report types to reports.ts

Endpoint: GET /reports/{campaign_id}/abuse-reports
Documentation: https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Commit**: `feat: add Mailchimp abuse reports API schemas and types`

**Clear conversation**: YES (after commit - start fresh for Phase 0)

---

### Phase 0: Branch Creation & Setup

**Goal**: Create feature branch and ensure clean starting point

**Tasks**:

1. Create feature branch: `feature/abuse-reports-page`
2. Verify all prerequisite schemas and types are committed
3. Run `pnpm quick-check` to ensure clean baseline

**Commit**: `chore: create feature branch for abuse reports page`

---

### Phase 1: Foundation Layer (Schemas, Types, DAL)

**Goal**: Set up data layer infrastructure

**Files to Create**:

- `src/schemas/components/abuse-reports-page-params.schema.ts`
  - `abuseReportsPageParamsSchema` - Route params (id)
  - `abuseReportsPageSearchParamsSchema` - Search params (page, perPage)

**Files to Update**:

- `src/schemas/components/index.ts` - Export new schemas
- `src/types/components/mailchimp.ts` (or create new file)
  - `AbuseReportsPageProps`
  - `AbuseReportsTableProps`
- `src/dal/mailchimp.dal.ts`
  - Add `fetchCampaignAbuseReports(campaignId, params)` method

**Implementation Details**:

```typescript
// DAL method signature
async fetchCampaignAbuseReports(
  campaignId: string,
  params?: AbuseReportsQueryParams,
): Promise<ApiResponse<AbuseReportListSuccess>> {
  return mailchimpApiCall((client) =>
    client.get<AbuseReportListSuccess>(
      `/reports/${campaignId}/abuse-reports`,
      params
    ),
  );
}
```

**Validation**:

- Run `pnpm type-check`
- Run `pnpm lint`
- Verify exports in index files

**Commit**: `feat: add data layer for abuse reports (schemas, types, DAL)`

**Clear conversation**: YES (after commit)

---

### Phase 2: UI Components (Empty State & Skeleton)

**Goal**: Create supporting UI components

**Files to Create**:

- `src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx`
  - Empty state when no abuse reports
  - Icon: `ShieldCheck` (positive messaging)
  - Message: "No abuse reports - Great news! This campaign has no spam complaints."

- `src/skeletons/mailchimp/CampaignAbuseReportsSkeleton.tsx`
  - Loading skeleton matching table structure
  - 5-10 skeleton rows

**Files to Update**:

- `src/components/dashboard/reports/index.ts` - Export empty component
- `src/skeletons/mailchimp/index.ts` - Export skeleton

**Component Structure**:

```typescript
// CampaignAbuseReportsEmpty.tsx
- Card with centered content
- ShieldCheck icon (large, success color)
- Heading: "No Abuse Reports"
- Description: Positive messaging
- Optional: Link back to campaign report

// CampaignAbuseReportsSkeleton.tsx
- Card with table skeleton
- Header skeletons
- Row skeletons (5 rows)
- Pagination skeleton
```

**Validation**:

- Run `pnpm type-check`
- Run `pnpm lint`
- Visual check if possible (Storybook/dev server)

**Commit**: `feat: add empty state and skeleton for abuse reports`

**Clear conversation**: YES (after commit)

---

### Phase 3: Table Component

**Goal**: Create main table component with TanStack Table

**Files to Create**:

- `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx`
  - Client component (`"use client"`)
  - TanStack Table integration
  - Pagination with `<Pagination>` component
  - `<PerPageSelector>` for page size control

**Files to Update**:

- `src/components/dashboard/reports/index.ts` - Export table component

**Table Columns**:
| Column | Type | Icon | Notes |
|--------|------|------|-------|
| Email Address | string | Mail | Primary identifier |
| Date Reported | datetime | Clock | Formatted with `formatDateTime` |
| List Status | boolean | - | Badge: "Active"/"Inactive" |
| VIP | boolean | User | Badge only if true |

**Component Props**:

```typescript
interface AbuseReportsTableProps {
  abuseReportsData: AbuseReportListSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions?: number[];
  baseUrl: string;
  campaignId: string;
}
```

**Features**:

- TanStack Table with `getCoreRowModel`
- Pagination calculation: `totalPages = Math.ceil(total_items / pageSize)`
- Empty state: Show `<CampaignAbuseReportsEmpty />` when `total_items === 0`
- Responsive design with Card wrapper
- Uses existing UI components: Table, Badge, Card

**Validation**:

- Run `pnpm type-check`
- Run `pnpm lint`
- Run `pnpm test` (if creating tests)

**Commit**: `feat: add abuse reports table component with pagination`

**Clear conversation**: YES (after commit)

---

### Phase 4: Page Component

**Goal**: Create the actual Next.js page

**Files to Create**:

- `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx`
  - Server component (default)
  - Metadata generation with campaign name
  - Breadcrumb navigation
  - Suspense boundaries
  - Error handling (notFound, DashboardInlineError)

**Page Structure**:

```typescript
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch campaign name for title
  // Return: "Abuse Reports - {Campaign Name} | Another Dashboard"
}

export default async function AbuseReportsPage({
  params,
  searchParams,
}) {
  // 1. Validate params with schemas
  // 2. Calculate offset/count from page/perPage
  // 3. Fetch abuse reports via mailchimpDAL
  // 4. Handle errors (404, connection, etc.)
  // 5. Render with MailchimpConnectionGuard

  return (
    <MailchimpConnectionGuard>
      <DashboardLayout>
        <BreadcrumbNavigation />
        <PageHeader title="Abuse Reports" />
        <Suspense fallback={<CampaignAbuseReportsSkeleton />}>
          <CampaignAbuseReportsTable {...props} />
        </Suspense>
      </DashboardLayout>
    </MailchimpConnectionGuard>
  );
}
```

**Error Handling**:

- Campaign not found → `notFound()`
- Connection errors → Guard handles
- API errors → `<DashboardInlineError>`
- Invalid params → Show error message

**Validation**:

- Run `pnpm type-check`
- Run `pnpm lint`
- Run `pnpm build` (ensure no build errors)

**Commit**: `feat: add abuse reports page component with error handling`

**Clear conversation**: YES (after commit)

---

### Phase 5: Integration & Testing

**Goal**: Manual testing and final adjustments

**Manual Testing Checklist**:

- [ ] Page loads at `/mailchimp/reports/{campaign_id}/abuse-reports`
- [ ] Empty state shows when no abuse reports
- [ ] Table displays abuse reports correctly
- [ ] Email addresses formatted properly
- [ ] Dates formatted with `formatDateTime`
- [ ] Badges show for List Active status
- [ ] VIP badges appear when applicable
- [ ] Pagination works (next/prev/page numbers)
- [ ] Per-page selector changes page size
- [ ] Breadcrumbs navigate correctly
- [ ] Loading skeleton appears during fetch
- [ ] Error states display properly
- [ ] 404 handling for invalid campaign IDs
- [ ] Mobile responsive design
- [ ] Accessibility: keyboard navigation, screen readers

**Test Scenarios**:

1. **Campaign with no abuse reports** → Empty state
2. **Campaign with abuse reports** → Table with data
3. **Pagination** → Multiple pages of results
4. **Invalid campaign ID** → 404 page
5. **No Mailchimp connection** → Guard redirects

**Fixes/Adjustments**:

- Fix any bugs found during testing
- Adjust styling/spacing as needed
- Update error messages for clarity

**Commit**: `test: manual testing and bug fixes for abuse reports page`

**Clear conversation**: NO (keep context for PR)

---

### Phase 6: Final Validation & PR

**Goal**: Complete pre-commit checks and create pull request

**Pre-PR Checklist**:

- [ ] Run `pnpm validate` (full validation including build)
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] No secrets logged (automatic check)
- [ ] Accessibility tests pass
- [ ] Code formatted with Prettier

**Git Operations**:

1. Final commit with any last fixes
2. Push to origin: `git push -u origin feature/abuse-reports-page`
3. Create PR with description

**PR Description Template**:

```markdown
## Summary

Add campaign abuse reports page to display spam complaints for individual campaigns.

## Changes

- ✅ Created Mailchimp API schemas for abuse reports endpoint
- ✅ Added TypeScript types to reports.ts
- ✅ Added DAL method: `fetchCampaignAbuseReports`
- ✅ Created `CampaignAbuseReportsTable` component with TanStack Table
- ✅ Created `CampaignAbuseReportsEmpty` empty state component
- ✅ Created `CampaignAbuseReportsSkeleton` loading component
- ✅ Added page at `/mailchimp/reports/[id]/abuse-reports`

## Testing

- [x] Manual testing completed
- [x] Empty state works correctly
- [x] Table pagination functions properly
- [x] Error handling verified
- [x] Accessibility checks passed

## Screenshots

[Add screenshots if available]

## Related Issues

Closes #[issue-number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Commit**: Not needed - PR creation

---

## Technical Specifications

### API Endpoint

- **Method**: GET
- **Path**: `/reports/{campaign_id}/abuse-reports`
- **Params**:
  - Path: `campaign_id` (required)
  - Query: `fields`, `exclude_fields` (optional)

### Response Schema

```typescript
{
  abuse_reports: AbuseReport[];
  campaign_id: string;
  total_items: number;
  _links: Link[];
}
```

### AbuseReport Schema

```typescript
{
  id: number;
  campaign_id: string;
  list_id: string;
  list_is_active: boolean;
  email_id: string;
  email_address: string;
  merge_fields?: MergeField;
  vip: boolean;
  date: string; // ISO 8601
  _links: Link[];
}
```

## Dependencies

### Existing Utilities

- `validatePageParams` - Page parameter validation
- `formatDateTime` - Date formatting
- `mailchimpApiCall` - API wrapper
- `mailchimpDAL` - Data access singleton

### UI Components

- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge` - Status indicators
- `Pagination` - Page navigation
- `PerPageSelector` - Page size control
- `DashboardLayout` - Page layout
- `BreadcrumbNavigation` - Navigation
- `MailchimpConnectionGuard` - Connection check

### Icons (lucide-react)

- `Mail` - Email column
- `Clock` - Date column
- `User` - VIP badge
- `ShieldCheck` - Empty state (positive)
- `AlertTriangle` - Alternative empty state icon

## Architecture Pattern

Following the established pattern from campaign opens page:

1. **Server Component** for page (data fetching)
2. **Client Component** for table (interactivity)
3. **Suspense boundaries** for loading states
4. **Connection Guard** for authentication
5. **Error boundaries** for error handling
6. **Schema validation** at all layers
7. **Type safety** end-to-end

## Success Criteria

✅ Page accessible at `/mailchimp/reports/[id]/abuse-reports`
✅ Table displays abuse report data correctly
✅ Pagination works for multiple pages
✅ Empty state shows when no abuse reports
✅ Loading skeleton appears during data fetch
✅ Error handling covers all edge cases
✅ Responsive design works on mobile
✅ Accessibility standards met (WCAG 2.1 AA)
✅ All validation checks pass (`pnpm validate`)
✅ Code follows project conventions
✅ Documentation updated

## Notes

- **Empty state messaging**: Use positive language since no abuse reports is good news
- **Pagination**: UI uses page/perPage, API uses offset/count
- **merge_fields**: Optional field, may not always be present
- **list_is_active**: Shows if the list is still active (boolean badge)
- **VIP status**: Only show badge if `vip === true`
- **Date formatting**: Use `formatDateTime` utility for consistency

## References

- Pattern source: `src/app/mailchimp/reports/[id]/opens/page.tsx`
- API docs: https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/
- Schemas: `src/schemas/mailchimp/abuse-reports-*.schema.ts`
- Types: `src/types/mailchimp/reports.ts`
