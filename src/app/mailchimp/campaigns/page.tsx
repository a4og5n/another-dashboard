/**
 * Mailchimp Campaigns Page
 * Displays campaigns with server-side data fetching
 *
 * Issue #140: Campaigns page implementation following App Router patterns
 * Based on reports/page.tsx pattern with server-side data fetching
 * Implements error handling, breadcrumbs, and layout consistency
 */

import { Suspense } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ReportsOverviewClient } from "@/components/dashboard/reports-overview-client";
import { getMailchimpService, type MailchimpCampaignReport } from "@/services";

interface CampaignsPageProps {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    type?: string;
    before_send_time?: string;
    since_send_time?: string;
  }>;
}

async function CampaignsPageContent({ searchParams }: CampaignsPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Parse URL params with validation
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const perPage = Math.max(1, parseInt(params.perPage || "10"));

  // Per-page options for selector
  const perPageOptions = [10, 20, 50];
  const reportType = params.type;
  const beforeSendTime = params.before_send_time;
  const sinceSendTime = params.since_send_time;

  // Fetch data from Mailchimp service on server side
  let reports: MailchimpCampaignReport[] = [];
  let totalCount = 0;
  let error: string | null = null;

  try {
    // Get Mailchimp service and fetch reports directly
    const mailchimp = getMailchimpService();

    const serviceParams = {
      count: perPage,
      offset: (currentPage - 1) * perPage,
      ...(reportType && { type: reportType }),
      ...(beforeSendTime && { before_send_time: beforeSendTime }),
      ...(sinceSendTime && { since_send_time: sinceSendTime }),
    };

    // Fetch campaign reports from Mailchimp service
    const response = await mailchimp.getCampaignReports(serviceParams);

    if (!response.success) {
      error = response.error || "Failed to load campaign reports";
    } else if (response.data) {
      const reportsData = response.data;

      // Use Mailchimp API response directly
      if (reportsData.reports) {
        reports = reportsData.reports;
        totalCount = reportsData.total_items || reports.length;
      }
    }
  } catch (err) {
    console.error("Failed to fetch campaign reports:", err);
    error =
      err instanceof Error ? err.message : "Failed to load campaign reports";
  }

  // Handle error state
  if (error) {
    return (
      <DashboardLayout>
        <DashboardError
          error={error}
          onRetry={() => window.location.reload()}
          onGoHome={() => (window.location.href = "/mailchimp")}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mailchimp">Mailchimp</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Campaigns</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Header */}
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              View and analyze your Mailchimp campaigns and their performance
              metrics
            </p>
          </div>
        </div>{" "}
        {/* Reports Overview */}
        <ReportsOverviewClient
          reports={reports}
          loading={false}
          error={error}
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(totalCount / perPage))}
          perPage={perPage}
          perPageOptions={perPageOptions}
          reportType={reportType}
          beforeSendTime={beforeSendTime}
          sinceSendTime={sinceSendTime}
        />
      </div>
    </DashboardLayout>
  );
}

export default function CampaignsPage({ searchParams }: CampaignsPageProps) {
  return (
    <Suspense fallback={<div>Loading campaigns...</div>}>
      <CampaignsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
