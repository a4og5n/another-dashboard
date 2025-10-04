/**
 * Campaign Report Detail Page
 * Server component that fetches campaign report data and displays detailed analytics
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { mailchimpService } from "@/services/mailchimp.service";
import {
  CampaignReportDetail,
  CampaignReportLoading,
} from "@/components/dashboard";
import type { CampaignReport } from "@/types/mailchimp";

import { generateCampaignReportMetadata } from "@/utils";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import type { ReportPageProps } from "@/types/components/mailchimp";

async function CampaignReportPageContent({
  params,
  searchParams,
}: ReportPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  // Get active tab from search params
  const validTabs = ["overview", "details"];
  const tabFromUrl = resolvedSearchParams.tab;
  const activeTab =
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "overview";

  // Fetch campaign report data
  const response = await mailchimpService.getCampaignReport(id);

  // Handle error states - pass to component for contextual error display
  if (!response.success) {
    return (
      <CampaignReportDetail
        report={null}
        error={response.error || "Failed to load campaign report"}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaign Report</h1>
            <p className="text-muted-foreground">
              View detailed analytics and performance metrics for this campaign
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Suspense fallback={<CampaignReportLoading />}>
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
