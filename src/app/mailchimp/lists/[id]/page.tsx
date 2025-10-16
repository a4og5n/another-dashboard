/**
 * List Detail Page
 * Server component that fetches list data and displays detailed information
 *
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ListDetail } from "@/components/mailchimp/lists";
import { BreadcrumbNavigation, DashboardLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { ListDetailSkeleton } from "@/skeletons/mailchimp";
import {
  processRouteParams,
  getUserServerPrefix,
  handleApiError,
} from "@/utils";
import type { List } from "@/types/mailchimp";
import type { ListPageProps } from "@/types/components/mailchimp";
import {
  listPageParamsSchema,
  listPageSearchParamsSchema,
} from "@/schemas/components";

async function ListPageContent({
  validatedParams,
  activeTab,
}: {
  validatedParams: { id: string };
  activeTab: "overview" | "stats" | "settings";
}) {
  // Fetch server prefix for Mailchimp admin URL
  const serverPrefix = await getUserServerPrefix();

  // Fetch list data (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchList(validatedParams.id);

  // Handle API errors (automatically triggers notFound() for 404s)
  handleApiError(response);

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? (
        <ListDetail
          list={response.data as List}
          activeTab={activeTab}
          serverPrefix={serverPrefix}
        />
      ) : (
        <ListDetail
          list={null}
          error={response.error || "Failed to load list"}
          activeTab={activeTab}
          serverPrefix={serverPrefix}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default async function ListPage({
  params,
  searchParams,
}: ListPageProps) {
  // Validate route params and search params BEFORE Suspense boundary
  // This ensures notFound() is called at the page level
  const { validatedParams, validatedSearchParams } = await processRouteParams({
    params,
    searchParams,
    paramsSchema: listPageParamsSchema,
    searchParamsSchema: listPageSearchParamsSchema,
  });

  // Get active tab from search params (with default fallback)
  const activeTab = validatedSearchParams.tab;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Lists", href: "/mailchimp/lists" },
            { label: "List", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">List Details</h1>
          <p className="text-muted-foreground">
            View detailed information and performance metrics for this list
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<ListDetailSkeleton />}>
          <ListPageContent
            validatedParams={validatedParams}
            activeTab={activeTab}
          />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "List Details | Mailchimp Dashboard",
  description:
    "View detailed information and performance metrics for this list",
};
