import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { AudienceOverview } from "@/components/mailchimp/audiences/AudienceOverview";
import { AudienceStatsSkeleton } from "@/skeletons/mailchimp";
import { getMailchimpService } from "@/services";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import type { AudiencesPageProps } from "@/types/mailchimp";

async function AudiencesPageContent({ searchParams }: AudiencesPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Get Mailchimp service and fetch audiences directly
  const mailchimp = getMailchimpService();

  // Pass raw params to service - let service handle parsing/validation
  const response = await mailchimp.getLists(params);

  // Parse pagination params for UI components (same logic as service)
  const queryDefaults = MailchimpAudienceQuerySchema.parse({});
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.limit || queryDefaults.count.toString());

  // Handle service-level errors only
  if (!response.success) {
    return (
      <AudienceOverview
        error={response.error || "Failed to load audiences"}
        responseData={null}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    );
  }

  // Pass data to component - let component handle prop validation
  return (
    <AudienceOverview
      responseData={response.data || null}
      currentPage={currentPage}
      pageSize={pageSize}
    />
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
        <Suspense fallback={<AudienceStatsSkeleton />}>
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
