/**
 * Campaign Recipients Page
 * Displays members who received a specific campaign
 *
 * @route /mailchimp/reports/[id]/sent-to
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Member details, Delivery status, A/B split tracking
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignRecipientsSkeleton } from "@/skeletons/mailchimp";
import {
  reportSentToPageParamsSchema,
  pageSearchParamsSchema,
} from "@/schemas/components/mailchimp/report-sent-to-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignRecipientsTable } from "@/components/mailchimp/reports/campaign-recipients-table";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { SentToSuccess } from "@/types/mailchimp/sent-to";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignRecipientsMetadata } from "@/utils/metadata";
import { sentToQueryParamsSchema } from "@/schemas/mailchimp/reports/sent-to/params.schema";
import { validatePageParams } from "@/utils/mailchimp/page-params";

async function CampaignRecipientsPageContent({
  recipientsData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: {
  recipientsData: SentToSuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {recipientsData ? (
        <CampaignRecipientsTable
          recipientsData={recipientsData}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/sent-to`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load recipients data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignRecipientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } = reportSentToPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Validate page params with redirect handling (BEFORE Suspense boundary)
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: sentToQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/sent-to`,
  });

  // Fetch campaign recipients data with pagination (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignSentTo(
    campaignId,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const recipientsData = response.success
    ? (response.data as SentToSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Recipients"
      description="Members who received this campaign"
      skeleton={<CampaignRecipientsSkeleton />}
    >
      <CampaignRecipientsPageContent
        recipientsData={recipientsData}
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
  const { id } = reportSentToPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Recipients"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignRecipientsMetadata;
