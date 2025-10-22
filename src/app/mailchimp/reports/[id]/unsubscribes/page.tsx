/**
 * Campaign Unsubscribes Page
 * Displays members who unsubscribed from a specific campaign
 *
 * @route /mailchimp/reports/[id]/unsubscribes
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Member details, Unsubscribe reasons
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignUnsubscribesSkeleton } from "@/skeletons/mailchimp";
import { campaignUnsubscribesPageParamsSchema } from "@/schemas/components/mailchimp/report-unsubscribes-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignUnsubscribesTable } from "@/components/mailchimp/reports/campaign-unsubscribes-table";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { UnsubscribesSuccess } from "@/types/mailchimp/unsubscribes";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignUnsubscribesMetadata } from "@/utils/metadata";

async function CampaignUnsubscribesPageContent({
  unsubscribesData,
  campaignId,
  errorCode,
}: {
  unsubscribesData: UnsubscribesSuccess | null;
  campaignId: string;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {unsubscribesData ? (
        <CampaignUnsubscribesTable
          unsubscribesData={unsubscribesData}
          currentPage={1}
          pageSize={unsubscribesData.total_items}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/unsubscribes`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load unsubscribe data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignUnsubscribesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } =
    campaignUnsubscribesPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Fetch campaign unsubscribes data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignUnsubscribes(campaignId);

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const unsubscribesData = response.success
    ? (response.data as UnsubscribesSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Unsubscribes"
      description="Members who unsubscribed from this campaign"
      skeleton={<CampaignUnsubscribesSkeleton />}
    >
      <CampaignUnsubscribesPageContent
        unsubscribesData={unsubscribesData}
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
  const { id } = campaignUnsubscribesPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Unsubscribes"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignUnsubscribesMetadata;
