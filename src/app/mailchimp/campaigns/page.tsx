/**
 * Mailchimp Campaigns Page
 * Displays campaigns with server-side data fetching
 *
 * Issue #140: Campaigns page implementation following App Router patterns
 * Based on audiences/page.tsx pattern with consistent layout and error handling
 * Implements Next.js best practices for error handling and layout consistency
 */

import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { getMailchimpService, type MailchimpCampaignReport } from "@/services";
import { CAMPAIGNS_PER_PAGE_OPTIONS } from "@/schemas/mailchimp/campaign-query.schema";
import { validateCampaignsPageParams } from "@/utils/mailchimp/query-params";
import type { CampaignsPageProps } from "@/types/mailchimp/campaigns-page-props";

async function CampaignsPageContent({ searchParams }: CampaignsPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Get Mailchimp service and fetch reports directly
  const mailchimp = getMailchimpService();

  // Pass raw params to service - let service handle parsing/validation
  const response = await mailchimp.getCampaignReports(params);

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
  const reportsData = response.data;
  const reports: MailchimpCampaignReport[] = reportsData.reports || [];
  const totalCount = reportsData.total_items || reports.length;

  // Parse pagination params for UI components (same logic as service)
  const validationResult = validateCampaignsPageParams(params);
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
      {/* Reports Overview */}
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

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              View and analyze your Mailchimp campaigns and their performance
              metrics
            </p>
          </div>
        </div>

        {/* Dynamic Content */}
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
