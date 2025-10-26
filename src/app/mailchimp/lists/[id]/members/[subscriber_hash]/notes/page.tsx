/**
 * Member Notes
 * View notes for a list member
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]/notes
 * @requires Mailchimp connection
 * @features Dynamic routing, Pagination, Note display
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { MemberNotesSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { MemberNotesContent } from "@/components/mailchimp/lists/member-notes-content";
import { handleApiError, bc } from "@/utils";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { memberNotesPageRouteParamsSchema } from "@/schemas/components/mailchimp/member-notes-page-params";
import { memberNotesPageSearchParamsSchema } from "@/schemas/components/mailchimp/member-notes-page-params";
import { memberNotesQueryParamsSchema } from "@/schemas/mailchimp/lists/member-notes/params.schema";
import { generateMemberNotesMetadata } from "@/utils/metadata";

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
    memberNotesPageRouteParamsSchema.parse(rawParams);

  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: memberNotesPageSearchParamsSchema,
    apiSchema: memberNotesQueryParamsSchema,
    basePath: `/mailchimp/lists/${id}/members/${subscriber_hash}/notes`,
  });

  // Fetch data
  const response = await mailchimpDAL.fetchMemberNotes(
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
      title="Member Notes"
      description="View notes for this member"
      skeleton={<MemberNotesSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <MemberNotesContent
            data={data}
            listId={id}
            subscriberHash={subscriber_hash}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <DashboardInlineError error="Failed to load member notes" />
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
    memberNotesPageRouteParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listMembers(id),
        bc.memberProfile(id, subscriber_hash),
        bc.current("Notes"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata = generateMemberNotesMetadata;
