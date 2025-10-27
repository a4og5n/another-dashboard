/**
 * Member Goals
 * View goal events for a list member
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]/goals
 * @requires Mailchimp connection
 * @features Dynamic routing, Pagination, Goal events display
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { MemberGoalsSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { MemberGoalsContent } from "@/components/mailchimp/lists/member-goals-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { memberGoalsPageRouteParamsSchema } from "@/schemas/components/mailchimp/member-goals-page-params";
import { memberGoalsPageSearchParamsSchema } from "@/schemas/components/mailchimp/member-goals-page-params";
import { memberGoalsQueryParamsSchema } from "@/schemas/mailchimp/lists/member-goals/params.schema";
import { generateMemberGoalsMetadata } from "@/utils/metadata";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Process route params
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberGoalsPageRouteParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: memberGoalsPageSearchParamsSchema,
    apiSchema: memberGoalsQueryParamsSchema,
    basePath: `/mailchimp/lists/${id}/members/${subscriber_hash}/goals`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchMemberGoals(
    id,
    subscriber_hash,
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
      title="Member Goals"
      description="View goal events for this member"
      skeleton={<MemberGoalsSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <MemberGoalsContent
            data={data}
            listId={id}
            subscriberHash={subscriber_hash}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <DashboardInlineError error="Failed to load member goals" />
        )}
      </MailchimpConnectionGuard>
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
    memberGoalsPageRouteParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listMembers(id),
        bc.memberProfile(id, subscriber_hash),
        bc.current("Goals"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata = generateMemberGoalsMetadata;
