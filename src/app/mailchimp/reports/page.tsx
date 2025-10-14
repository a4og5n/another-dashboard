/**
 * Mailchimp Reports Page
 * Displays reports with server-side data fetching
 *
 * Issue #140: Reports page implementation following App Router patterns
 * Based on ListsPage pattern with server-side URL cleanup and proper prop handling
 * Implements Next.js best practices for error handling and layout consistency
 */

import { BreadcrumbNavigation } from "@/components/layout";
import type { ReportsPageProps } from "@/types/components/mailchimp";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MailchimpEmptyState } from "@/components/mailchimp/mailchimp-empty-state";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { validateMailchimpConnection } from "@/lib/validate-mailchimp-connection";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { reportListParamsSchema } from "@/schemas/mailchimp";
import { reportsPageSearchParamsSchema } from "@/schemas/components";
import { transformCampaignReportsParams } from "@/utils/mailchimp/query-params";
import { ReportsOverviewSkeleton } from "@/skeletons/mailchimp";
import { processPageParams } from "@/utils/mailchimp/page-params";

async function ReportsPageContent({ searchParams }: ReportsPageProps) {
  // Process page parameters: validate, redirect if needed, convert to API format
  const { apiParams, currentPage, pageSize } = await processPageParams({
    searchParams,
    uiSchema: reportsPageSearchParamsSchema,
    apiSchema: reportListParamsSchema,
    basePath: "/mailchimp/reports",
    transformer: transformCampaignReportsParams,
  });

  // Get reports
  const response = await mailchimpDAL.fetchCampaignReports(apiParams);

  // Handle errors
  if (!response.success) {
    return (
      <ReportsOverview
        error={response.error || "Failed to load campaign reports"}
        data={null}
      />
    );
  }

  // Pass data to component
  return (
    <ReportsOverview
      data={response.data || null}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/api/auth/login?post_login_redirect_url=/mailchimp/reports");
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
            { label: "Reports", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your Mailchimp reports and their performance
            metrics
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<ReportsOverviewSkeleton />}>
          <ReportsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports | Mailchimp Dashboard",
  description:
    "View and analyze your Mailchimp reports and their performance metrics",
};
