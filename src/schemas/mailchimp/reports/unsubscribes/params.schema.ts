/**
 * Mailchimp API Unsubscribes Query Parameters Schema
 * Schema for request parameters to the campaign unsubscribes endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/unsubscribed
 * Documentation: https://mailchimp.com/developer/marketing/api/unsub-reports/list-unsubscribed-members/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters schema for campaign unsubscribes endpoint
 * Validates the campaign_id in the URL path
 */
export const unsubscribesPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();

/**
 * Query parameters schema for campaign unsubscribes endpoint
 * Supports pagination and field filtering
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 * @property count - Number of records to return (1-1000, default 10)
 * @property offset - Number of records to skip for pagination (default 0)
 */
export const unsubscribesQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
