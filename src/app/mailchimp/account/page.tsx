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
    throw new Error(response.error || "Failed to load account information");
  }

  if (!response.data) {
    throw new Error("No account data received");
  }

  const account = response.data;

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

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Information
          </h1>
          <p className="text-muted-foreground">
            View your Mailchimp account details, contact information, and
            industry benchmarks
          </p>
        </div>

        {/* Account Overview */}
        <AccountOverview account={account} loading={false} />
      </div>
    </DashboardLayout>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountOverview account={null} loading={true} />}>
      <AccountPageContent />
    </Suspense>
  );
}

export const metadata = {
  title: "Account | Mailchimp Dashboard",
  description: "View your Mailchimp account information and settings",
};
