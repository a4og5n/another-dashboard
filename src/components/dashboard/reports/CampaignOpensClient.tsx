/**
 * Campaign Opens Server Component
 * Server component wrapper for CampaignOpensTable with URL-based navigation
 *
 * Issue #135: Campaign opens pagination implementation
 * Converted to server component for better performance and SEO
 */

import { CampaignOpensTable } from "./CampaignOpensTable";
import type { CampaignOpensProps } from "@/types/components/dashboard/reports";

export function CampaignOpens({
  opensData,
  currentParams,
  campaignId,
  perPageOptions = [10, 20, 50],
}: CampaignOpensProps) {
  // Server component - no client-side state or navigation logic needed
  // Navigation is handled via forms and links in the table component
  const baseUrl = `/mailchimp/campaigns/${campaignId}/report/opens`;

  return (
    <CampaignOpensTable
      opensData={opensData}
      currentParams={currentParams}
      perPageOptions={perPageOptions}
      baseUrl={baseUrl}
    />
  );
}
