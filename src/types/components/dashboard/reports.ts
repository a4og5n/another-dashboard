/**
 * Dashboard Report Component Types
 * Type definitions for dashboard report components
 *
 * Following project guidelines to define shared types in /src/types
 */

import type { CampaignReport } from "@/types/mailchimp";
import type { LucideIcon } from "lucide-react";
import type {
  ReportDeliveryStatus,
  ReportTimewarp,
  ReportEcommerce,
  ReportAbSplit,
  ReportClicks,
  ReportOpens,
  ReportForwards,
  ReportFacebookLikes,
  ReportListStats,
  Report,
} from "@/types/mailchimp/reports";
import type {
  ReportOpenListSuccess,
  OpenListQueryParams,
} from "@/types/mailchimp";
import { reportBouncesSchema } from "@/schemas/mailchimp/common/report.schema";
import { z } from "zod";
import { reportsTablePropsSchema } from "@/schemas/components/dashboard/reports";

/**
 * Props for the CampaignReportDetail component
 */
export interface CampaignReportDetailProps {
  /** The campaign report data to display */
  report: CampaignReport;
}

/**
 * Props for the ReportHeader component
 */
export interface ReportHeaderProps {
  /** The campaign report data to display in the header */
  report: CampaignReport;
}

/**
 * Props for the ReportMetrics component
 */
export interface ReportMetricsProps {
  /** The campaign report data to display metrics for */
  report: CampaignReport;
}

/**
 * Props for the ReportCharts component
 */
export interface ReportChartsProps {
  /** The campaign report data to visualize in charts */
  report: CampaignReport;
}

/**
 * Props for the BaseMetricCard component
 */
export interface BaseMetricCardProps {
  /** Title of the card (optional, renders simple card without header if not provided) */
  title?: string;
  /** Icon component to display next to title or in the corner for simple cards */
  icon?: LucideIcon;
  /** Color for the icon (CSS color string) */
  iconColor?: string;
  /** Whether to use compact design (padding and spacing) */
  compact?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Children components/content to render inside the card */
  children: React.ReactNode;
  /** Whether this is a simple card (icon in corner) vs detailed card (icon in title) */
  simpleCard?: boolean;
}

/**
 * Props for the MetricRow component
 */
export interface MetricRowProps {
  /** Label text for the metric */
  label: string;
  /** Value to display (will be formatted if it's a number) */
  value: string | number;
  /** Optional text color for the value */
  textColor?: string;
}

/**
 * Props for the ListHealthCard component
 */
export interface ListHealthCardProps {
  /** Number of users who unsubscribed from the campaign */
  unsubscribed: number;
  /** Number of abuse reports received for the campaign */
  abuseReports: number;
  /** Total number of emails sent in the campaign */
  emailsSent: number;
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Props for the DeliveryIssuesCard component
 * Uses the Zod schema for type validation and definition
 */

export type DeliveryIssuesCardProps = {
  /** Bounce statistics for the campaign, derived from reportBouncesSchema */
  bounces: z.infer<typeof reportBouncesSchema>;
  /** Total number of emails sent in the campaign */
  totalEmails: number;
  /** Optional CSS class name for styling */
  className?: string;
};

/**
 * Props for the EmailsSentCard component
 */
export interface EmailsSentCardProps {
  /** Total number of emails sent in the campaign */
  emailsSent: number;
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Props for the DeliveryStatusCard component
 */
export interface DeliveryStatusCardProps {
  /** Delivery status data */
  deliveryStatus?: ReportDeliveryStatus;
  /** Total number of emails sent */
  totalEmails: number;
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Props for the TimewarpCard component
 */
export interface TimewarpCardProps {
  /** Timewarp data for the campaign */
  timewarp: ReportTimewarp;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the TimewarpSection component
 */
export interface TimewarpSectionProps {
  /** Timewarp data for the campaign */
  timewarp?: ReportTimewarp;
}

/**
 * Props for the AbTestSection component
 */
export interface AbTestSectionProps {
  /** A/B Test data for the campaign */
  abSplit?: ReportAbSplit;
}

/**
 * Props for the EcommerceCard component
 */
export interface EcommerceCardProps {
  /** Ecommerce data for the campaign */
  ecommerce: ReportEcommerce;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the EcommerceSection component
 */
export interface EcommerceSectionProps {
  /** Ecommerce data for the campaign */
  ecommerce: ReportEcommerce;
}

/**
 * Props for the ClicksCard component
 */
export interface ClicksCardProps {
  /** Click statistics for the campaign */
  clicks: ReportClicks;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the OpensCard component
 */
export interface OpensCardProps {
  /** Open statistics for the campaign */
  opens: ReportOpens;
  /** Campaign ID for navigation to detailed opens page */
  campaignId: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the ForwardsCard component
 */
export interface ForwardsCardProps {
  /** Forward statistics for the campaign */
  forwards: ReportForwards;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the SocialEngagementCard component
 */
export interface SocialEngagementCardProps {
  /** Facebook like statistics for the campaign */
  facebookLikes: ReportFacebookLikes;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the ListPerformanceCard component
 */
export interface ListPerformanceCardProps {
  /** List performance statistics */
  listStats: ReportListStats;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Input props for the ReportsTable component (used in ReportsOverview)
 * Only requires essential props, others have defaults applied by schema
 */
/**
 * Props for the AbSplitCard component
 */
export interface AbSplitCardProps {
  /** A/B split test data for the campaign */
  abSplit: ReportAbSplit;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the ReportsOverview component
 * Server component following ListOverview pattern
 */
export interface ReportsOverviewProps {
  /** Campaign reports data from API response, null if error */
  data: {
    reports: Report[];
    total_items: number;
  } | null;
  /** Current page number (validated by parent page component) */
  currentPage?: number;
  /** Number of items per page (validated by parent page component) */
  pageSize?: number;
  /** Error message if data fetch failed */
  error?: string | null;
}

export type ReportsOverviewTableProps = {
  /** Array of campaign reports to display - properly typed */
  reports: Report[];
} & Partial<z.infer<typeof reportsTablePropsSchema>>;

/**
 * Parsed props after schema validation with all defaults applied
 * This is what the component actually receives internally
 */
export type ParsedReportsTableProps = z.infer<
  typeof reportsTablePropsSchema
> & {
  /** Array of campaign reports to display - properly typed */
  reports: Report[];
};

/**
 * Props for the CampaignOpens server component
 */
export interface CampaignOpensProps {
  /** Campaign opens data from the API */
  opensData: ReportOpenListSuccess;
  /** Current query parameters including pagination */
  currentParams: OpenListQueryParams & { count: number; offset: number };
  /** Campaign ID for URL routing */
  campaignId: string;
  /** Available options for per-page selection */
  perPageOptions?: number[];
}

// Legacy alias for backward compatibility during migration
export type CampaignOpensClientProps = CampaignOpensProps;
