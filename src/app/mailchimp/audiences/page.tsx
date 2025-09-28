import { AudienceOverview } from "@/components/mailchimp/audiences/AudienceOverview";
import { AudienceOverviewSkeleton } from "@/skeletons/mailchimp";
import type { AudiencesPageProps } from "@/types/mailchimp";
import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mailchimpService } from "@/services/mailchimp.service";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import { Suspense } from "react";

async function AudiencesPageContent({ searchParams }: AudiencesPageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;

  // Use service layer for better architecture
  const response = await mailchimpService.getAudiences(params);

  // Handle errors
  if (!response.success) {
    return (
      <AudienceOverview
        error={response.error || "Failed to load audiences"}
        responseData={null}
      />
    );
  }

  // Parse pagination params for UI
  const queryDefaults = MailchimpAudienceQuerySchema.parse({});
  const currentPage = parseInt(params.page || "1");
  const pageSize = parseInt(params.limit || queryDefaults.count.toString());

  // Pass data to component
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
        <Suspense fallback={<AudienceOverviewSkeleton />}>
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
