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
      title="Member Profile"
      description="Complete member profile with subscription details and engagement metrics"
      skeleton={<MemberProfileSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <MemberProfileContent
            data={data}
            listId={id}
            subscriberHash={subscriber_hash}
          />
        ) : (
          <DashboardInlineError error="Failed to load member profile" />
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
