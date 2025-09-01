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
import { ClientAudienceList } from "@/components/mailchimp/audiences/ClientAudienceList";
import { AudienceStats } from "@/components/mailchimp/audiences/AudienceStats";
import { getMailchimpService, type MailchimpList } from "@/services";
import type { AudienceStats as AudienceStatsType } from "@/types/mailchimp/audience";

interface AudiencesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
    search?: string;
    visibility?: string;
    sync_status?: string;
  }>;
}

async function AudiencesPageContent({ searchParams }: AudiencesPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Parse URL params
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.limit || "20");

  // Fetch data from API routes on server side
  let audiences: MailchimpList[] = [];
  let totalCount = 0;
  let stats: AudienceStatsType | null = null;
  let error: string | null = null;

  try {
    // Get Mailchimp service and fetch audiences directly
    const mailchimp = getMailchimpService();

    const params = {
      count: pageSize,
      offset: (currentPage - 1) * pageSize,
    };

    // Fetch audiences from Mailchimp service
    const response = await mailchimp.getLists(params);

    if (!response.success) {
      error = response.error || "Failed to load audiences";
    } else if (response.data) {
      const audienceData = response.data;

      // Use Mailchimp API response directly
      if (audienceData.lists) {
        audiences = audienceData.lists;
        totalCount = audienceData.total_items || audiences.length;
      }

      // Generate basic stats from the audience data
      const totalMembers = audiences.reduce(
        (sum: number, audience: MailchimpList) =>
          sum + (audience.stats?.member_count || 0),
        0,
      );
      stats = {
        total_audiences: totalCount,
        total_members: totalMembers,
        audiences_by_visibility: audiences.reduce(
          (counts: { pub: number; prv: number }, audience: MailchimpList) => {
            counts[audience.visibility] =
              (counts[audience.visibility] || 0) + 1;
            return counts;
          },
          { pub: 0, prv: 0 },
        ),
      };
    }
  } catch (err) {
    console.error("Failed to fetch audiences:", err);
    error = err instanceof Error ? err.message : "Failed to load audiences";
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
              <BreadcrumbPage>Audiences</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audiences</h1>
            <p className="text-muted-foreground">
              Manage your Mailchimp audiences and monitor their performance
            </p>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && <AudienceStats stats={stats} loading={false} />}

        {/* Main Content */}
        <ClientAudienceList
          audiences={audiences}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    </DashboardLayout>
  );
}

export default function AudiencesPage({ searchParams }: AudiencesPageProps) {
  return (
    <Suspense fallback={<div>Loading audience management...</div>}>
      <AudiencesPageContent searchParams={searchParams} />
    </Suspense>
  );
}
