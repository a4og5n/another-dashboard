/**
 * Mailchimp API Report Click List Success Response Schema
 * Schema for successful responses from the report click details endpoint
 *
 * Issue #126: Reports endpoint success response structure validation
 * Endpoint: GET /reports/{campaign_id}/click-details
 * Documentation: https://mailchimp.com/developer/marketing/api/click-reports/list-campaign-click-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Schema for A/B split test data in click reports
 * Note: This differs from the main report ab_split schema (common/report.schema.ts)
 * because the click details endpoint returns click-specific metrics rather than
 * general campaign metrics.
 */
export const clickReportAbSplitDataSchemaA = z.object({
  total_clicks_a: z.number().min(0),
  click_percentage_a: z.number().min(0).max(100),
  unique_clicks_a: z.number().min(0),
  unique_click_percentage_a: z.number().min(0).max(100),
});

export const clickReportAbSplitDataSchemaB = z.object({
  total_clicks_b: z.number().min(0),
  click_percentage_b: z.number().min(0).max(100),
  unique_clicks_b: z.number().min(0),
  unique_click_percentage_b: z.number().min(0).max(100),
});

/**
 * Schema for A/B split test results in click reports
 * Only present for campaigns that use A/B testing
 */
export const clickReportAbSplitSchema = z.object({
  a: clickReportAbSplitDataSchemaA,
  b: clickReportAbSplitDataSchemaB,
});

export const urlClickedSchema = z.object({
  id: z.string().min(1),
  url: z.url(),
  total_clicks: z.number().min(0),
  click_percentage: z.number().min(0).max(100),
  unique_clicks: z.number().min(0),
  unique_click_percentage: z.number().min(0).max(100),
  last_click: z.union([
    z.iso.datetime({ offset: true }), // ISO 8601 with timezone offset
    z.literal(""), // Empty string when URL has never been clicked
  ]),
  ab_split: clickReportAbSplitSchema.optional(),
  campaign_id: z.string().min(1),
  _links: z.array(linkSchema).optional(),
});

/**
 * Main reports list success response schema
 */
export const reportClickListSuccessSchema = z.object({
  urls_clicked: z.array(urlClickedSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
