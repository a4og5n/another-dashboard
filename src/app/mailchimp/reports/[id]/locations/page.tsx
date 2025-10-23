/**
 * Campaign Locations Page
 * Displays geographic engagement data by location
 *
 * @route /mailchimp/reports/[id]/locations
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Geographic data, Engagement metrics by location
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignLocationsSkeleton } from "@/skeletons/mailchimp";
import {
  reportLocationActivityPageParamsSchema,
  pageSearchParamsSchema,
} from "@/schemas/components/mailchimp/report-location-activity-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignLocationsTable } from "@/components/mailchimp/reports/campaign-locations-table";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { LocationActivitySuccess } from "@/types/mailchimp/location-activity";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignLocationsMetadata } from "@/utils/metadata";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { locationActivityQueryParamsSchema } from "@/schemas/mailchimp/location-activity-params.schema";

async function CampaignLocationsPageContent({
  locationsData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: {
  locationsData: LocationActivitySuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {locationsData ? (
        <CampaignLocationsTable
          locationsData={locationsData}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/locations`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load locations data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignLocationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } =
    reportLocationActivityPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: locationActivityQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/locations`,
  });

  // Fetch campaign locations data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignLocationActivity(
    campaignId,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const locationsData = response.success
    ? (response.data as LocationActivitySuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Locations"
      description="Geographic engagement by location"
      skeleton={<CampaignLocationsSkeleton />}
    >
      <CampaignLocationsPageContent
        locationsData={locationsData}
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
  const { id } = reportLocationActivityPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Locations"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignLocationsMetadata;
