/**
 * Campaign Report Detail Container Component
 * Main container that orchestrates all campaign report sub-components
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "@/components/dashboard/reports/ReportHeader";
import { ReportCharts } from "@/components/dashboard/reports/ReportCharts";
import { DeliveryStatusCard } from "@/components/dashboard/reports/DeliveryStatusCard";
import { TimeseriesCard } from "@/components/dashboard/reports/TimeseriesCard";
import { ForwardsCard } from "@/components/dashboard/reports/ForwardsCard";
import { OpensCard } from "@/components/dashboard/reports/OpensCard";
import { ClicksCard } from "@/components/dashboard/reports/ClicksCard";
import { IndustryStatsCard } from "@/components/dashboard/reports/IndustryStatsCard";
import { EmailsSentCard } from "@/components/dashboard/reports/EmailsSentCard";
import { DeliveryIssuesCard } from "@/components/dashboard/reports/DeliveryIssuesCard";
import { ListHealthCard } from "@/components/dashboard/reports/ListHealthCard";
import { TimewarpSection } from "@/components/dashboard/reports/TimewarpSection";
import { EcommerceSection } from "@/components/dashboard/reports/EcommerceSection";
import { AbTestSection } from "@/components/dashboard/reports/AbTestSection";
import type { CampaignReportDetailProps } from "@/types/components";
import { SocialEngagementCard } from "@/components/dashboard/reports/SocialEngagementCard";
import { ListPerformanceCard } from "@/components/dashboard/reports/ListPerformanceCard";
import { ShareReport } from "@/components/dashboard/reports/ShareReport";
import { LinkClickInfo } from "@/components/dashboard/reports/LinkClickInfo";

export function CampaignReportDetail({ report }: CampaignReportDetailProps) {
  // Define valid tabs for the component
  const validTabs = ["overview", "details"];
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current tab from URL search params or use default
  const tabFromUrl = searchParams.get("tab");

  // Determine the active tab with validation
  const activeTab =
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "overview";

  // No longer forcing the default tab into URL when not present
  // We'll just use the activeTab variable instead

  useEffect(() => {
    // No initialization needed - we'll handle this in the tab change handler
  }, []); // Empty dependency array to run only on mount

  // Handle tab changes - update URL when tab changes
  const handleTabChange = (value: string) => {
    // Create a new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams.toString());

    // If it's the default tab (overview), remove the tab parameter
    // Otherwise, set the tab parameter
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }

    // Update the URL without reloading the page
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Report Header */}
      <ReportHeader report={report} />

      {/* Tabbed Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-full overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EmailsSentCard emailsSent={report.emails_sent} />
            <DeliveryIssuesCard
              bounces={report.bounces}
              totalEmails={report.emails_sent}
            />
            <ListHealthCard
              unsubscribed={report.unsubscribed}
              abuseReports={report.abuse_reports}
              emailsSent={report.emails_sent}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OpensCard opens={report.opens} />
            <ClicksCard clicks={report.clicks} />
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List Performance Comparison */}
            <ListPerformanceCard listStats={report.list_stats} />

            <IndustryStatsCard
              industryStats={report.industry_stats}
              campaignStats={{
                open_rate: report.opens.open_rate,
                click_rate: report.clicks.click_rate,
              }}
            />
            <DeliveryStatusCard
              deliveryStatus={report.delivery_status}
              totalEmails={report.emails_sent}
            />
            <ForwardsCard forwards={report.forwards} />
          </div>

          {/* Timeseries */}
          <TimeseriesCard report={report} />

          {/* Charts */}
          <ReportCharts report={report} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Link Click Information */}
            <LinkClickInfo report={report} />

            {/* Engagement Details */}
            <SocialEngagementCard facebookLikes={report.facebook_likes} />

            {/* Share Report */}
            <ShareReport report={report} />
          </div>

          {/* Ecommerce Section */}
          <EcommerceSection ecommerce={report.ecommerce} />

          {/* A/B Test Section */}
          <AbTestSection abSplit={report.ab_split} />

          {/* Timewarp Section */}
          <TimewarpSection timewarp={report.timewarp} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
