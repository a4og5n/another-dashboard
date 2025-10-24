/**
 * List Members
 * View and manage members in this list
 *
 * @route /mailchimp/lists/[id]/members
 * @requires Mailchimp connection
 * @features Dynamic routing, Pagination, Member filtering, Status tracking, VIP management, Engagement metrics
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { ListMembersSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ListMembersContent } from "@/components/mailchimp/lists/list-members-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { listMembersPageParamsSchema } from "@/schemas/components/mailchimp/list-members-page-params";
import { listMembersQueryParamsSchema } from "@/schemas/mailchimp/lists/members/params.schema";
import { listPageParamsSchema } from "@/schemas/components/mailchimp/list-page-params";
import type { GenerateMetadata } from "@/types/components/metadata";
import { generateListMembersMetadata } from "@/utils/metadata";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Process route params
  const rawParams = await params;
  const { id } = listPageParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: listMembersPageParamsSchema,
    apiSchema: listMembersQueryParamsSchema,
    basePath: `/mailchimp/lists/${id}/members`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchListMembers(id, apiParams);

  // Handle API errors (notFound() for 404s, returns error message for others)
  const error = handleApiError(response);
  if (error) {
    return (
      <PageLayout
        breadcrumbsSlot={
          <Suspense fallback={null}>
            <BreadcrumbContent params={params} />
          </Suspense>
        }
        title="List Members"
        description="View and manage members in this list"
        skeleton={<ListMembersSkeleton />}
      >
        <MailchimpConnectionGuard errorCode={response.errorCode}>
          <DashboardInlineError error={error} />
        </MailchimpConnectionGuard>
      </PageLayout>
    );
  }

  const data = response.data!;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="List Members"
      description="View and manage members in this list"
      skeleton={<ListMembersSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        <ListMembersContent
          data={data}
          listId={id}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}

async function BreadcrumbContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawParams = await params;
  const { id } = listPageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.current("Members"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata: GenerateMetadata = generateListMembersMetadata;
