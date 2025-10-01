import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getRedirectUrlIfNeeded } from "@/utils/pagination-url-builders";
import { ListOverview } from "@/components/mailchimp/lists/ListOverview";
import { ListOverviewSkeleton } from "@/skeletons/mailchimp";
import type { ListsPageProps } from "@/types/mailchimp/lists-page-props";
import { ListsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";
import { mailchimpService } from "@/services/mailchimp.service";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function ListsPageContent({ searchParams }: ListsPageProps) {
  const params = await searchParams;

  // Server-side URL cleanup: redirect if default values are in URL
  const queryDefaults = ListsParamsSchema.parse({});
  const redirectUrl = getRedirectUrlIfNeeded({
    basePath: "/mailchimp/lists",
    currentPage: params.page,
    currentPerPage: params.perPage,
    defaultPerPage: queryDefaults.count,
  });

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  // Use service layer for better architecture
  const response = await mailchimpService.getLists(params);

  // Handle errors
  if (!response.success) {
    return (
      <ListOverview
        error={response.error || "Failed to load lists"}
        responseData={null}
      />
    );
  }

  // Parse pagination params for UI
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.perPage || queryDefaults.count.toString());

  // Pass data to component
  return (
    <ListOverview
      responseData={response.data || null}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}

export default function ListsPage({ searchParams }: ListsPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Lists", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lists</h1>
            <p className="text-muted-foreground">
              Manage your Mailchimp lists and monitor their performance
            </p>
          </div>
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
