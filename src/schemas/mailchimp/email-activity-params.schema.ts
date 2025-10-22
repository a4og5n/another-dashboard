/**
 * Mailchimp Email Activity Parameters Schema
 * Schema for request parameters for the email activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/email-activity
 * Documentation: https://mailchimp.com/developer/marketing/api/email-activity-reports/list-email-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Path parameters schema for email activity endpoint
 * Validates the campaign_id in the URL path
 */
export const emailActivityPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();

/**
 * Query parameters schema for email activity endpoint
 * Supports pagination, field filtering, and time-based filtering
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 * @property count - Number of records to return (1-1000, default 10)
 * @property offset - Number of records to skip for pagination (default 0)
 * @property since - ISO 8601 datetime to restrict results to activity after this time
 */
export const emailActivityQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
    since: z.iso.datetime({ offset: true }).optional(), // ISO 8601 format
  })
  .strict();
