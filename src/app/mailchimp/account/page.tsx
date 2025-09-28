/**
 * Mailchimp Account Page
 * Displays account information from the API Root endpoint
 *
 * Issue #122: Account navigation and routing
 * Uses components from: @/components/mailchimp/account
 * Uses direct service calls following audiences page pattern
 */

import { AccountOverview } from "@/components/mailchimp/account";
import { AccountOverviewSkeleton } from "@/skeletons/mailchimp";
import { BreadcrumbNavigation } from "@/components/layout";
import { DashboardLayout } from "@/components/layout";
import { mailchimpService } from "@/services/mailchimp.service";
import { Suspense } from "react";

async function AccountPageContent() {
  // Use service layer for better architecture
  const response = await mailchimpService.getApiRoot();

  // Handle service-level errors only
  if (!response.success) {
    return (
      <AccountOverview
        error={response.error || "Failed to load account data"}
        account={null}
      />
    );
  }

  // Pass data to component - let component handle prop validation
  return <AccountOverview account={response.data!} />;
}

export default function AccountPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Mailchimp", href: "/mailchimp" },
            { label: "Account", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Information
          </h1>
          <p className="text-muted-foreground">
            View your Mailchimp account details, contact information, and
            industry benchmarks
          </p>
        </div>

        {/* Main Content */}
        <Suspense fallback={<AccountOverviewSkeleton />}>
          <AccountPageContent />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account | Mailchimp Dashboard",
  description: "View your Mailchimp account information and settings",
};
