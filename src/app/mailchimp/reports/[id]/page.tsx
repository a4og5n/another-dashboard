/**
 * Campaign Report Detail Page
 * Displays detailed analytics and metrics for a specific campaign report
 *
 * @route /mailchimp/reports/[id]
 * @requires Mailchimp connection
 * @features Dynamic routing, Tab navigation, Real-time metrics, Export data
 */

import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignReportDetail } from "@/components/dashboard";
import { PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignReportSkeleton } from "@/skeletons/mailchimp";
import {
  generateCampaignReportMetadata,
  processRouteParams,
  handleApiError,
  bc,
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
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.reports, bc.current("Report")]}
      title="Campaign Report"
      description="View detailed analytics and performance metrics for this campaign"
      skeleton={<CampaignReportSkeleton />}
    >
      <CampaignReportPageContent
        report={response.success ? (response.data as CampaignReport) : null}
        activeTab={activeTab}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignReportMetadata;
