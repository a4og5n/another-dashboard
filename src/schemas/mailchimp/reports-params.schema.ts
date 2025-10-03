/**
 * Mailchimp API Reports List Parameters Schema
 * Schema for query parameters when requesting campaign reports list
 *
 * Issue #126: Reports endpoint query parameter validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Report type enum values for query filtering
 */
export const REPORT_QUERY_TYPES = [
  "regular",
  "plaintext",
  "absplit",
  "rss",
  "variate",
] as const;

/**
 * Query parameters schema for reports list endpoint
 *
 * Note: For developer convenience, server actions can accept fields as arrays and use
 * convertFieldsToCommaString() utility to transform them to the API's comma-separated format.
 */
export const reportListParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10).optional(),
    offset: z.coerce.number().min(0).default(0).optional(),
    type: z.enum(REPORT_QUERY_TYPES).optional(),
    before_send_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 format
    since_send_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 format
    folder_id: z.string().optional(),
    member_id: z.string().optional(),
    list_id: z.string().optional(),
    sort_field: z.string().optional(),
    sort_dir: z.enum(["ASC", "DESC"]).optional(),
  })
  .strict()
  .optional();
