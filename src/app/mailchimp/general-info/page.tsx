/**
 * Mailchimp General Info Page (OAuth-based)
 * Displays general information from the API Root endpoint
 *
 * Issue #122: General Info navigation and routing
 * Uses components from: @/components/mailchimp/general-info
 * Uses MailchimpConnectionGuard for automatic connection validation
 */

import { GeneralInfoOverview } from "@/components/mailchimp/general-info";
import { GeneralInfoOverviewSkeleton } from "@/skeletons/mailchimp";
import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { Suspense } from "react";

async function GeneralInfoPageContent() {
  // Guard validates connection BEFORE evaluating children
  // Using function form prevents API calls when user isn't connected
  return (
    <MailchimpConnectionGuard>
      {async () => {
        const response = await mailchimpDAL.fetchApiRoot();

        return response.success ? (
          <GeneralInfoOverview data={response.data!} />
        ) : (
          <GeneralInfoOverview
            error={response.error || "Failed to load general info data"}
            data={null}
          />
        );
      }}
    </MailchimpConnectionGuard>
  );
}

export default function GeneralInfoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "General Info", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            General Information
          </h1>
          <p className="text-muted-foreground">
            View your Mailchimp general information, contact details, and
            industry benchmarks
          </p>
        </div>

        {/* Main Content - Suspense wraps async component */}
        <Suspense fallback={<GeneralInfoOverviewSkeleton />}>
          <GeneralInfoPageContent />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "General Info | Mailchimp Dashboard",
  description: "View your Mailchimp general information and settings",
};
