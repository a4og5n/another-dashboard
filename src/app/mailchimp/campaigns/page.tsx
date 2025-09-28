/**
 * Mailchimp Campaigns Page
 * Displays campaigns with server-side data fetching
 *
 * Issue #140: Campaigns page implementation following App Router patterns
 * Based on audiences/page.tsx pattern with consistent layout and error handling
 * Implements Next.js best practices for error handling and layout consistency
 */

import { BreadcrumbNavigation } from "@/components/layout";
import type { CampaignsPageProps } from "@/types/mailchimp/campaigns-page-props";
import { CAMPAIGNS_PER_PAGE_OPTIONS } from "@/schemas/mailchimp/campaign-query.schema";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mailchimpService } from "@/services/mailchimp.service";
import type { MailchimpCampaignReport } from "@/types/mailchimp";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { Suspense } from "react";
import { validateCampaignsPageParams } from "@/utils/mailchimp/query-params";

async function CampaignsPageContent({ searchParams }: CampaignsPageProps) {
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
    reports?: MailchimpCampaignReport[];
    total_items?: number;
  };
  const reports: MailchimpCampaignReport[] = reportsData.reports || [];
  const totalCount = reportsData.total_items || reports.length;

  // Parse pagination params for UI components (same logic as service)
  const validationResult = validateCampaignsPageParams(
    params as Record<string, string | undefined>,
  );
  const currentPage = validationResult.success ? validationResult.data.page : 1;
  const perPage = validationResult.success
    ? validationResult.data.perPage
    : CAMPAIGNS_PER_PAGE_OPTIONS[0];
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
        perPageOptions={[...CAMPAIGNS_PER_PAGE_OPTIONS]}
        basePath="/mailchimp/campaigns"
        additionalParams={{
          type: reportType,
          before_send_time: beforeSendTime,
          since_send_time: sinceSendTime,
        }}
      />
    </div>
  );
}

export default function CampaignsPage({ searchParams }: CampaignsPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Campaigns", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              View and analyze your Mailchimp campaigns and their performance
              metrics
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Suspense fallback={<div>Loading campaigns...</div>}>
          <CampaignsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Campaigns | Mailchimp Dashboard",
  description:
    "View and analyze your Mailchimp campaigns and their performance metrics",
};
