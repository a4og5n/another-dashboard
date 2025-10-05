/**
 * Settings - Integrations Page
 * Centralized management for all OAuth connections and API integrations
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { MailchimpIntegrationCard } from "@/components/settings/mailchimp-integration-card";

export default async function IntegrationsPage() {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/api/auth/login?post_login_redirect_url=/settings/integrations");
  }

  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  // 2. Get Mailchimp connection status
  const mailchimpConnection = await mailchimpConnectionRepo.findByKindeUserId(
    user.id,
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings/integrations" },
            { label: "Integrations", isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your connected data sources and API integrations
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid gap-6">
          <MailchimpIntegrationCard connection={mailchimpConnection} />

          {/* Future integrations */}
          {/* <GoogleAnalyticsIntegrationCard /> */}
          {/* <YouTubeIntegrationCard /> */}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Integrations | Settings",
  description: "Manage your connected data sources and API integrations",
};
