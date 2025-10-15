/**
 * Campaign Report Detail Components
 * Exports for campaign report detail functionality
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 */

// Base components
export {
  BaseMetricCard,
  MetricRow,
  formatPercentage,
} from "@/components/dashboard/reports/BaseMetricCard";

// Report components
export { ReportHeader } from "@/components/dashboard/reports/ReportHeader";
export { ReportCharts } from "@/components/dashboard/reports/ReportCharts";

// Metric card components
export { DeliveryStatusCard } from "@/components/dashboard/reports/DeliveryStatusCard";
export { EcommerceCard } from "@/components/dashboard/reports/EcommerceCard";
export { TimeseriesCard } from "@/components/dashboard/reports/TimeseriesCard";
export { TimewarpCard } from "@/components/dashboard/reports/TimewarpCard";
export { TimewarpSection } from "@/components/dashboard/reports/TimewarpSection";
export { EcommerceSection } from "@/components/dashboard/reports/EcommerceSection";
export { AbTestSection } from "@/components/dashboard/reports/AbTestSection";
export { AbSplitCard } from "@/components/dashboard/reports/AbSplitCard";
export { ForwardsCard } from "@/components/dashboard/reports/ForwardsCard";
export { OpensCard } from "@/components/dashboard/reports/OpensCard";
export { ClicksCard } from "@/components/dashboard/reports/ClicksCard";
export { IndustryStatsCard } from "@/components/dashboard/reports/IndustryStatsCard";
export { EmailsSentCard } from "@/components/dashboard/reports/EmailsSentCard";
export { DeliveryIssuesCard } from "@/components/dashboard/reports/DeliveryIssuesCard";
export { ListHealthCard } from "@/components/dashboard/reports/ListHealthCard";
export { SocialEngagementCard } from "@/components/dashboard/reports/SocialEngagementCard";
export { ListPerformanceCard } from "@/components/dashboard/reports/ListPerformanceCard";

// Main container components
export { CampaignReportDetail } from "@/components/dashboard/reports/CampaignReportDetail";

// Campaign opens components
export { CampaignOpensTable } from "@/components/dashboard/reports/CampaignOpensTable";
export { CampaignOpensEmpty } from "@/components/dashboard/reports/CampaignOpensEmpty";

// Campaign abuse reports components
export { CampaignAbuseReportsTable } from "@/components/dashboard/reports/CampaignAbuseReportsTable";
export { CampaignAbuseReportsEmpty } from "@/components/dashboard/reports/CampaignAbuseReportsEmpty";
