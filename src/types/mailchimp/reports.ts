/**
 * Mailchimp Reports Types
 * TypeScript type definitions for campaign reports functionality
 *
 * Endpoints covered:
 * - GET /reports (list all reports)
 * - GET /reports/{campaign_id} (single report)
 * - GET /reports/{campaign_id}/open-details (report opens)
 * - GET /reports/{campaign_id}/abuse-reports (abuse reports)
 *
 * All types properly inferred from corresponding schemas
 */
import { z } from "zod";
import {
  DELIVERY_STATUS_TYPES,
  reportAbSplitDataSchema,
  reportAbSplitSchema,
  reportBouncesSchema,
  reportClicksSchema,
  reportDeliveryStatusSchema,
  reportEcommerceSchema,
  reportFacebookLikesSchema,
  reportForwardsSchema,
  reportIndustryStatsSchema,
  reportListErrorSchema,
  reportListParamsSchema,
  reportListStatsSchema,
  reportListSuccessSchema,
  reportOpensSchema,
  reportSchema,
  reportShareReportSchema,
  reportTimeseriesSchema,
  reportTimewarpSchema,
  REPORT_TYPES,
} from "@/schemas/mailchimp";
import {
  reportPathParamsSchema,
  reportQueryParamsSchema,
} from "@/schemas/mailchimp/reports/detail/params.schema";
import { reportSuccessSchema } from "@/schemas/mailchimp/reports/detail/success.schema";
import { reportErrorSchema } from "@/schemas/mailchimp/reports/detail/error.schema";
import {
  openListPathParamsSchema,
  openListQueryParamsSchema,
  OPEN_DETAILS_SORT_DIRECTIONS,
} from "@/schemas/mailchimp/reports/open-details/params.schema";
import { reportOpenListSuccessSchema } from "@/schemas/mailchimp/reports/open-details/success.schema";
import { openListErrorSchema } from "@/schemas/mailchimp/reports/open-details/error.schema";
import { reportListMemberSchema } from "@/schemas/mailchimp/common/report-list-member.schema";
import {
  abuseReportsPathParamsSchema,
  abuseReportsQueryParamsSchema,
} from "@/schemas/mailchimp/reports/abuse-reports/params.schema";
import {
  abuseReportSchema,
  abuseReportListSuccessSchema,
} from "@/schemas/mailchimp/reports/abuse-reports/success.schema";
import { abuseReportListErrorSchema } from "@/schemas/mailchimp/reports/abuse-reports/error.schema";

// ============================================================================
// Reports List Types (GET /reports)
// ============================================================================

/**
 * Report query parameter types
 */
export type ReportListParams = z.infer<typeof reportListParamsSchema>;
export type ReportListQuery = ReportListParams; // Alias for backwards compatibility

/**
 * Report response types
 */
export type ReportListSuccess = z.infer<typeof reportListSuccessSchema>;
export type ReportListErrorResponse = z.infer<typeof reportListErrorSchema>;

/**
 * Individual report type
 */
export type Report = z.infer<typeof reportSchema>;

/**
 * Report data structure types
 */
export type ReportBounces = z.infer<typeof reportBouncesSchema>;
export type ReportForwards = z.infer<typeof reportForwardsSchema>;
export type ReportOpens = z.infer<typeof reportOpensSchema>;
export type ReportClicks = z.infer<typeof reportClicksSchema>;
export type ReportFacebookLikes = z.infer<typeof reportFacebookLikesSchema>;
export type ReportIndustryStats = z.infer<typeof reportIndustryStatsSchema>;
export type ReportListStats = z.infer<typeof reportListStatsSchema>;

/**
 * A/B split test types
 */
export type ReportAbSplit = z.infer<typeof reportAbSplitSchema>;
export type ReportAbSplitData = z.infer<typeof reportAbSplitDataSchema>;

/**
 * Time-based report types
 */
export type ReportTimewarp = z.infer<typeof reportTimewarpSchema>;
export type ReportTimeseries = z.infer<typeof reportTimeseriesSchema>;

/**
 * Additional report feature types
 */
export type ReportShareReport = z.infer<typeof reportShareReportSchema>;
export type ReportEcommerce = z.infer<typeof reportEcommerceSchema>;
export type ReportDeliveryStatus = z.infer<typeof reportDeliveryStatusSchema>;

/**
 * Enum types
 */
export type ReportType = (typeof REPORT_TYPES)[number];
export type DeliveryStatusType = (typeof DELIVERY_STATUS_TYPES)[number];

// ============================================================================
// Single Report Types (GET /reports/{campaign_id})
// ============================================================================

/**
 * Single report parameter types
 */
export type ReportPathParams = z.infer<typeof reportPathParamsSchema>;
export type ReportQueryParams = z.infer<typeof reportQueryParamsSchema>;

/**
 * Single report response types
 */
export type ReportSuccess = z.infer<typeof reportSuccessSchema>;
export type ReportError = z.infer<typeof reportErrorSchema>;

/**
 * Alias for CampaignReport (commonly used name)
 */
export type CampaignReport = ReportSuccess;

// ============================================================================
// Report Open Details Types (GET /reports/{campaign_id}/open-details)
// ============================================================================

/**
 * Report opens parameter types
 */
export type OpenListPathParams = z.infer<typeof openListPathParamsSchema>;
export type OpenListQueryParams = z.infer<typeof openListQueryParamsSchema>;

/**
 * Report opens response types
 */
export type ReportOpenListSuccess = z.infer<typeof reportOpenListSuccessSchema>;
export type OpenListError = z.infer<typeof openListErrorSchema>;
export type ReportOpenListMember = z.infer<typeof reportListMemberSchema>;

/**
 * Sort direction type for open details
 */
export type SortDirection = (typeof OPEN_DETAILS_SORT_DIRECTIONS)[number];

// ============================================================================
// Report Abuse Reports Types (GET /reports/{campaign_id}/abuse-reports)
// ============================================================================

/**
 * Abuse reports parameter types
 */
export type AbuseReportsPathParams = z.infer<
  typeof abuseReportsPathParamsSchema
>;
export type AbuseReportsQueryParams = z.infer<
  typeof abuseReportsQueryParamsSchema
>;

/**
 * Abuse reports response types
 */
export type AbuseReport = z.infer<typeof abuseReportSchema>;
export type AbuseReportListSuccess = z.infer<
  typeof abuseReportListSuccessSchema
>;
export type AbuseReportListError = z.infer<typeof abuseReportListErrorSchema>;
