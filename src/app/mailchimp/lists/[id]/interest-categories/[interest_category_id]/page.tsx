/**
 * Interest Category Info Page
 * Displays details for a specific interest category
 *
 * @route /mailchimp/lists/[id]/interest-categories/[interest_category_id]
 * @requires Kinde Auth + Mailchimp connection
 * @features Dynamic routing, Category details, Type display
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { InterestCategoryInfoSkeleton } from "@/skeletons/mailchimp";
import { generateInterestCategoryInfoMetadata } from "@/utils/metadata";
import { InterestCategoryInfoContent } from "@/components/mailchimp/lists/interest-category-info-content";
import { BreadcrumbNavigation } from "@/components/layout";
import { bc } from "@/utils/breadcrumbs";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import {
  interestCategoryInfoPageRouteParamsSchema,
  interestCategoryInfoPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/interest-category-info-page-params";
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export const generateMetadata = generateInterestCategoryInfoMetadata;

interface PageProps {
  params: Promise<{ id: string; interest_category_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Breadcrumb component for interest category info page
 * Shows: Dashboard > Mailchimp > Lists > List > Interest Categories > Category Info
 */
async function InterestCategoryInfoBreadcrumbs({
  listId,
  categoryId,
}: {
  listId: string;
  categoryId: string;
}) {
  // Fetch list data for list name
  const listResponse = await mailchimpDAL.fetchList(listId);

  // Fetch category data for category title
  const categoryResponse = await mailchimpDAL.fetchInterestCategoryInfo(
    listId,
    categoryId,
  );

  const listName = listResponse.success
    ? listResponse.data?.name || "List"
    : "List";
  const categoryTitle = categoryResponse.success
    ? categoryResponse.data?.title || "Category"
    : "Category";

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.custom(listName, `/mailchimp/lists/${listId}`),
        bc.custom(
          "Interest Categories",
          `/mailchimp/lists/${listId}/interest-categories`,
        ),
        bc.current(categoryTitle),
      ]}
    />
  );
}

export default async function InterestCategoryInfoPage({
  params,
  searchParams,
}: PageProps) {
  // Parse and validate route parameters
  const rawParams = await params;
  const { id: listId, interest_category_id: categoryId } =
    interestCategoryInfoPageRouteParamsSchema.parse(rawParams);

  // Parse and validate search parameters (none for this detail page)
  const rawSearchParams = await searchParams;
  interestCategoryInfoPageSearchParamsSchema.parse(rawSearchParams);

  // Fetch interest category info from Mailchimp API
  const response = await mailchimpDAL.fetchInterestCategoryInfo(
    listId,
    categoryId,
  );

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success ? response.data : null;

  return (
    <PageLayout
      title="Interest Category Info"
      description="Details for a specific interest category"
      breadcrumbsSlot={
        <Suspense>
          <InterestCategoryInfoBreadcrumbs
            listId={listId}
            categoryId={categoryId}
          />
        </Suspense>
      }
      skeleton={<InterestCategoryInfoSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <InterestCategoryInfoContent category={data} listId={listId} />
        ) : (
          <DashboardInlineError error="Failed to load interest category info" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
