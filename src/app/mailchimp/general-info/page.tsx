/**
 * Mailchimp General Info Page (OAuth-based)
 * Displays general information from the API Root endpoint
 *
 * Issue #122: General Info navigation and routing
 * Uses components from: @/components/mailchimp/general-info
 * Uses direct service calls following audiences page pattern
 */

import { GeneralInfoOverview } from "@/components/mailchimp/general-info";
import { GeneralInfoOverviewSkeleton } from "@/skeletons/mailchimp";
import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout";
import { mailchimpService } from "@/services/mailchimp.service";
import {
  validateMailchimpConnection,
  getValidationErrorMessage,
} from "@/lib/validate-mailchimp-connection";
import { Suspense } from "react";

async function GeneralInfoPageContent() {
  // Validate Mailchimp connection before making API call
  const validation = await validateMailchimpConnection();
  if (!validation.isValid) {
    return (
      <GeneralInfoOverview
        error={getValidationErrorMessage(validation.error || "")}
        data={null}
      />
    );
  }

  // Use service layer for better architecture
  const response = await mailchimpService.getApiRoot();

  // Handle errors
  if (!response.success) {
    return (
      <GeneralInfoOverview
        error={response.error || "Failed to load general info data"}
        data={null}
      />
    );
  }

  // Pass data to component - let component handle prop validation
  return <GeneralInfoOverview data={response.data!} />;
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

        {/* Main Content */}
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
