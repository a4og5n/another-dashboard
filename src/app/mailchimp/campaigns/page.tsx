/**
 * Campaigns
 * View and manage all your Mailchimp marketing campaigns
 *
 * @route /mailchimp/campaigns
 * @requires Mailchimp connection
 * @features Campaign status tracking, Performance metrics, Filter by type, status, and list, Pagination and sorting
 */

import { PageLayout } from "@/components/layout";
import { CampaignsSkeleton } from "@/skeletons/mailchimp";
import { CampaignsContent } from "@/components/mailchimp/campaigns/campaigns-content";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { campaignsListPageParamsSchema } from "@/schemas/components/mailchimp/campaigns-list-page-params";
import { campaignsParamsSchema } from "@/schemas/mailchimp/campaigns/campaigns-params.schema";
import { generateCampaignsMetadata } from "@/utils/mailchimp/metadata";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateCampaignsMetadata();
}

export default async function Page({ searchParams }: PageProps) {
  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: campaignsListPageParamsSchema,
    apiSchema: campaignsParamsSchema,
    basePath: "/mailchimp/campaigns",
  });

  // Fetch data
  const response = await mailchimpDAL.fetchCampaigns(apiParams);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;
  const campaigns = data?.campaigns ?? [];
  const totalItems = data?.total_items ?? 0;

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.campaigns]}
      title="Campaigns"
      description="View and manage all your Mailchimp marketing campaigns"
      skeleton={<CampaignsSkeleton />}
    >
      <CampaignsContent
        campaigns={campaigns}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
