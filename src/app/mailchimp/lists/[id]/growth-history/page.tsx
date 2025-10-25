/**
 * List Growth History
 * Historical growth data showing list size over time
 *
 * @route /mailchimp/lists/[id]/growth-history
 * @requires Mailchimp connection
 * @features Dynamic routing, Monthly growth tracking, Subscriber trends, Pagination
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { ListGrowthHistorySkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ListGrowthHistoryContent } from "@/components/mailchimp/lists/list-growth-history-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import {
  listGrowthHistoryPageParamsSchema,
  pageSearchParamsSchema,
} from "@/schemas/components/mailchimp/list-growth-history-page-params";
import { growthHistoryQueryParamsSchema } from "@/schemas/mailchimp/lists/growth-history/params.schema";
import { generateListGrowthHistoryMetadata } from "@/utils/metadata";
import type { GrowthHistoryResponse } from "@/types/mailchimp";

// Metadata generation
export const generateMetadata = generateListGrowthHistoryMetadata;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Process route params
  const rawParams = await params;
  const { id: listId } = listGrowthHistoryPageParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: growthHistoryQueryParamsSchema,
    basePath: `/mailchimp/lists/${listId}/growth-history`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchListGrowthHistory(listId, apiParams);

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success
    ? (response.data as GrowthHistoryResponse)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent listId={listId} />
        </Suspense>
      }
      title="List Growth History"
      description="Historical growth data showing list size over time"
      skeleton={<ListGrowthHistorySkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <ListGrowthHistoryContent
            data={data}
            listId={listId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <DashboardInlineError error="Failed to load growth history" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}

async function BreadcrumbContent({ listId }: { listId: string }) {
  const response = await mailchimpDAL.fetchList(listId);
  const error = handleApiError(response);

  if (error) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.lists,
          bc.list(listId),
          bc.current("Growth History"),
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
        bc.list(listId),
        bc.listGrowthHistory(listId),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
