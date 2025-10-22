/**
 * Campaign Report Detail Container Component
 * Main container that orchestrates all campaign report sub-components
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

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
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { TabNavigation } from "@/components/dashboard/reports/TabNavigation";

export function CampaignReportDetail({
  report,
  error,
  activeTab = "overview",
}: CampaignReportDetailProps) {
  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no report data provided
  if (!report) {
    return <DashboardInlineError error="No report data provided" />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Report Header */}
      <ReportHeader report={report} />

      {/* Tabbed Content */}
      <TabNavigation activeTab={activeTab}>
        {/* Overview Tab */}
        <div data-tab="overview" className="mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EmailsSentCard
              emailsSent={report.emails_sent}
              campaignId={report.id}
            />
            <DeliveryIssuesCard
              bounces={report.bounces}
              totalEmails={report.emails_sent}
            />
            <ListHealthCard
              unsubscribed={report.unsubscribed}
              abuseReports={report.abuse_reports}
              emailsSent={report.emails_sent}
              campaignId={report.id}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OpensCard opens={report.opens} campaignId={report.id} />
            <ClicksCard clicks={report.clicks} campaignId={report.id} />
          </div>
        </div>

        {/* Details Tab */}
        <div data-tab="details" className="mt-6">
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
        </div>
      </TabNavigation>
    </div>
  );
}
