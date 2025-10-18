/**
 * Campaign Abuse Reports Page
 * Displays abuse reports and complaints for a specific campaign
 *
 * @route /mailchimp/reports/[id]/abuse-reports
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Abuse report details, Export data
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignAbuseReportsSkeleton } from "@/skeletons/mailchimp";
import { abuseReportsPageParamsSchema } from "@/schemas/components";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignAbuseReportsTable } from "@/components/dashboard/reports";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { AbuseReportListSuccess } from "@/types/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import {
  handleApiError,
  bc,
  generateCampaignAbuseReportsMetadata,
} from "@/utils";

async function CampaignAbuseReportsPageContent({
  abuseReportsData,
  campaignId,
  errorCode,
}: {
  abuseReportsData: AbuseReportListSuccess | null;
  campaignId: string;
  errorCode?: string;
}) {
  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {abuseReportsData ? (
        <CampaignAbuseReportsTable
          abuseReportsData={abuseReportsData}
          currentPage={1}
          pageSize={abuseReportsData.total_items}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/abuse-reports`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load abuse reports" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignAbuseReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } = abuseReportsPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  // The campaign report endpoint reliably returns 404 for invalid campaign IDs
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Fetch campaign abuse reports data (BEFORE Suspense boundary)
  // Note: This API endpoint does not support pagination parameters (count/offset)
  // All abuse reports are returned in a single response
  const response = await mailchimpDAL.fetchCampaignAbuseReports(campaignId);

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const abuseReportsData = response.success
    ? (response.data as AbuseReportListSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Abuse Reports"
      description="Spam complaints and abuse reports for this campaign"
      skeleton={<CampaignAbuseReportsSkeleton />}
    >
      <CampaignAbuseReportsPageContent
        abuseReportsData={abuseReportsData}
        campaignId={campaignId}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawParams = await params;
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Abuse Reports"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignAbuseReportsMetadata;
