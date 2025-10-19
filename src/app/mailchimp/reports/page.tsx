/**
 * Mailchimp Reports Page
 * Displays paginated list of campaign reports with filtering and search
 *
 * @route /mailchimp/reports
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data, Server-side URL cleanup
 */

import type { ReportsPageProps } from "@/types/components/mailchimp";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { reportListParamsSchema } from "@/schemas/mailchimp";
import { reportsPageSearchParamsSchema } from "@/schemas/components";
import { transformCampaignReportsParams } from "@/utils/mailchimp/query-params";
import { ReportsOverviewSkeleton } from "@/skeletons/mailchimp";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { bc } from "@/utils";
import { PageLayout } from "@/components/layout";

async function ReportsPageContent({ searchParams }: ReportsPageProps) {
  // Validate page parameters: validate, redirect if needed, convert to API format
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: reportsPageSearchParamsSchema,
    apiSchema: reportListParamsSchema,
    basePath: "/mailchimp/reports",
    transformer: transformCampaignReportsParams,
  });

  // Fetch reports (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchCampaignReports(apiParams);

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? (
        <ReportsOverview
          data={response.data || null}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      ) : (
        <ReportsOverview
          error={response.error || "Failed to load campaign reports"}
          data={null}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
      title="Reports"
      description="View and analyze your Mailchimp reports and their performance metrics"
      skeleton={<ReportsOverviewSkeleton />}
    >
      <ReportsPageContent searchParams={searchParams} />
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports | Fichaz",
  description:
    "View and analyze your Mailchimp reports and their performance metrics",
};
