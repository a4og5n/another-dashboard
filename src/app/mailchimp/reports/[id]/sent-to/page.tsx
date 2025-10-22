/**
 * Campaign Recipients Page
 * Displays members who received a specific campaign
 *
 * @route /mailchimp/reports/[id]/sent-to
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Member details, Delivery status, A/B split tracking
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { CampaignRecipientsSkeleton } from "@/skeletons/mailchimp";
import { reportSentToPageParamsSchema } from "@/schemas/components/mailchimp/report-sent-to-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignRecipientsTable } from "@/components/mailchimp/reports/campaign-recipients-table";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import type { SentToSuccess } from "@/types/mailchimp/sent-to";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateCampaignRecipientsMetadata } from "@/utils/metadata";

async function CampaignRecipientsPageContent({
  recipientsData,
  campaignId,
  errorCode,
}: {
  recipientsData: SentToSuccess | null;
  campaignId: string;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {recipientsData ? (
        <CampaignRecipientsTable
          recipientsData={recipientsData}
          currentPage={1}
          pageSize={recipientsData.total_items}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl={`/mailchimp/reports/${campaignId}/sent-to`}
          campaignId={campaignId}
        />
      ) : (
        <DashboardInlineError error="Failed to load recipients data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function CampaignRecipientsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: campaignId } = reportSentToPageParamsSchema.parse(rawRouteParams);

  // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
  const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
  handleApiError(campaignResponse);

  // Fetch campaign recipients data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchCampaignSentTo(campaignId);

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const recipientsData = response.success
    ? (response.data as SentToSuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Campaign Recipients"
      description="Members who received this campaign"
      skeleton={<CampaignRecipientsSkeleton />}
    >
      <CampaignRecipientsPageContent
        recipientsData={recipientsData}
        campaignId={campaignId}
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
  const { id } = reportSentToPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(id),
        bc.current("Recipients"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateCampaignRecipientsMetadata;
