/**
 * Mailchimp API Sent To Query Parameters Schema
 * Schema for request parameters to the campaign sent-to endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/sent-to
 * Documentation: https://mailchimp.com/developer/marketing/api/sent-to-reports/list-campaign-recipients/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters schema for campaign sent-to endpoint
 * Validates the campaign_id in the URL path
 */
export const sentToPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();

/**
 * Query parameters schema for campaign sent-to endpoint
 * Supports pagination and field filtering
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 * @property count - Number of records to return (1-1000, default 10)
 * @property offset - Number of records to skip for pagination (default 0)
 */
export const sentToQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
