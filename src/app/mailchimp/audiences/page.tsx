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
import { getMailchimpService } from "@/services";
import type {
  AudienceQueryFilters,
} from "@/dal/models/audience.model";

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
  const sortBy = (params.sort as "created_at" | "updated_at" | "name" | "member_count") || "created_at";
  const sortOrder = (params.order as "asc" | "desc") || "desc";
  const visibility = params.visibility as "pub" | "prv" | null;
  const syncStatus = params.sync_status as "pending" | "syncing" | "completed" | "failed" | null;
  const search = params.search;

  // Build current filters from URL params
  const currentFilters: Partial<AudienceQueryFilters> = {
    sort_by: sortBy,
    sort_order: sortOrder,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  };
  
  if (search) currentFilters.name_contains = search;
  if (visibility) currentFilters.visibility = visibility;
  if (syncStatus) currentFilters.sync_status = syncStatus;

  // Fetch data from API routes on server side
  let audiences: any[] = [];
  let totalCount = 0;
  let stats: any = null;
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
      
      // Map Mailchimp API response to our format
      if (audienceData.lists) {
        audiences = audienceData.lists.map((list: any) => ({
          id: list.id,
          name: list.name,
          date_created: list.date_created,
          created_at: list.date_created,
          updated_at: list.date_created, // Mailchimp doesn't provide updated_at
          visibility: list.visibility,
          stats: {
            member_count: list.stats?.member_count || 0,
            unsubscribe_count: list.stats?.unsubscribe_count || 0,
            cleaned_count: list.stats?.cleaned_count || 0,
          },
          sync_status: "completed" as const,
          is_deleted: false,
          contact: list.contact,
          permission_reminder: list.permission_reminder,
          campaign_defaults: list.campaign_defaults,
          email_type_option: list.email_type_option,
        }));
        totalCount = audienceData.total_items || audiences.length;
      }
      
      // Generate basic stats from the audience data
      const totalMembers = audiences.reduce((sum: number, audience: any) => sum + audience.stats.member_count, 0);
      stats = {
        total_audiences: totalCount,
        total_members: totalMembers,
        avg_member_count: audiences.length > 0 ? totalMembers / audiences.length : 0,
        avg_engagement_rate: 0, // We don't have this data from the basic API
        audiences_by_status: { pending: 0, syncing: 0, completed: audiences.length, failed: 0 },
        audiences_by_visibility: audiences.reduce((counts: any, audience: any) => {
          counts[audience.visibility] = (counts[audience.visibility] || 0) + 1;
          return counts;
        }, { pub: 0, prv: 0 }),
        last_updated: new Date().toISOString(),
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
          onGoHome={() => window.location.href = "/mailchimp"}
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
        {stats && (
          <AudienceStats stats={stats} loading={false} />
        )}

        {/* Main Content */}
        <ClientAudienceList
          audiences={audiences}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          filters={currentFilters}
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