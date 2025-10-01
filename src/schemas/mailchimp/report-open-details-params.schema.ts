/**
 * Mailchimp Campaign Open List Parameters Schema
 * Schema for path and query parameters for campaign open list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Sort direction enum values for Open Details Reports API
 */
export const OPEN_DETAILS_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Schema for path parameters (campaign_id)
 */
export const OpenListPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const OpenListQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10).optional(),
    offset: z.coerce.number().min(0).default(0).optional(),
    since: z.iso.datetime({ offset: true }).optional(),
    sort_field: z.string().optional(),
    sort_dir: z.enum(OPEN_DETAILS_SORT_DIRECTIONS).optional(),
  })
  .strict(); // Reject unknown properties for input validation
