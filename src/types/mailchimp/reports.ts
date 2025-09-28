/**
 * Mailchimp Reports Types
 * TypeScript type definitions for campaign reports functionality
 *
 * Issue #127: Reports types implementation using z.infer pattern
 * All types properly inferred from corresponding schemas
 */
import { z } from "zod";
import {
  ReportListQuerySchema,
  ReportListQueryInternalSchema,
  ReportListSuccessSchema,
  reportListErrorResponseSchema,
  CampaignReportSchema,
  ReportBouncesSchema,
  ReportForwardsSchema,
  ReportOpensSchema,
  ReportClicksSchema,
  ReportFacebookLikesSchema,
  ReportIndustryStatsSchema,
  ReportListStatsSchema,
  ReportAbSplitSchema,
  ReportAbSplitDataSchema,
  ReportTimewarpSchema,
  ReportTimeseriesSchema,
  ReportShareReportSchema,
  ReportEcommerceSchema,
  ReportDeliveryStatusSchema,
  REPORT_TYPES,
  CAMPAIGN_REPORT_TYPES,
  DELIVERY_STATUS_TYPES,
} from "@/schemas/mailchimp";

/**
 * Report query parameter types
 */
export type ReportListQuery = z.infer<typeof ReportListQuerySchema>;
export type ReportListQueryInternal = z.infer<
  typeof ReportListQueryInternalSchema
>;

/**
 * Report response types
 */
export type ReportListSuccess = z.infer<typeof ReportListSuccessSchema>;
export type ReportListErrorResponse = z.infer<
  typeof reportListErrorResponseSchema
>;

/**
 * Individual campaign report type
 */
export type CampaignReport = z.infer<typeof CampaignReportSchema>;

/**
 * Report data structure types
 */
export type ReportBounces = z.infer<typeof ReportBouncesSchema>;
export type ReportForwards = z.infer<typeof ReportForwardsSchema>;
export type ReportOpens = z.infer<typeof ReportOpensSchema>;
export type ReportClicks = z.infer<typeof ReportClicksSchema>;
export type ReportFacebookLikes = z.infer<typeof ReportFacebookLikesSchema>;
export type ReportIndustryStats = z.infer<typeof ReportIndustryStatsSchema>;
export type ReportListStats = z.infer<typeof ReportListStatsSchema>;

/**
 * A/B split test types
 */
export type ReportAbSplit = z.infer<typeof ReportAbSplitSchema>;
export type ReportAbSplitData = z.infer<typeof ReportAbSplitDataSchema>;

/**
 * Time-based report types
 */
export type ReportTimewarp = z.infer<typeof ReportTimewarpSchema>;
export type ReportTimeseries = z.infer<typeof ReportTimeseriesSchema>;

/**
 * Additional report feature types
 */
export type ReportShareReport = z.infer<typeof ReportShareReportSchema>;
export type ReportEcommerce = z.infer<typeof ReportEcommerceSchema>;
export type ReportDeliveryStatus = z.infer<typeof ReportDeliveryStatusSchema>;

/**
 * Enum types
 */
export type ReportType = (typeof REPORT_TYPES)[number];
export type CampaignReportType = (typeof CAMPAIGN_REPORT_TYPES)[number];
export type DeliveryStatusType = (typeof DELIVERY_STATUS_TYPES)[number];

/**
 * Component prop types
 */
export interface ReportsOverviewProps {
  reports: CampaignReport[];
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  perPage: number;
  perPageOptions: number[];
  basePath: string;
  additionalParams?: Record<string, string | undefined>;
}
