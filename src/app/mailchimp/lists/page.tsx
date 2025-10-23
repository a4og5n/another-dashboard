/**
 * Mailchimp Lists Page
 * Displays paginated list of Mailchimp audiences (lists) with filtering
 *
 * @route /mailchimp/lists
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data, Audience management
 */

import { ListOverview } from "@/components/mailchimp/lists/list-overview";
import { ListOverviewSkeleton } from "@/skeletons/mailchimp";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import type { ListsPageProps } from "@/types/components/mailchimp";
import { listsParamsSchema } from "@/schemas/mailchimp/lists/params.schema";
import { listsPageSearchParamsSchema } from "@/schemas/components";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { bc } from "@/utils";
import { PageLayout } from "@/components/layout";

async function ListsPageContent({ searchParams }: ListsPageProps) {
  // Validate params: validate, check redirect, convert to API format
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: listsPageSearchParamsSchema,
    apiSchema: listsParamsSchema,
    basePath: "/mailchimp/lists",
  });

  // Fetch lists (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchLists(apiParams);

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? (
        <ListOverview
          data={response.data || null}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      ) : (
        <ListOverview
          error={response.error || "Failed to load lists"}
          data={null}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default function ListsPage({ searchParams }: ListsPageProps) {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("Lists")]}
      title="Lists"
      description="Manage your Mailchimp lists and monitor their performance"
      skeleton={<ListOverviewSkeleton />}
    >
      <ListsPageContent searchParams={searchParams} />
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lists | Fichaz",
  description: "Manage your Mailchimp lists and monitor their performance",
};
