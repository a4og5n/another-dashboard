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
import { mailchimpService } from "@/services/mailchimp.service";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import { getRedirectUrlIfNeeded } from "@/utils/pagination-url-builders";
import { PER_PAGE_OPTIONS } from "@/types/components/ui";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function ReportsPageContent({ searchParams }: ReportsPageProps) {
  const params = await searchParams;

  // Server-side URL cleanup: redirect if default values are in URL
  const defaultPageSize = PER_PAGE_OPTIONS[0];
  const redirectUrl = getRedirectUrlIfNeeded({
    basePath: "/mailchimp/reports",
    currentPage: params.page,
    currentPerPage: params.perPage,
    defaultPerPage: defaultPageSize,
  });

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  // Use service layer for better architecture
  const response = await mailchimpService.getCampaignReports(params);

  // Handle errors
  if (!response.success) {
    return (
      <ReportsOverview
        error={response.error || "Failed to load campaign reports"}
        data={null}
      />
    );
  }

  // Parse pagination params for UI
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.perPage || defaultPageSize.toString());

  // Pass data to component
  return (
    <ReportsOverview
      data={response.data || null}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              View and analyze your Mailchimp reports and their performance
              metrics
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Suspense fallback={<div>Loading reports...</div>}>
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
