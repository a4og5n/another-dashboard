/**
 * Campaign Opens Page
 * Server component that displays members who opened the campaign
 *
 * Issue #135: Campaign opens list page implementation
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignOpensSkeleton } from "@/skeletons/mailchimp";
import {
  reportOpensPageParamsSchema,
  reportOpensPageSearchParamsSchema,
} from "@/schemas/components";
import type { ReportOpensPageProps } from "@/types/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignOpensTable } from "@/components/dashboard/reports";
import { openListQueryParamsSchema } from "@/schemas/mailchimp/report-open-details-params.schema";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { ReportOpenListSuccess, CampaignReport } from "@/types/mailchimp";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import type { Metadata } from "next";
import { handleApiError } from "@/utils";

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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation - params will be awaited inside Suspense */}
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Campaign Report</h1>
          <p className="text-muted-foreground">
            Members who opened this campaign
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<CampaignOpensSkeleton />}>
          <CampaignOpensPageContent
            opensData={opensData}
            campaignId={campaignId}
            currentPage={currentPage}
            pageSize={pageSize}
            errorCode={response.errorCode}
          />
        </Suspense>
      </div>
    </DashboardLayout>
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
        { label: "Dashboard", href: "/" },
        { label: "Mailchimp", href: "/mailchimp" },
        { label: "Reports", href: `/mailchimp/reports` },
        { label: "Report", href: `/mailchimp/reports/${id}` },
        { label: "Opens", isCurrent: true },
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Opens - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Opens`,
    description: `View all members who opened ${report.campaign_title}. Total opens: ${report.opens.opens_total.toLocaleString()}`,
    openGraph: {
      title: `${report.campaign_title} - Campaign Opens`,
      description: `${report.opens.opens_total.toLocaleString()} total opens from ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}
