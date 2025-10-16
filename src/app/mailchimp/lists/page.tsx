import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ListOverview } from "@/components/mailchimp/lists/list-overview";
import { ListOverviewSkeleton } from "@/skeletons/mailchimp";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import type { ListsPageProps } from "@/types/components/mailchimp";
import { listsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";
import { listsPageSearchParamsSchema } from "@/schemas/components";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { Suspense } from "react";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { bc } from "@/utils";

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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[bc.home, bc.mailchimp, bc.current("Lists")]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Lists</h1>
          <p className="text-muted-foreground">
            Manage your Mailchimp lists and monitor their performance
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<ListOverviewSkeleton />}>
          <ListsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lists | Mailchimp Dashboard",
  description: "Manage your Mailchimp lists and monitor their performance",
};
