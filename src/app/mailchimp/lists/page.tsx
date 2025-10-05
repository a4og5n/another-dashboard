import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ListOverview } from "@/components/mailchimp/lists/list-overview";
import { ListOverviewSkeleton } from "@/skeletons/mailchimp";
import { MailchimpEmptyState } from "@/components/mailchimp/mailchimp-empty-state";
import type { ListsPageProps } from "@/types/components/mailchimp";
import { listsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";
import { listsPageSearchParamsSchema } from "@/schemas/components";
import { mailchimpService } from "@/services/mailchimp.service";
import { validateMailchimpConnection } from "@/lib/validate-mailchimp-connection";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { processPageParams } from "@/utils/mailchimp/page-params";

async function ListsPageContent({ searchParams }: ListsPageProps) {
  // Process params: validate, check redirect, convert to API format
  const { apiParams, currentPage, pageSize } = await processPageParams({
    searchParams,
    uiSchema: listsPageSearchParamsSchema,
    apiSchema: listsParamsSchema,
    basePath: "/mailchimp/lists",
  });

  // Fetch lists using API params
  const response = await mailchimpService.getLists(apiParams);

  // Handle errors
  if (!response.success) {
    return (
      <ListOverview
        error={response.error || "Failed to load lists"}
        data={null}
      />
    );
  }

  // Pass data to component
  return (
    <ListOverview
      data={response.data || null}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}

export default async function ListsPage({ searchParams }: ListsPageProps) {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/api/auth/login?post_login_redirect_url=/mailchimp/lists");
  }

  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  // 2. Check Mailchimp connection
  const connectionStatus = await validateMailchimpConnection();

  // 3. Show empty state if not connected
  if (!connectionStatus.isValid) {
    return (
      <DashboardLayout>
        <MailchimpEmptyState error={connectionStatus.error} />
      </DashboardLayout>
    );
  }

  // 4. Show connected page
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
