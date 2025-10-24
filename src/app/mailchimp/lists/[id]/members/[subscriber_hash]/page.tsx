/**
 * Member Profile
 * Complete member profile with subscription details and engagement metrics
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]
 * @requires Mailchimp connection
 * @features Dynamic routing, Member profile, Subscription status, Engagement statistics, Tags and interests, Marketing permissions, Location data
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { MemberProfileSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { MemberProfileContent } from "@/components/mailchimp/lists/member-profile-content";
import { handleApiError, bc } from "@/utils";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { memberProfilePageParamsSchema } from "@/schemas/components/mailchimp/member-info-page-params";
import { generateMemberProfileMetadata } from "@/utils/metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}) {
  // Process route params
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberProfilePageParamsSchema.parse(rawParams);

  // Fetch data
  const response = await mailchimpDAL.fetchMemberInfo(id, subscriber_hash);

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
        title="Member Profile"
        description="Complete member profile with subscription details and engagement metrics"
        skeleton={<MemberProfileSkeleton />}
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
      title="Member Profile"
      description="Complete member profile with subscription details and engagement metrics"
      skeleton={<MemberProfileSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        <MemberProfileContent
          data={data}
          listId={id}
          subscriberHash={subscriber_hash}
        />
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
  const { id } = memberProfilePageParamsSchema.parse(rawParams);

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(id),
        bc.listMembers(id),
        bc.current("Member Profile"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata generation
export const generateMetadata = generateMemberProfileMetadata;
