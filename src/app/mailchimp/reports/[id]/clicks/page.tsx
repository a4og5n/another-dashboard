/**
 * Campaign Clicks Detail Page
 * Displays list of URLs clicked in a specific campaign
 *
 * @route /mailchimp/reports/[id]/clicks
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Click tracking, Sorting
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { CampaignOpensSkeleton } from "@/skeletons/mailchimp";
import {
  clickDetailsPageParamsSchema,
  pageSearchParamsSchema,
} from "@/schemas/components/mailchimp/reports-click-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ClickDetailsContent } from "@/components/mailchimp/reports/click-details-content";
import { clickListQueryParamsSchema } from "@/schemas/mailchimp/report-click-details-params.schema";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { handleApiError, bc } from "@/utils";
import type { z } from "zod";
import { reportClickListSuccessSchema } from "@/schemas/mailchimp/report-click-details-success.schema";

type ClickListSuccess = z.infer<typeof reportClickListSuccessSchema>;

interface CampaignClicksPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CampaignClicksPage({
  params,
  searchParams,
}: CampaignClicksPageProps) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } = clickDetailsPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Validate page params with redirect handling (BEFORE Suspense boundary)
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: clickListQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/clicks`,
  });

  // Fetch campaign click list data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignClickDetails(
    campaignId,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const clicksData = response.success
    ? (response.data as ClickListSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Click Details"
      description="URLs clicked in this campaign"
      skeleton={<CampaignOpensSkeleton />}
    >
      <ClickDetailsContent
        clicksData={clicksData}
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
  const { id } = clickDetailsPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Clicks"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// TODO: Create metadata helper
// export const generateMetadata = generateCampaignClicksMetadata;
