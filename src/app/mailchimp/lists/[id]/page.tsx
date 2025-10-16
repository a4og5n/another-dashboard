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
  bc,
} from "@/utils";
import type { List } from "@/types/mailchimp";
import type { ListPageProps } from "@/types/components/mailchimp";
import {
  listPageParamsSchema,
  listPageSearchParamsSchema,
} from "@/schemas/components";

function ListPageContent({
  list,
  error,
  activeTab,
  serverPrefix,
  errorCode,
}: {
  list: List | null;
  error?: string;
  activeTab: "overview" | "stats" | "settings";
  serverPrefix?: string;
  errorCode?: string;
}) {
  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      {list ? (
        <ListDetail
          list={list}
          activeTab={activeTab}
          serverPrefix={serverPrefix}
        />
      ) : (
        <ListDetail
          list={null}
          error={error || "Failed to load list"}
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

  // Fetch server prefix for Mailchimp admin URL
  const serverPrefix = await getUserServerPrefix();

  // Fetch list data BEFORE Suspense boundary
  // This ensures notFound() works properly for 404 responses
  const response = await mailchimpDAL.fetchList(validatedParams.id);

  // Handle API errors (automatically triggers notFound() for 404s)
  // Must be called BEFORE Suspense boundary
  handleApiError(response);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[bc.home, bc.mailchimp, bc.lists, bc.current("List")]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">List Details</h1>
          <p className="text-muted-foreground">
            View detailed information and performance metrics for this list
          </p>
        </div>

        {/* Main Content - Suspense only used for streaming */}
        <Suspense fallback={<ListDetailSkeleton />}>
          <ListPageContent
            list={response.success ? (response.data as List) : null}
            error={response.error}
            activeTab={activeTab}
            serverPrefix={serverPrefix ?? undefined}
            errorCode={response.errorCode}
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
