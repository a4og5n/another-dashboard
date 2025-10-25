/**
 * Mailchimp API List Segments Params Schema
 * Schema for request parameters to the list segments endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segments/list-segments/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";

/**
 * Path parameters for list segments endpoint
 * Uses the standard list ID path parameter schema
 */
export const listSegmentsPathParamsSchema = listIdPathParamsSchema;

/**
 * Query parameters for list segments endpoint
 * Controls pagination, filtering, and field selection
 */
export const listSegmentsQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated list of fields to include
    exclude_fields: z.string().optional(), // Comma-separated list of fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records to return (default: 10, max: 1000)
    offset: z.coerce.number().min(0).default(0), // Number of records to skip (default: 0)
    type: z.string().optional(), // Filter by segment type (saved, static, fuzzy)
    since_created_at: z.iso.datetime({ offset: true }).optional(), // Restrict results to segments created after this timestamp (ISO 8601)
    before_created_at: z.iso.datetime({ offset: true }).optional(), // Restrict results to segments created before this timestamp (ISO 8601)
    include_cleaned: z.boolean().optional(), // Include cleaned members in response
    include_transactional: z.boolean().optional(), // Include transactional members in response
    include_unsubscribed: z.boolean().optional(), // Include unsubscribed members in response
    since_updated_at: z.iso.datetime({ offset: true }).optional(), // Restrict results to segments updated after this timestamp (ISO 8601)
    before_updated_at: z.iso.datetime({ offset: true }).optional(), // Restrict results to segments updated before this timestamp (ISO 8601)
  })
  .strict(); // Reject unknown properties for input validation
