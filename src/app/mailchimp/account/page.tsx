/**
 * Mailchimp Account Page
 * Displays account information from the API Root endpoint
 *
 * Issue #122: Account navigation and routing
 * Uses components from: @/components/mailchimp/account
 * Uses direct service calls following audiences page pattern
 */

import { Suspense } from "react";
import { AccountOverview } from "@/components/mailchimp/account";
import { DashboardLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { getMailchimpService } from "@/services";

async function AccountPageContent() {
  // Get Mailchimp service and fetch account data directly
  const mailchimp = getMailchimpService();

  // Fetch account data from Mailchimp service - let errors bubble up naturally
  const response = await mailchimp.getApiRoot();

  if (!response.success) {
    return <div>Error: {response.error || "Failed to load audiences"}</div>;
  }

  if (!response.data) {
    return <div>Error: No audience data received</div>;
  }

  const account = response.data;

  return <AccountOverview account={account} loading={false} />;
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountOverview account={null} loading={true} />}>
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
          <AccountPageContent />
        </div>
      </DashboardLayout>
    </Suspense>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account | Mailchimp Dashboard",
  description: "View your Mailchimp account information and settings",
};
