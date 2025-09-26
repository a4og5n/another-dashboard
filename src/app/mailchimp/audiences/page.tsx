import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { ClientAudienceList } from "@/components/mailchimp/audiences/ClientAudienceList";
import { AudienceStats } from "@/components/mailchimp/audiences/AudienceStats";
import { getMailchimpService } from "@/services";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import { calculateAudienceStats } from "@/utils/mailchimp";
import type { AudiencesPageProps } from "@/types/mailchimp";

async function AudiencesPageContent({ searchParams }: AudiencesPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Get Mailchimp service and fetch audiences directly
  const mailchimp = getMailchimpService();

  // Pass raw params to service - let service handle parsing/validation
  const response = await mailchimp.getLists(params);

  // Handle expected API failures as return values, not exceptions
  if (!response.success) {
    return <div>Error: {response.error || "Failed to load audiences"}</div>;
  }

  if (!response.data) {
    return <div>Error: No audience data received</div>;
  }

  // Calculate audience statistics and extract data using utility function
  const { stats, audiences, totalCount } = calculateAudienceStats(
    response.data,
  );

  // Parse pagination params for UI components (same logic as service)
  const queryDefaults = MailchimpAudienceQuerySchema.parse({});
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.limit || queryDefaults.count.toString());

  return (
    <div className="space-y-6">
      {/* Audience Statistics */}
      <AudienceStats stats={stats} loading={false} />

      {/* Audience List */}
      <ClientAudienceList
        audiences={audiences}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
}

export default function AudiencesPage({ searchParams }: AudiencesPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Audiences", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audiences</h1>
            <p className="text-muted-foreground">
              Manage your Mailchimp audiences and monitor their performance
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Suspense fallback={<div>Loading audience management...</div>}>
          <AudiencesPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Audiences | Mailchimp Dashboard",
  description: "Manage your Mailchimp audiences and monitor their performance",
};
