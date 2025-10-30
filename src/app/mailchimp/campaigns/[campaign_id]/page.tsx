/**
 * Campaign Details
 * View detailed information about this campaign
 *
 * @route /mailchimp/campaigns/[campaign_id]
 * @requires Mailchimp connection
 * @features Campaign settings and configuration, Recipient information, Performance metrics, Tracking options, RSS options (if applicable), A/B split options (if applicable), Links to campaign reports
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { CampaignDetailSkeleton } from "@/skeletons/mailchimp/CampaignDetailSkeleton";
import { campaignDetailPageParamsSchema } from "@/schemas/components/mailchimp/campaign-detail-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { CampaignDetailContent } from "@/components/mailchimp/campaigns/campaign-detail-content";
import { handleApiError, bc } from "@/utils";
import { generateCampaignDetailMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ campaign_id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Process route params
  const rawParams = await params;
  const validatedParams = campaignDetailPageParamsSchema.parse(rawParams);
  const { campaign_id } = validatedParams;

  // Fetch data
  const response = await mailchimpDAL.fetchCampaign(campaign_id);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent data={data} />
        </Suspense>
      }
      title="Campaign Details"
      description="Complete campaign information including settings, recipients, and performance metrics"
      skeleton={<CampaignDetailSkeleton />}
    >
      {data ? (
        <CampaignDetailContent data={data} errorCode={response.errorCode} />
      ) : (
        <div className="text-center text-muted-foreground">
          Failed to load campaign details
        </div>
      )}
    </PageLayout>
  );
}

async function BreadcrumbContent({
  data,
}: {
  data: { settings?: { title?: string } } | null | undefined;
}) {
  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.campaigns,
        bc.current(data?.settings?.title || "Loading..."),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata
export const metadata: Metadata = generateCampaignDetailMetadata();
