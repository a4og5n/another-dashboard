/**
 * Campaign Opens Page
 * Server component that displays members who opened the campaign
 *
 * Issue #135: Campaign opens list page implementation
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { CampaignOpensSkeleton } from "@/skeletons/mailchimp";
import { generateCampaignOpensMetadata } from "@/utils/mailchimp/metadata";
import {
  reportOpensPageParamsSchema,
  reportOpensPageSearchParamsSchema,
} from "@/schemas/components";
import type { ReportOpensPageProps } from "@/types/components/mailchimp";
import { mailchimpService } from "@/services/mailchimp.service";
import { CampaignOpensTable } from "@/components/dashboard/reports";
import { openListQueryParamsSchema } from "@/schemas/mailchimp/report-open-details-params.schema";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { ReportOpenListSuccess } from "@/types/mailchimp";
import { processPageParams } from "@/utils/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

async function CampaignOpensPageContent({
  params,
  searchParams,
}: ReportOpensPageProps) {
  // Process route params
  const rawRouteParams = await params;
  const { id: campaignId } = reportOpensPageParamsSchema.parse(rawRouteParams);

  // Process page params with redirect handling
  const { apiParams, currentPage, pageSize } = await processPageParams({
    searchParams,
    uiSchema: reportOpensPageSearchParamsSchema,
    apiSchema: openListQueryParamsSchema,
    basePath: `/mailchimp/reports/${campaignId}/opens`,
  });

  // Fetch campaign open list data - service validates internally
  const response = await mailchimpService.getCampaignOpenList(
    campaignId,
    apiParams,
  );

  // Handle error states
  if (!response.success) {
    // Use notFound() for 404 errors (missing campaign)
    const errorMessage = response.error || "Failed to load campaign opens";
    if (
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("404")
    ) {
      notFound();
    }

    // For other errors, display inline error
    return <DashboardInlineError error={errorMessage} />;
  }

  const opensData = response.data as ReportOpenListSuccess;

  return (
    <CampaignOpensTable
      opensData={opensData}
      currentPage={currentPage}
      pageSize={pageSize}
      perPageOptions={[...PER_PAGE_OPTIONS]}
      baseUrl={`/mailchimp/reports/${campaignId}/opens`}
      campaignId={campaignId}
    />
  );
}

export default function CampaignOpensPage({
  params,
  searchParams,
}: ReportOpensPageProps) {
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
            params={params}
            searchParams={searchParams}
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

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignOpensMetadata;
