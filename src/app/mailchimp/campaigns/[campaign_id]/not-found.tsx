/**
 * Campaign Not Found Page
 * Shown when a campaign_id doesn't exist
 */
import { PageLayout } from "@/components/layout";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export default function CampaignNotFound() {
  return (
    <PageLayout
      title="Campaign Not Found"
      description="Campaign not found"
      skeleton={null}
    >
      <DashboardInlineError error="Campaign not found. Please check the campaign ID and try again." />
    </PageLayout>
  );
}
