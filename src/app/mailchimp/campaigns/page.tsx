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
import {
  campaignsListPageParamsSchema,
  type PageSearchParams,
} from "@/schemas/components/mailchimp/campaigns-list-page-params";
import { campaignsParamsSchema } from "@/schemas/mailchimp/campaigns/campaigns-params.schema";
import { generateCampaignsMetadata } from "@/utils/mailchimp/metadata";
import type { Metadata } from "next";
import { z } from "zod";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Infer API params type from schema
type CampaignsQueryParams = z.infer<typeof campaignsParamsSchema>;

/**
 * Transform UI params (camelCase) to API params (snake_case)
 */
function transformCampaignsParams(
  uiParams: PageSearchParams,
): Partial<CampaignsQueryParams> {
  const apiParams: Partial<CampaignsQueryParams> = {};

  // Transform pagination params
  if (uiParams.perPage) {
    apiParams.count = parseInt(uiParams.perPage);
  }
  if (uiParams.page) {
    const page = parseInt(uiParams.page);
    const perPage = uiParams.perPage ? parseInt(uiParams.perPage) : 10;
    apiParams.offset = (page - 1) * perPage;
  }

  // Transform sort params from camelCase to snake_case
  if (uiParams.sortField) {
    apiParams.sort_field = uiParams.sortField as "create_time" | "send_time";
  }
  if (uiParams.sortDir) {
    apiParams.sort_dir = uiParams.sortDir as "ASC" | "DESC";
  }

  return apiParams;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateCampaignsMetadata();
}

export default async function Page({ searchParams }: PageProps) {
  // Await searchParams to get the actual values
  const resolvedSearchParams = await searchParams;

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: campaignsListPageParamsSchema,
    apiSchema: campaignsParamsSchema,
    basePath: "/mailchimp/campaigns",
    transformer: transformCampaignsParams,
  });

  // Extract sort parameters from validated API params
  const sortField = apiParams.sort_field;
  const sortDirection = apiParams.sort_dir as "ASC" | "DESC" | undefined;

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
        sortField={sortField}
        sortDirection={sortDirection}
        searchParams={resolvedSearchParams}
      />
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
