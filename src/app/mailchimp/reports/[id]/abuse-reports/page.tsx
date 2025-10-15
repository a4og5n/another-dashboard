/**
 * Campaign Abuse Reports Page
 * Server component that displays abuse/spam complaints for a specific campaign
 *
 * Following Next.js 15 App Router patterns and established page structures
 * Pattern based on: src/app/mailchimp/reports/[id]/opens/page.tsx
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignAbuseReportsSkeleton } from "@/skeletons/mailchimp";
import { abuseReportsPageParamsSchema } from "@/schemas/components";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignAbuseReportsTable } from "@/components/dashboard/reports";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { AbuseReportListSuccess, CampaignReport } from "@/types/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import type { Metadata } from "next";

async function CampaignAbuseReportsPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Process route params
  const rawRouteParams = await params;
  const { id: campaignId } = abuseReportsPageParamsSchema.parse(rawRouteParams);

  // Fetch campaign abuse reports data
  // Note: This API endpoint does not support pagination parameters (count/offset)
  // All abuse reports are returned in a single response
  const response = await mailchimpDAL.fetchCampaignAbuseReports(campaignId);

  // Handle 404 errors with notFound()
  if (!response.success) {
    const errorMessage = response.error || "Failed to load abuse reports";
    if (
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("404")
    ) {
      notFound();
    }
  }

  const abuseReportsData = response.data as AbuseReportListSuccess;

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? (
        <CampaignAbuseReportsTable
          abuseReportsData={abuseReportsData}
          currentPage={1}
          pageSize={abuseReportsData.total_items}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/abuse-reports`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError
          error={response.error || "Failed to load abuse reports"}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default function CampaignAbuseReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation - params will be awaited inside Suspense */}
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Abuse Reports</h1>
          <p className="text-muted-foreground">
            Spam complaints and abuse reports for this campaign
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<CampaignAbuseReportsSkeleton />}>
          <CampaignAbuseReportsPageContent params={params} />
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
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        { label: "Dashboard", href: "/" },
        { label: "Mailchimp", href: "/mailchimp" },
        { label: "Reports", href: `/mailchimp/reports` },
        { label: "Report", href: `/mailchimp/reports/${id}` },
        { label: "Abuse Reports", isCurrent: true },
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
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Abuse Reports - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

  // Get abuse report count from the report data
  const abuseReportCount = report.abuse_reports || 0;

  return {
    title: `${report.campaign_title} - Abuse Reports`,
    description: `View abuse reports and spam complaints for ${report.campaign_title}. ${abuseReportCount === 0 ? "No abuse reports recorded." : `${abuseReportCount.toLocaleString()} ${abuseReportCount === 1 ? "report" : "reports"} received.`}`,
    openGraph: {
      title: `${report.campaign_title} - Abuse Reports`,
      description:
        abuseReportCount === 0
          ? `No abuse reports - Campaign sent to ${report.emails_sent.toLocaleString()} recipients`
          : `${abuseReportCount.toLocaleString()} abuse ${abuseReportCount === 1 ? "report" : "reports"} from ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}
