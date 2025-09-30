/**
 * Mailchimp Reports Page
 * Displays reports with server-side data fetching
 *
 * Issue #140: Reports page implementation following App Router patterns
 * Based on audiences/page.tsx pattern with consistent layout and error handling
 * Implements Next.js best practices for error handling and layout consistency
 */

import { BreadcrumbNavigation } from "@/components/layout";
import type { ReportsPageProps } from "@/types/mailchimp/reports-page-props";
import { REPORTS_PER_PAGE_OPTIONS } from "@/schemas/components/reports-page-params.schema";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mailchimpService } from "@/services/mailchimp.service";
import type { CampaignReport } from "@/types/mailchimp";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { Suspense } from "react";
import { validateReportsPageParams } from "@/utils/mailchimp/query-params";

async function ReportsPageContent({ searchParams }: ReportsPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Use service layer for better architecture
  const response = await mailchimpService.getCampaignReports(params);

  // Handle expected API failures as return values, not exceptions
  if (!response.success) {
    return (
      <div>Error: {response.error || "Failed to load campaign reports"}</div>
    );
  }

  if (!response.data) {
    return <div>Error: No campaign data received</div>;
  }

  // Extract reports data and pagination params using utility function
  const reportsData = response.data as {
    reports?: CampaignReport[];
    total_items?: number;
  };
  const reports: CampaignReport[] = reportsData.reports || [];
  const totalCount = reportsData.total_items || reports.length;

  // Parse pagination params for UI components (same logic as service)
  const validationResult = validateReportsPageParams(
    params as Record<string, string | undefined>,
  );
  const currentPage = validationResult.success ? validationResult.data.page : 1;
  const perPage = validationResult.success
    ? validationResult.data.perPage
    : REPORTS_PER_PAGE_OPTIONS[0];
  const reportType = validationResult.success
    ? validationResult.data.type
    : undefined;
  const beforeSendTime = validationResult.success
    ? validationResult.data.before_send_time
    : undefined;
  const sinceSendTime = validationResult.success
    ? validationResult.data.since_send_time
    : undefined;

  return (
    <div className="space-y-6">
      {/* Campaign Reports */}
      <ReportsOverview
        reports={reports}
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(totalCount / perPage))}
        perPage={perPage}
        perPageOptions={[...REPORTS_PER_PAGE_OPTIONS]}
        basePath="/mailchimp/reports"
        additionalParams={{
          type: reportType,
          before_send_time: beforeSendTime,
          since_send_time: sinceSendTime,
        }}
      />
    </div>
  );
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Reports", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              View and analyze your Mailchimp reports and their performance
              metrics
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Suspense fallback={<div>Loading reports...</div>}>
          <ReportsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports | Mailchimp Dashboard",
  description:
    "View and analyze your Mailchimp reports and their performance metrics",
};
