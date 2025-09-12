/**
 * Campaigns Page Content Component
 * Server component that handles data fetching and rendering for the campaigns page
 */

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { BreadcrumbNavigation } from "@/components/layout";
import { ReportsOverviewClient } from "@/components/dashboard/reports-overview-client";
import { getMailchimpService, type MailchimpCampaignReport } from "@/services";
import {
  CAMPAIGNS_PER_PAGE_OPTIONS,
  CAMPAIGN_TYPES,
} from "@/schemas/mailchimp/campaign-query.schema";
import { validateCampaignsPageParams } from "@/utils/mailchimp/query-params";
import { CampaignsPageProps } from "@/types/mailchimp/campaigns-page-props";

/**
 * Renders the campaigns page content with data fetching
 */
export async function CampaignsPageContent({
  searchParams,
}: CampaignsPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Validate parameters using centralized schema - following Next.js best practices
  const validationResult = validateCampaignsPageParams(params);

  if (!validationResult.success) {
    return (
      <DashboardLayout>
        <DashboardError
          error={validationResult.error}
          onRetry={() => window.location.reload()}
          onGoHome={() => (window.location.href = "/mailchimp")}
        />
      </DashboardLayout>
    );
  }

  const {
    page: currentPage,
    perPage,
    type: reportType,
    before_send_time: beforeSendTime,
    since_send_time: sinceSendTime,
  } = validationResult.data;

  // Fetch data from Mailchimp service on server side
  let reports: MailchimpCampaignReport[] = [];
  let totalCount = 0;
  let error: string | null = null;

  // Get Mailchimp service and fetch reports directly
  const mailchimp = getMailchimpService();

  const serviceParams = {
    count: perPage,
    offset: (currentPage - 1) * perPage,
    ...(reportType && { type: reportType as (typeof CAMPAIGN_TYPES)[number] }),
    ...(beforeSendTime && { before_send_time: beforeSendTime }),
    ...(sinceSendTime && { since_send_time: sinceSendTime }),
  };

  // Fetch campaign reports from Mailchimp service
  const response = await mailchimp.getCampaignReports(serviceParams);

  // Handle expected errors by checking service response
  if (!response.success) {
    error = response.error || "Failed to load campaign reports";
  } else if (response.data) {
    const reportsData = response.data;

    // Use Mailchimp API response directly
    if (reportsData.reports) {
      reports = reportsData.reports;
      totalCount = reportsData.total_items || reports.length;
    }
  }

  // Handle error state
  if (error) {
    return (
      <DashboardLayout>
        <DashboardError
          error={error}
          onRetry={() => window.location.reload()}
          onGoHome={() => (window.location.href = "/mailchimp")}
        />
      </DashboardLayout>
    );
  }

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
        {/* Reports Overview */}
        <ReportsOverviewClient
          reports={reports}
          loading={false}
          error={error}
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(totalCount / perPage))}
          perPage={perPage}
          perPageOptions={[...CAMPAIGNS_PER_PAGE_OPTIONS]}
          reportType={reportType}
          beforeSendTime={beforeSendTime}
          sinceSendTime={sinceSendTime}
        />
      </div>
    </DashboardLayout>
  );
}
