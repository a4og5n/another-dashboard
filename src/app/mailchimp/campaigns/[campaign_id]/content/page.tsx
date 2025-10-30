/**
 * Campaign Content
 * Preview campaign HTML and plain-text content
 *
 * @route /mailchimp/campaigns/[campaign_id]/content
 * @requires Mailchimp connection
 * @features HTML content preview, Plain-text version display, Archive HTML view, Variate content support (multivariate campaigns), Content sanitization and security, Responsive display
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignContentContent } from "@/components/mailchimp/campaigns/campaign-content-content";
import { handleApiError, bc } from "@/utils";
import { campaignContentPageParamsSchema } from "@/schemas/components/mailchimp/campaign-content-page-params";
import type { Metadata } from "next";
import { generateCampaignContentMetadata } from "@/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const validatedParams = campaignContentPageParamsSchema.parse(rawParams);
  return generateCampaignContentMetadata(validatedParams.campaign_id);
}

export default async function Page({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}) {
  // Process route params
  const rawParams = await params;
  const { campaign_id } = campaignContentPageParamsSchema.parse(rawParams);

  // Fetch data
  const response = await mailchimpDAL.fetchCampaignContent(campaign_id);

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
        title="Campaign Content"
        description="Preview campaign HTML and plain-text content"
        skeleton={<div>Loading...</div>}
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
      title="Campaign Content"
      description="Preview campaign HTML and plain-text content"
      skeleton={<div>Loading...</div>}
    >
      <CampaignContentContent data={data} errorCode={response.errorCode} />
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ campaign_id: string }>;
}) {
  const rawParams = await params;
  const { campaign_id } = campaignContentPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.campaigns,
        bc.campaign(campaign_id),
        bc.current("Content"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
