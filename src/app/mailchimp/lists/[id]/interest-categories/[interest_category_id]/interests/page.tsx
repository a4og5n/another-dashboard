/**
 * Interests in Category Page
 * Displays individual interests within an interest category
 *
 * @route /mailchimp/lists/[id]/interest-categories/[interest_category_id]/interests
 * @requires Kinde Auth + Mailchimp connection
 * @features Pagination, subscriber counts, display order
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { InterestsSkeleton } from "@/skeletons/mailchimp";
import { InterestsInCategoryContent } from "@/components/mailchimp/lists/interests-in-category-content";
import { BreadcrumbNavigation } from "@/components/layout";
import { bc } from "@/utils/breadcrumbs";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import {
  listInterestsPageRouteParamsSchema,
  listInterestsPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/list-interests-page-params";
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

interface PageProps {
  params: Promise<{ id: string; interest_category_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Breadcrumb component for interests page
 * Shows: Dashboard > Mailchimp > Lists > List > Interest Categories > Interests
 */
async function InterestsBreadcrumbs({
  listId,
  categoryId: _categoryId,
}: {
  listId: string;
  categoryId: string;
}) {
  const listResponse = await mailchimpDAL.fetchList(listId);

  if (!listResponse.success || !listResponse.data) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.lists,
          bc.list(listId),
          bc.listInterestCategories(listId),
          bc.current("Interests"),
        ]}
      />
    );
  }

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.custom(listResponse.data.name, `/mailchimp/lists/${listId}`),
        bc.listInterestCategories(listId),
        bc.current("Interests"),
      ]}
    />
  );
}

export default async function ListInterestsPage({
  params,
  searchParams,
}: PageProps) {
  // Parse and validate route parameters
  const rawParams = await params;
  const { id: listId, interest_category_id: categoryId } =
    listInterestsPageRouteParamsSchema.parse(rawParams);

  // Parse and validate search parameters
  const rawSearchParams = await searchParams;
  const { page, perPage } =
    listInterestsPageSearchParamsSchema.parse(rawSearchParams);

  // Calculate API pagination params (0-indexed offset)
  const currentPage = page;
  const pageSize = perPage;
  const offset = (currentPage - 1) * pageSize;

  // Fetch interests data
  const response = await mailchimpDAL.fetchListInterests(listId, categoryId, {
    count: pageSize,
    offset,
  });

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <InterestsBreadcrumbs listId={listId} categoryId={categoryId} />
        </Suspense>
      }
      title="Interests in Category"
      description="Individual interests within an interest category"
      skeleton={<InterestsSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <InterestsInCategoryContent
            interests={data.interests}
            listId={listId}
            categoryId={categoryId}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={data.total_items}
          />
        ) : (
          <DashboardInlineError error="Failed to load interests data" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
