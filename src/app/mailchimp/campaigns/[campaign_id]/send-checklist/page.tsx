/**
 * Campaign Send Checklist
 * Review pre-send validation checklist to ensure campaign is ready
 *
 * @route /mailchimp/campaigns/[campaign_id]/send-checklist
 * @requires Mailchimp connection
 * @features Overall campaign readiness status, Individual validation checks (subject, content, recipients), Error and warning indicators, Detailed issue descriptions, Pre-send verification workflow
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { SendChecklistContent } from "@/components/mailchimp/campaigns/send-checklist-content";
import { handleApiError, bc } from "@/utils";
import { sendChecklistPageParamsSchema } from "@/schemas/components/mailchimp/campaign-send-checklist-page-params";
import { CampaignSendChecklistSkeleton } from "@/skeletons/mailchimp";
import type { Metadata } from "next";
import { generateSendChecklistMetadata } from "@/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const validatedParams = sendChecklistPageParamsSchema.parse(rawParams);
  return generateSendChecklistMetadata(validatedParams.campaign_id);
}

export default async function Page({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}) {
  // Process route params
  const rawParams = await params;
  const { campaign_id } = sendChecklistPageParamsSchema.parse(rawParams);

  // Fetch data
  const response = await mailchimpDAL.fetchCampaignSendChecklist(campaign_id);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  if (!data) {
    return (
      <PageLayout
        breadcrumbsSlot={
          <Suspense fallback={null}>
            <BreadcrumbContent params={params} />
          </Suspense>
        }
        title="Send Checklist"
        description="Review pre-send validation checklist to ensure campaign is ready"
        skeleton={<CampaignSendChecklistSkeleton />}
      >
        <div>No data available</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Send Checklist"
      description="Review pre-send validation checklist to ensure campaign is ready"
      skeleton={<CampaignSendChecklistSkeleton />}
    >
      <SendChecklistContent data={data} errorCode={response.errorCode} />
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}) {
  const rawParams = await params;
  const { campaign_id } = sendChecklistPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.campaigns,
        bc.campaign(campaign_id),
        bc.current("Send Checklist"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
