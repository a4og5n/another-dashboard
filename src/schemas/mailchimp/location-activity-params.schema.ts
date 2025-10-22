/**
 * Mailchimp Campaign Location Activity Parameters Schema
 * Schema for path and query parameters for campaign location activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/locations
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-reports/list-top-open-locations/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for path parameters (campaign_id)
 */
export const locationActivityPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const locationActivityQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
