/**
 * Campaign Report Detail Page
 * Server component that fetches campaign report data and displays detailed analytics
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignReportDetail } from "@/components/dashboard";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignReportSkeleton } from "@/skeletons/mailchimp";
import {
  generateCampaignReportMetadata,
  processRouteParams,
  handleApiError,
} from "@/utils";
import type { CampaignReport } from "@/types/mailchimp";
import type { ReportPageProps } from "@/types/components/mailchimp";
import {
  reportPageParamsSchema,
  reportPageSearchParamsSchema,
} from "@/schemas/components";

async function CampaignReportPageContent({
  report,
  activeTab,
  errorCode,
}: {
  report: CampaignReport | null;
  activeTab: string;
  errorCode?: string;
}) {
  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {report ? (
        <CampaignReportDetail report={report} activeTab={activeTab} />
      ) : (
        <CampaignReportDetail
          report={null}
          error="Failed to load campaign report"
          activeTab={activeTab}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  // Validate route params and search params (BEFORE Suspense boundary)
  const { validatedParams, validatedSearchParams } = await processRouteParams({
    params,
    searchParams,
    paramsSchema: reportPageParamsSchema,
    searchParamsSchema: reportPageSearchParamsSchema,
  });

  // Get active tab from search params (with default fallback)
  const activeTab = validatedSearchParams.tab;

  // Fetch campaign report data (BEFORE Suspense boundary for 404 handling)
  const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

  // Handle API errors - triggers notFound() for 404s (BEFORE Suspense boundary)
  handleApiError(response);

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
            report={response.success ? (response.data as CampaignReport) : null}
            activeTab={activeTab}
            errorCode={response.errorCode}
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
