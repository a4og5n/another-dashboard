/**
 * Campaign Opens Server Component
 * Server component wrapper for CampaignOpensTable with URL-based navigation
 * Handles empty state when no opens data is available
 *
 * Issue #135: Campaign opens pagination implementation
 * Converted to server component for better performance and SEO
 */

import {
  CampaignOpensTable,
  CampaignOpensEmpty,
} from "@/components/dashboard/reports";
import type { CampaignOpensProps } from "@/types/components/dashboard/reports";

export function CampaignOpens({
  opensData,
  currentParams,
  campaignId,
  perPageOptions = [10, 20, 50],
}: CampaignOpensProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Opens</h1>
        <p className="text-muted-foreground">
          {opensData.total_items > 0
            ? `Members who opened this campaign - ${opensData.total_items} total opens`
            : "Campaign opens data"}
        </p>
      </div>

      {/* Check if there are no opens (total_items is 0) */}
      {opensData.total_items === 0 ? (
        <CampaignOpensEmpty campaignId={campaignId} />
      ) : (
        <CampaignOpensTable
          opensData={opensData}
          currentParams={currentParams}
          perPageOptions={perPageOptions}
          baseUrl={`/mailchimp/campaigns/${campaignId}/report/opens`}
        />
      )}
    </div>
  );
}
