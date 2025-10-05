/**
 * Campaign Report Detail Page
 * Server component that fetches campaign report data and displays detailed analytics
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mailchimpService } from "@/services/mailchimp.service";
import { CampaignReportDetail } from "@/components/dashboard";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { CampaignReportSkeleton } from "@/skeletons/mailchimp";
import { generateCampaignReportMetadata, processRouteParams } from "@/utils";
import type { CampaignReport } from "@/types/mailchimp";
import type { ReportPageProps } from "@/types/components/mailchimp";
import {
  reportPageParamsSchema,
  reportPageSearchParamsSchema,
} from "@/schemas/components";

async function CampaignReportPageContent({
  params,
  searchParams,
}: ReportPageProps) {
  // Validate route params and search params
  const { validatedParams, validatedSearchParams } = await processRouteParams({
    params,
    searchParams,
    paramsSchema: reportPageParamsSchema,
    searchParamsSchema: reportPageSearchParamsSchema,
  });

  // Get active tab from search params (with default fallback)
  const activeTab = validatedSearchParams.tab;

  // Fetch campaign report data
  const response = await mailchimpService.getCampaignReport(validatedParams.id);

  // Handle error states
  if (!response.success) {
    // Use notFound() for 404 errors (missing campaign)
    // Pass other errors to component for inline display
    const errorMessage = response.error || "Failed to load campaign report";
    if (
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("404")
    ) {
      notFound();
    }

    return (
      <CampaignReportDetail
        report={null}
        error={errorMessage}
        activeTab={activeTab}
      />
    );
  }

  return (
    <CampaignReportDetail
      report={response.data as CampaignReport}
      activeTab={activeTab}
    />
  );
}

export default function CampaignReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Reports", href: "/mailchimp/reports" },
            { label: "Report", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Campaign Report</h1>
          <p className="text-muted-foreground">
            View detailed analytics and performance metrics for this campaign
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<CampaignReportSkeleton />}>
          <CampaignReportPageContent
            params={params}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignReportMetadata;
