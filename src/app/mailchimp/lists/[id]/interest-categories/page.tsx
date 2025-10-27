/**
 * Interest Categories Page
 * Displays subscription preference groups for a specific list
 *
 * @route /mailchimp/lists/[id]/interest-categories
 * @requires Kinde Auth + Mailchimp connection
 * @features Category list, pagination, type display, display order
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { InterestCategoriesSkeleton } from "@/skeletons/mailchimp";
import { generateListInterestCategoriesMetadata } from "@/utils/metadata";
import { InterestCategoriesContent } from "@/components/mailchimp/lists/interest-categories-content";
import { BreadcrumbNavigation } from "@/components/layout";
import { bc } from "@/utils/breadcrumbs";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import {
  listInterestCategoriesPageRouteParamsSchema,
  listInterestCategoriesPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/list-interest-categories-page-params";
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export const generateMetadata = generateListInterestCategoriesMetadata;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Breadcrumb component for interest categories page
 * Shows: Dashboard > Mailchimp > Lists > List > Interest Categories
 */
async function InterestCategoriesBreadcrumbs({ listId }: { listId: string }) {
  const response = await mailchimpDAL.fetchList(listId);

  if (!response.success || !response.data) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.lists,
          bc.list(listId),
          bc.current("Interest Categories"),
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
        bc.custom(response.data.name, `/mailchimp/lists/${listId}`),
        bc.current("Interest Categories"),
      ]}
    />
  );
}

export default async function ListInterestCategoriesPage({
  params,
  searchParams,
}: PageProps) {
  // Parse and validate route parameters
  const rawParams = await params;
  const { id: listId } =
    listInterestCategoriesPageRouteParamsSchema.parse(rawParams);

  // Parse and validate search parameters
  const rawSearchParams = await searchParams;
  const { page, perPage } =
    listInterestCategoriesPageSearchParamsSchema.parse(rawSearchParams);

  // Calculate offset for pagination
  const offset = (page - 1) * perPage;

  // Fetch interest categories from Mailchimp API
  const response = await mailchimpDAL.fetchListInterestCategories(listId, {
    count: perPage,
    offset,
  });

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success ? response.data : null;

  return (
    <PageLayout
      title="Interest Categories"
      description="Subscription preference groups for list members"
      breadcrumbsSlot={
        <Suspense>
          <InterestCategoriesBreadcrumbs listId={listId} />
        </Suspense>
      }
      skeleton={<InterestCategoriesSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <InterestCategoriesContent
            categories={data.categories}
            listId={listId}
            currentPage={page}
            pageSize={perPage}
            totalItems={data.total_items}
          />
        ) : (
          <DashboardInlineError error="Failed to load interest categories" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
