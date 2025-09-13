/**
 * Campaign Opens Loading Page
 * Loading UI for campaign opens route
 */

import { CampaignOpensLoading } from "@/components/dashboard/reports";
import { BreadcrumbNavigation } from "@/components/layout";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Campaigns", href: "/mailchimp/campaigns" },
          { label: "Report", href: "#" },
          { label: "Opens", isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="h-9 w-64 bg-muted animate-pulse rounded" />
            <div className="h-5 w-96 bg-muted animate-pulse rounded" />
          </div>

          {/* Loading Content */}
          <CampaignOpensLoading />
        </div>
      </div>
    </div>
  );
}
