/**
 * Landing Pages
 * View and track your Mailchimp landing pages
 *
 * @route /mailchimp/landing-pages
 * @requires Mailchimp connection
 * @features Pagination, Status badges, Performance metrics, Sort by date
 */

import { PageLayout } from "@/components/layout";
import { LandingPagesSkeleton } from "@/skeletons/mailchimp";
import { landingPagesQueryParamsSchema } from "@/schemas/mailchimp/landing-pages/landing-pages-params.schema";
import {
  pageSearchParamsSchema,
  type PageSearchParams,
} from "@/schemas/components/mailchimp/landing-pages-list-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { LandingPagesContent } from "@/components/mailchimp/landing-pages/landing-pages-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
import { generateLandingPagesMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import { z } from "zod";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Infer API params type from schema
type LandingPagesQueryParams = z.infer<typeof landingPagesQueryParamsSchema>;

/**
 * Transform UI params (camelCase) to API params (snake_case)
 * Note: Landing Pages API does NOT support offset pagination - only count
 */
function transformLandingPagesParams(
  uiParams: PageSearchParams,
): Partial<LandingPagesQueryParams> {
  const apiParams: Partial<LandingPagesQueryParams> = {};

  // Transform pagination (count only - no offset support)
  if (uiParams.perPage) {
    apiParams.count = parseInt(uiParams.perPage);
  }

  // Transform sort params from camelCase to snake_case
  if (uiParams.sortField) {
    // Map camelCase to snake_case
    const fieldMap: Record<string, "created_at" | "updated_at"> = {
      createdAt: "created_at",
      updatedAt: "updated_at",
    };
    apiParams.sort_field =
      fieldMap[uiParams.sortField] ||
      (uiParams.sortField as "created_at" | "updated_at");
  }
  if (uiParams.sortDir) {
    apiParams.sort_dir = uiParams.sortDir as "ASC" | "DESC";
  }

  return apiParams;
}

export default async function Page({ searchParams }: PageProps) {
  // Await searchParams to get the actual values
  const resolvedSearchParams = await searchParams;

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: landingPagesQueryParamsSchema,
    basePath: "/mailchimp/landing-pages",
    transformer: transformLandingPagesParams,
  });

  // Extract sort parameters from validated API params
  const sortField = apiParams.sort_field;
  const sortDirection = apiParams.sort_dir as "ASC" | "DESC" | undefined;

  // Fetch data
  const response = await mailchimpDAL.fetchLandingPages(apiParams);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.landingPages]}
      title="Landing Pages"
      description="View and track your Mailchimp landing pages"
      skeleton={<LandingPagesSkeleton />}
    >
      {data ? (
        <LandingPagesContent
          landingPagesData={data}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[...PER_PAGE_OPTIONS]}
          baseUrl="/mailchimp/landing-pages"
          sortField={sortField}
          sortDirection={sortDirection}
          searchParams={resolvedSearchParams}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          Failed to load landing pages
        </div>
      )}
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata
export const metadata: Metadata = generateLandingPagesMetadata();
