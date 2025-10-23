/**
 * List Activity
 * Recent list activity timeline
 *
 * @route /mailchimp/lists/[id]/activity
 * @requires Mailchimp connection
 * @features Dynamic routing, Activity timeline, Subscription tracking, Pagination
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { ListActivitySkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ListActivityContent } from "@/components/mailchimp/lists/list-activity-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import {
  listActivityPageParamsSchema,
  pageSearchParamsSchema,
} from "@/schemas/components/mailchimp/list-activity-page-params";
import { listActivityQueryParamsSchema } from "@/schemas/mailchimp/lists/activity/params.schema";
import { generateListActivityMetadata } from "@/utils/metadata";
import type { ListActivityResponse } from "@/types/mailchimp";

// Metadata generation
export const generateMetadata = generateListActivityMetadata;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Process route params
  const rawParams = await params;
  const { id: listId } = listActivityPageParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: pageSearchParamsSchema,
    apiSchema: listActivityQueryParamsSchema,
    basePath: `/mailchimp/lists/${listId}/activity`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchListActivity(listId, apiParams);

  // Handle API errors
  const error = handleApiError(response);
  if (error || !response.data) {
    notFound();
  }

  const data = response.data as ListActivityResponse;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent listId={listId} />
        </Suspense>
      }
      title="List Activity"
      description="Recent list activity timeline"
      skeleton={<ListActivitySkeleton />}
    >
      <ListActivityContent
        data={data}
        listId={listId}
        currentPage={currentPage}
        pageSize={pageSize}
      />
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
          bc.current("Activity"),
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
        bc.listActivity(listId),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
