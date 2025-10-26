/**
 * Segment Members
 * View members in this segment
 *
 * @route /mailchimp/lists/[id]/segments/[segment_id]/members
 * @requires Mailchimp connection
 * @features Dynamic routing, Pagination, Member filtering, Status tracking, VIP management, Engagement metrics
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { SegmentMembersSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { SegmentMembersContent } from "@/components/mailchimp/lists/segment-members-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { segmentMembersPageParamsSchema } from "@/schemas/components/mailchimp/segment-members-page-params";
import { segmentMembersQueryParamsSchema } from "@/schemas/mailchimp/lists/segments/members/params.schema";
import { segmentMembersRouteParamsSchema } from "@/schemas/components/mailchimp/segment-members-route-params";
import { generateSegmentMembersMetadata } from "@/utils/metadata";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; segment_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Process route params
  const rawParams = await params;
  const { id, segment_id } = segmentMembersRouteParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: segmentMembersPageParamsSchema,
    apiSchema: segmentMembersQueryParamsSchema,
    basePath: `/mailchimp/lists/${id}/segments/${segment_id}/members`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchSegmentMembers(
    id,
    segment_id,
    apiParams,
  );

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Segment Members"
      description="View members in this segment"
      skeleton={<SegmentMembersSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <SegmentMembersContent
            data={data}
            listId={id}
            segmentId={segment_id}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <DashboardInlineError error="Failed to load segment members" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string; segment_id: string }>;
}) {
  const rawParams = await params;
  const { id } = segmentMembersRouteParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listSegments(id),
        bc.current("Members"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata = generateSegmentMembersMetadata;
