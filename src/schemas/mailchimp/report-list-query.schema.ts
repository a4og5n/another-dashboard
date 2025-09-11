/**
 * Mailchimp API Reports List Query Schema
 * Schema for query parameters when requesting campaign reports list
 *
 * Issue #126: Reports endpoint query parameter validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Report type enum values
 */
export const REPORT_TYPES = [
  "regular",
  "plaintext",
  "absplit",
  "rss",
  "variate",
] as const;

/**
 * Query parameters schema for reports list endpoint
 */
export const ReportListQuerySchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.number().min(1).max(1000).default(10).optional(),
    offset: z.number().min(0).default(0).optional(),
    type: z.enum(REPORT_TYPES).optional(),
    before_send_time: z.string().optional(), // ISO 8601 format
    since_send_time: z.string().optional(), // ISO 8601 format
    folder_id: z.string().optional(),
    member_id: z.string().optional(),
    list_id: z.string().optional(),
    sort_field: z.string().optional(),
    sort_dir: z.enum(["ASC", "DESC"]).optional(),
  })
  .optional();

/**
 * Internal query schema for service layer processing
 * Note: Using string type for fields and exclude_fields to match Mailchimp API requirements
 * Fields should be comma-separated lists rather than arrays
 */
export const ReportListQueryInternalSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.number().min(1).max(1000).default(10).optional(),
    offset: z.number().min(0).default(0).optional(),
    type: z.enum(REPORT_TYPES).optional(),
    before_send_time: z.string().optional(),
    since_send_time: z.string().optional(),
    folder_id: z.string().optional(),
    member_id: z.string().optional(),
    list_id: z.string().optional(),
    sort_field: z.string().optional(),
    sort_dir: z.enum(["ASC", "DESC"]).optional(),
  })
  .optional();
