/**
 * Campaign Opens Detail Page
 * Displays list of members who opened a specific campaign
 *
 * @route /mailchimp/reports/[id]/opens
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Member details, Export data
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignOpensSkeleton } from "@/skeletons/mailchimp";
import {
  reportOpensPageParamsSchema,
  reportOpensPageSearchParamsSchema,
} from "@/schemas/components";
import type { ReportOpensPageProps } from "@/types/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignOpensTable } from "@/components/dashboard/reports";
import { openListQueryParamsSchema } from "@/schemas/mailchimp/reports/open-details/params.schema";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { ReportOpenListSuccess } from "@/types/mailchimp";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignOpensMetadata } from "@/utils/metadata";

async function CampaignOpensPageContent({
  opensData,
  campaignId,
  currentPage,
  pageSize,
  errorCode,
}: {
  opensData: ReportOpenListSuccess | null;
  campaignId: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}) {
  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {opensData ? (
        <CampaignOpensTable
          opensData={opensData}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/opens`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load campaign opens" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignOpensPage({
  params,
  searchParams,
}: ReportOpensPageProps) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } = reportOpensPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  // The campaign report endpoint reliably returns 404 for invalid campaign IDs
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Validate page params with redirect handling (BEFORE Suspense boundary)
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: reportOpensPageSearchParamsSchema,
    apiSchema: openListQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/opens`,
  });

  // Fetch campaign open list data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignOpenList(
    campaignId,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const opensData = response.success
    ? (response.data as ReportOpenListSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Report"
      description="Members who opened this campaign"
      skeleton={<CampaignOpensSkeleton />}
    >
      <CampaignOpensPageContent
        opensData={opensData}
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
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Opens"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignOpensMetadata;
