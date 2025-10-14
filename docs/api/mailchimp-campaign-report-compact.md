# Mailchimp Campaign Report Implementation Guide

## Context

Add individual campaign report detail pages via `/reports/{campaign_id}` API endpoint. Follow existing patterns, reuse components, maintain consistency.

## Sub-Agent Implementation Strategy

### Agent 1: Foundation Layer (Sections 0-2)

**Task**: "Implement campaign report foundation: branch setup, schema refactoring, all Zod schemas, and TypeScript types"

**Files to Create:**

```
src/schemas/mailchimp/common/campaign-report.schema.ts    # Move from report-list-success
src/schemas/mailchimp/report-detail-params.schema.ts     # Path/query params
src/schemas/mailchimp/report-detail-success.schema.ts    # API response
src/schemas/mailchimp/report-detail-error.schema.ts      # Error handling
src/types/mailchimp/report-detail.ts                     # All type definitions
```

**Files to Update:**

```
src/schemas/mailchimp/report-list-success.schema.ts      # Update import only
src/schemas/mailchimp/index.ts                           # Add exports
src/types/mailchimp/index.ts                             # Add exports
```

**Branch**: `feature/mailchimp-campaign-report-detail`

### Agent 2: API Integration (Section 3)

**Task**: "Implement server actions and service methods for campaign report API integration"

**Files to Extend:**

```
src/dal/mailchimp.dal.ts                        # Add getCampaignReport method
src/actions/mailchimp-reports.ts                         # Add server action + validation
```

**Template - Service Method:**

```typescript
async getCampaignReport(campaignId: string, params?: { fields?: string; exclude_fields?: string }) {
  const endpoint = `/reports/${campaignId}`;
  return this.makeRequest<CampaignReport>(endpoint, { params });
}
```

### Agent 3: UI Components (Section 4)

**Task**: "Create React components for campaign report analytics display"

**Files to Create:**

```
src/components/dashboard/reports/ReportHeader.tsx        # Title, status, key metrics
src/components/dashboard/reports/ReportMetrics.tsx      # Metric cards with progress
src/components/dashboard/reports/ReportCharts.tsx       # Recharts visualization
src/components/dashboard/reports/ReportLinks.tsx        # Clicked links table
src/components/dashboard/reports/CampaignReportDetail.tsx # Container component
src/components/dashboard/reports/CampaignReportLoading.tsx # Skeleton loader
```

**Files to Update:**

```
src/components/dashboard/reports/index.ts               # Add exports
```

**Requirements:**

- Use shadcn/ui components (Card, Table, Progress, Badge)
- Recharts for time-series visualization
- Responsive design with Tailwind CSS
- Accessibility attributes (ARIA labels, semantic HTML)
- Loading/error states

### Agent 4: Routing & Pages (Section 5)

**Task**: "Create Next.js App Router pages and navigation for campaign reports"

**Files to Create:**

```
src/app/mailchimp/campaigns/[id]/report/page.tsx        # Main server component
src/app/mailchimp/campaigns/[id]/report/loading.tsx     # Loading UI
src/app/mailchimp/campaigns/[id]/report/error.tsx       # Error boundary
src/app/mailchimp/campaigns/[id]/report/not-found.tsx   # 404 handler
```

**Navigation Update:**
Add "View Report" links to campaigns table for sent campaigns only.

**Template - Main Page:**

```typescript
export default async function CampaignReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fields?: string; exclude_fields?: string }>;
}) {
  const { id } = await params;
  const { fields, exclude_fields } = await searchParams;

  // Server-side data fetching with error handling
  // Return CampaignReportDetail component
}
```

## Code Templates

### Schema Pattern:

```typescript
// report-detail-params.schema.ts
export const ReportDetailPathParamsSchema = z.object({
  campaign_id: z.string().min(1),
});

export const ReportDetailQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strip();
```

### Component Pattern:

```typescript
// ReportMetrics.tsx
interface ReportMetricsProps {
  report: CampaignReport;
}

export function ReportMetrics({ report }: ReportMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(report.opens.open_rate * 100).toFixed(1)}%</div>
          <Progress value={report.opens.open_rate * 100} className="mt-2" />
        </CardContent>
      </Card>
      {/* More metrics */}
    </div>
  );
}
```

## Validation Checklist

### After Agent 1 (Foundation):

- [ ] Branch created: `feature/mailchimp-campaign-report-detail`
- [ ] Common schema extracted and imported correctly
- [ ] All new schemas export properly
- [ ] `pnpm type-check` passes

### After Agent 2 (API Integration):

- [ ] Service method integrates with existing patterns
- [ ] Server action handles validation and errors
- [ ] JSDoc comments added to all functions

### After Agent 3 (UI Components):

- [ ] All components render without errors
- [ ] Responsive design works on mobile/desktop
- [ ] Accessibility attributes present
- [ ] Loading states implemented

### After Agent 4 (Routing):

- [ ] Pages load successfully for valid campaign IDs
- [ ] Error handling works for invalid IDs
- [ ] Navigation links appear in campaigns table
- [ ] URL parameters parsed correctly

## Success Criteria

- Individual campaign reports display comprehensive analytics
- All components follow existing design patterns
- Full integration from API to UI
- No existing functionality broken
- Ready for Phase 2 (testing/documentation)

## Dependencies

- Existing MailchimpDAL class
- shadcn/ui components
- Recharts library
- Next.js 15 App Router patterns
- Common error schemas and patterns

## Estimated Implementation Time

- **Agent 1**: 60 minutes (foundation)
- **Agent 2**: 45 minutes (API integration)
- **Agent 3**: 90 minutes (UI components)
- **Agent 4**: 45 minutes (routing)
- **Total**: ~4 hours implementation
