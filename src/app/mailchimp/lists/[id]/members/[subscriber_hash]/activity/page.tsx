/**
 * Member Activity Page
 * Displays activity feed for a specific list member
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]/activity
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Activity feed, Activity type filtering
 */

import { Suspense } from "react";
import { BreadcrumbNavigation, PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { MemberActivitySkeleton } from "@/skeletons/mailchimp";
import {
  memberActivityPageRouteParamsSchema,
  memberActivityPageSearchParamsSchema,
} from "@/schemas/components/mailchimp/member-activity-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { MemberActivityContent } from "@/components/mailchimp/lists/member-activity-content";
import type { MemberActivitySuccess } from "@/types/mailchimp/member-activity";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { handleApiError, bc } from "@/utils";
import { generateMemberActivityMetadata } from "@/utils/metadata";
import { memberActivityQueryParamsSchema } from "@/schemas/mailchimp/lists/members/[subscriber_hash]/activity/params.schema";
import { validatePageParams } from "@/utils/mailchimp/page-params";

async function MemberActivityPageContent({
  memberActivityData,
  listId,
  subscriberHash,
  currentPage,
  pageSize,
  errorCode,
}: {
  memberActivityData: MemberActivitySuccess | null;
  listId: string;
  subscriberHash: string;
  currentPage: number;
  pageSize: number;
  errorCode?: string;
}) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {memberActivityData ? (
        <MemberActivityContent
          data={memberActivityData}
          listId={listId}
          subscriberHash={subscriberHash}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      ) : (
        <DashboardInlineError error="Failed to load member activity data" />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function MemberActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
  searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
  // Process route params (BEFORE Suspense boundary)
  const rawRouteParams = await params;
  const { id: listId, subscriber_hash: subscriberHash } =
    memberActivityPageRouteParamsSchema.parse(rawRouteParams);

  // Validate member exists first (BEFORE Suspense boundary for 404 handling)
  const memberResponse = await mailchimpDAL.fetchMemberInfo(
    listId,
    subscriberHash,
  );
  handleApiError(memberResponse);

  // Validate page params with redirect handling (BEFORE Suspense boundary)
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: memberActivityPageSearchParamsSchema,
    apiSchema: memberActivityQueryParamsSchema,
    basePath: `/mailchimp/lists/${listId}/members/${subscriberHash}/activity`,
  });

  // Fetch member activity data (BEFORE Suspense boundary)
  const response = await mailchimpDAL.fetchMemberActivity(
    listId,
    subscriberHash,
    apiParams,
  );

  // Handle API errors (BEFORE Suspense boundary)
  handleApiError(response);

  const memberActivityData = response.success
    ? (response.data as MemberActivitySuccess)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="Member Activity"
      description="Activity feed for this member"
      skeleton={<MemberActivitySkeleton />}
    >
      <MemberActivityPageContent
        memberActivityData={memberActivityData}
        listId={listId}
        subscriberHash={subscriberHash}
        currentPage={currentPage}
        pageSize={pageSize}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}) {
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberActivityPageRouteParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listMember(id, subscriber_hash),
        bc.current("Activity"),
      ]}
    />
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page
export const generateMetadata = generateMemberActivityMetadata;
