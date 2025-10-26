/**
 * Member Tags
 * View and manage tags assigned to a list member
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]/tags
 * @requires Mailchimp connection
 * @features Dynamic routing, Pagination, Tag management, Tag display
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { MemberTagsSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { MemberTagsContent } from "@/components/mailchimp/lists/member-tags-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { memberTagsPageRouteParamsSchema } from "@/schemas/components/mailchimp/member-tags-page-params";
import { memberTagsPageSearchParamsSchema } from "@/schemas/components/mailchimp/member-tags-page-params";
import { memberTagsQueryParamsSchema } from "@/schemas/mailchimp/lists/member-tags/params.schema";
import { generateMemberTagsMetadata } from "@/utils/metadata";

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
    memberTagsPageRouteParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: memberTagsPageSearchParamsSchema,
    apiSchema: memberTagsQueryParamsSchema,
    basePath: `/mailchimp/lists/${id}/members/${subscriber_hash}/tags`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchMemberTags(
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
      title="Member Tags"
      description="View and manage tags assigned to this member"
      skeleton={<MemberTagsSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <MemberTagsContent
            data={data}
            listId={id}
            subscriberHash={subscriber_hash}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <DashboardInlineError error="Failed to load member tags" />
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
    memberTagsPageRouteParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listMembers(id),
        bc.memberProfile(id, subscriber_hash),
        bc.current("Tags"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata = generateMemberTagsMetadata;
