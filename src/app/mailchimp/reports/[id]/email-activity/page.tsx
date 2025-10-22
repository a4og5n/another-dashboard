/**
 * Campaign Email Activity Page
 * Displays email activity (opens, clicks, bounces) for a specific campaign
 *
 * @route /mailchimp/reports/[id]/email-activity
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Activity details, Email tracking
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignEmailActivitySkeleton } from "@/skeletons/mailchimp";
import {
  emailActivityPageParamsSchema,
  emailActivityPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/email-activity-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignEmailActivityTable } from "@/components/mailchimp/reports/campaign-email-activity-table";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { EmailActivitySuccess } from "@/types/mailchimp/email-activity";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignEmailActivityMetadata } from "@/utils/metadata";
import { emailActivityQueryParamsSchema } from "@/schemas/mailchimp/email-activity-params.schema";
import { validatePageParams } from "@/utils/mailchimp/page-params";

async function CampaignEmailActivityPageContent({
  emailActivityData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: {
  emailActivityData: EmailActivitySuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {emailActivityData ? (
        <CampaignEmailActivityTable
          emailActivityData={emailActivityData}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/email-activity`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load email activity data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignEmailActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } =
    emailActivityPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Validate page params with redirect handling (BEFORE Suspense boundary)
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: emailActivityPageSearchParamsSchema,
    apiSchema: emailActivityQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/email-activity`,
  });

  // Fetch campaign email activity data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignEmailActivity(
    campaignId,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const emailActivityData = response.success
    ? (response.data as EmailActivitySuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Email Activity"
      description="Email activity tracking for this campaign"
      skeleton={<CampaignEmailActivitySkeleton />}
    >
      <CampaignEmailActivityPageContent
        emailActivityData={emailActivityData}
        campaignId={campaignId}
        currentPage={currentPage}
        pageSize={pageSize}
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
  const { id } = emailActivityPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Email Activity"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignEmailActivityMetadata;
