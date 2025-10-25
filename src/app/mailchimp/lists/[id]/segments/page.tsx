/**
 * List Segments Page
 * Displays all segments for a specific list with filtering and pagination
 *
 * @route /mailchimp/lists/[id]/segments
 * @requires Kinde Auth + Mailchimp connection
 * @features Segment list, pagination, type filtering
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { ListSegmentsSkeleton } from "@/skeletons/mailchimp";
import { generateListSegmentsMetadata } from "@/utils/metadata";
import { ListSegmentsContent } from "@/components/mailchimp/lists/list-segments-content";
import { BreadcrumbNavigation } from "@/components/layout";
import { bc } from "@/utils/breadcrumbs";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import {
  listSegmentsPageRouteParamsSchema,
  listSegmentsPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/list-segments-page-params";
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export const generateMetadata = generateListSegmentsMetadata;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Breadcrumb component for segments page
 * Shows: Dashboard > Mailchimp > Lists > List > Segments
 */
async function SegmentsBreadcrumbs({ listId }: { listId: string }) {
  const response = await mailchimpDAL.fetchList(listId);

  if (!response.success || !response.data) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.lists,
          bc.list(listId),
          bc.current("Segments"),
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
        bc.current("Segments"),
      ]}
    />
  );
}

export default async function ListSegmentsPage({
  params,
  searchParams,
}: PageProps) {
  // Parse and validate route parameters
  const rawParams = await params;
  const { id: listId } = listSegmentsPageRouteParamsSchema.parse(rawParams);

  // Parse and validate search parameters
  const rawSearchParams = await searchParams;
  const { page, perPage } =
    listSegmentsPageSearchParamsSchema.parse(rawSearchParams);

  // Calculate offset for pagination
  const offset = (page - 1) * perPage;

  // Fetch segments from Mailchimp API
  const response = await mailchimpDAL.fetchListSegments(listId, {
    count: perPage,
    offset,
  });

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success ? response.data : null;

  return (
    <PageLayout
      title="List Segments"
      description="View and manage audience segments"
      breadcrumbsSlot={
        <Suspense>
          <SegmentsBreadcrumbs listId={listId} />
        </Suspense>
      }
      skeleton={<ListSegmentsSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <ListSegmentsContent
            segments={data.segments}
            listId={listId}
            currentPage={page}
            pageSize={perPage}
            totalItems={data.total_items}
          />
        ) : (
          <DashboardInlineError error="Failed to load list segments" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
