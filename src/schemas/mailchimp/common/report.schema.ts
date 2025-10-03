/**
 * Common Mailchimp Report Schema
 * Extracted from report-list-success.schema.ts for reuse across detail and list endpoints
 *
 * Issue #135: Report foundation schema extraction
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Report type enum values
 */
export const REPORT_TYPES = [
  "regular",
  "plain-text",
  "ab_split",
  "rss",
  "automation",
  "variate",
  "auto",
] as const;

/**
 * Delivery status enum values
 */
export const DELIVERY_STATUS_TYPES = [
  "delivering",
  "delivered",
  "canceling",
  "canceled",
] as const;

/**
 * Schema for bounces data in reports
 */
export const reportBouncesSchema = z.object({
  hard_bounces: z.number().min(0),
  soft_bounces: z.number().min(0),
  syntax_errors: z.number().min(0),
});

/**
 * Schema for forwards data in reports
 */
export const reportForwardsSchema = z.object({
  forwards_count: z.number().min(0),
  forwards_opens: z.number().min(0),
});

/**
 * Schema for opens data in reports
 */
export const reportOpensSchema = z.object({
  opens_total: z.number().min(0),
  proxy_excluded_opens: z.number().min(0).optional(),
  unique_opens: z.number().min(0),
  proxy_excluded_unique_opens: z.number().min(0).optional(),
  open_rate: z.number().min(0).max(100), // number between 0 and 100
  proxy_excluded_open_rate: z.number().min(0).max(100).optional(), // number between 0 and 100
  last_open: z.iso.datetime({ offset: true }), // ISO 8601 format
});

/**
 * Schema for clicks data in reports
 */
export const reportClicksSchema = z.object({
  clicks_total: z.number().min(0),
  unique_clicks: z.number().min(0),
  unique_subscriber_clicks: z.number().min(0),
  click_rate: z.number().min(0).max(100), // number between 0 and 100
  last_click: z.iso.datetime({ offset: true }), // ISO 8601 format
});

/**
 * Schema for Facebook likes data in reports
 */
export const reportFacebookLikesSchema = z.object({
  recipient_likes: z.number().min(0),
  unique_likes: z.number().min(0),
  facebook_likes: z.number().min(0),
});

/**
 * Schema for industry statistics in reports
 */
export const reportIndustryStatsSchema = z.object({
  type: z.string(),
  open_rate: z.number(),
  click_rate: z.number(),
  bounce_rate: z.number(),
  unopen_rate: z.number(),
  unsub_rate: z.number(),
  abuse_rate: z.number(),
});

/**
 * Schema for list statistics in reports
 */
export const reportListStatsSchema = z.object({
  sub_rate: z.number(),
  unsub_rate: z.number(),
  open_rate: z.number(),
  proxy_excluded_open_rate: z.number().optional(),
  click_rate: z.number(),
});

/**
 * Schema for A/B split test data in reports
 */
export const reportAbSplitDataSchema = z.object({
  bounces: z.number().min(0),
  abuse_reports: z.number().min(0),
  unsubs: z.number().min(0),
  recipient_clicks: z.number().min(0),
  forwards: z.number().min(0),
  forwards_opens: z.number().min(0),
  opens: z.number().min(0),
  last_open: z.iso.datetime({ offset: true }),
  unique_opens: z.number().min(0),
});

/**
 * Schema for A/B split test results in reports
 */
export const reportAbSplitSchema = z.object({
  a: reportAbSplitDataSchema,
  b: reportAbSplitDataSchema,
});

/**
 * Schema for timewarp data in reports
 */
export const reportTimewarpSchema = z.array(
  z.object({
    gmt_offset: z.number(),
    opens: z.number().min(0),
    last_open: z.iso.datetime({ offset: true }), // ISO 8601 format
    unique_opens: z.number().min(0),
    clicks: z.number().min(0),
    last_click: z.iso.datetime({ offset: true }), // ISO 8601 format
    unique_clicks: z.number().min(0),
    bounces: z.number().min(0),
  }),
);

/**
 * Schema for timeseries data in reports
 */
export const reportTimeseriesSchema = z.array(
  z.object({
    timestamp: z.iso.datetime({ offset: true }), // ISO 8601 format
    emails_sent: z.number().min(0),
    unique_opens: z.number().min(0),
    proxy_excluded_unique_opens: z.number().min(0),
    recipients_clicks: z.number().min(0),
  }),
);

/**
 * Schema for share report data
 */
export const reportShareReportSchema = z.object({
  share_url: z.string(),
  share_password: z.string(),
});

/**
 * Schema for ecommerce data in reports
 */
export const reportEcommerceSchema = z.object({
  total_orders: z.number().min(0),
  total_spent: z.number().min(0),
  total_revenue: z.number().min(0),
  currency_code: z.string().optional(),
});

/**
 * Schema for delivery status in reports
 */
export const reportDeliveryStatusSchema = z.object({
  enabled: z.boolean(),
  can_cancel: z.boolean(),
  status: z.enum(DELIVERY_STATUS_TYPES),
  emails_sent: z.number().min(0),
  emails_canceled: z.number().min(0),
});

/**
 * Schema for individual report (reusable across endpoints)
 */
export const reportSchema = z.object({
  id: z.string(),
  campaign_title: z.string(),
  type: z.enum(REPORT_TYPES),
  list_id: z.string(),
  list_is_active: z.boolean(),
  list_name: z.string(),
  subject_line: z.string(),
  preview_text: z.string(),
  emails_sent: z.number().min(0),
  abuse_reports: z.number().min(0),
  unsubscribed: z.number().min(0),
  send_time: z.iso.datetime({ offset: true }), // ISO 8601 format
  rss_last_send: z.iso.datetime({ offset: true }).optional(), // ISO 8601 format
  bounces: reportBouncesSchema,
  forwards: reportForwardsSchema,
  opens: reportOpensSchema,
  clicks: reportClicksSchema,
  facebook_likes: reportFacebookLikesSchema,
  industry_stats: reportIndustryStatsSchema,
  list_stats: reportListStatsSchema,
  ab_split: reportAbSplitSchema.optional(),
  timewarp: reportTimewarpSchema.optional(),
  timeseries: reportTimeseriesSchema.optional(),
  share_report: reportShareReportSchema,
  ecommerce: reportEcommerceSchema,
  delivery_status: reportDeliveryStatusSchema,
  _links: z.array(linkSchema).optional(),
});
