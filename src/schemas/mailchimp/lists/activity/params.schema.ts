/**
 * Mailchimp List Activity Parameters Schema
 * Schema for path and query parameters for list activity endpoint
 *
 * Endpoint: GET /lists/{list_id}/activity
 * Documentation: https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for path parameters (list_id)
 */
export const listActivityPathParamsSchema = z
  .object({
    list_id: z.string().min(1),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const listActivityQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
