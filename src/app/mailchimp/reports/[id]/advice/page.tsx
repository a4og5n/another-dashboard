/**
 * Campaign Advice Page
 * Displays feedback and recommendations to improve campaign performance
 *
 * @route /mailchimp/reports/[id]/advice
 * @requires Kinde Auth, Mailchimp connection
 * @features Dynamic routing, Campaign feedback, Performance recommendations
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation";
import { CampaignAdviceSkeleton } from "@/skeletons/mailchimp";
import { CampaignAdviceContent } from "@/components/mailchimp/reports/campaign-advice-content";
import { mailchimpDAL } from "@/dal";
import { handleApiError } from "@/utils/errors";
import { bc } from "@/utils/breadcrumbs";
import { generateCampaignAdviceMetadata } from "@/utils/mailchimp/metadata";

// Page params validation
interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = generateCampaignAdviceMetadata;

/**
 * Breadcrumb content component (async, requires campaign data)
 */
async function BreadcrumbContent({ campaignId }: { campaignId: string }) {
  const response = await mailchimpDAL.fetchCampaignReport(campaignId);
  const error = handleApiError(response);

  if (error) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.reports,
          bc.report(campaignId),
          bc.current("Advice"),
        ]}
      />
    );
  }

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(campaignId),
        bc.campaignAdvice(campaignId),
      ]}
    />
  );
}

export default async function CampaignAdvicePage({ params }: PageProps) {
  const { id: campaignId } = await params;

  // Fetch campaign advice data
  const response = await mailchimpDAL.fetchCampaignAdvice(campaignId);
  const error = handleApiError(response);

  if (error || !response.data) {
    notFound();
  }

  return (
    <PageLayout
      title="Campaign Advice"
      description="Feedback and recommendations to improve campaign performance"
      skeleton={<CampaignAdviceSkeleton />}
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent campaignId={campaignId} />
        </Suspense>
      }
    >
      <CampaignAdviceContent data={response.data} campaignId={campaignId} />
    </PageLayout>
  );
}
