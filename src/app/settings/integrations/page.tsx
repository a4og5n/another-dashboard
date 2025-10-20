/**
 * Settings - Integrations Page
 * Manage OAuth connections and API integrations for third-party services
 *
 * @route /settings/integrations
 * @requires Kinde Auth
 * @features OAuth management, Connection status, Connect/disconnect actions
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { PageLayout } from "@/components/layout";
import { MailchimpIntegrationCard } from "@/components/settings/mailchimp-integration-card";
import { bc } from "@/utils";

export default async function IntegrationsPage() {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/login?post_login_redirect_url=/settings/integrations");
  }

  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Get Mailchimp connection status
  const mailchimpConnection = await mailchimpConnectionRepo.findByKindeUserId(
    user.id,
  );

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.settings, bc.current("Integrations")]}
      title="Integrations"
      description="Manage your connected data sources and API integrations"
      skeleton={<div>Loading...</div>}
    >
      <div className="grid gap-6">
        <MailchimpIntegrationCard connection={mailchimpConnection} />

        {/* Future integrations */}
        {/* <GoogleAnalyticsIntegrationCard /> */}
        {/* <YouTubeIntegrationCard /> */}
      </div>
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Integrations | Settings",
  description: "Manage your connected data sources and API integrations",
};
