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
import {
  createdAtFilterSchema,
  updatedAtFilterSchema,
} from "@/schemas/mailchimp/common/date-filters.schema";
import { memberStatusInclusionSchema } from "@/schemas/mailchimp/common/member-status-filters.schema";

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
    ...createdAtFilterSchema.shape, // since_created_at, before_created_at
    ...memberStatusInclusionSchema.shape, // include_cleaned, include_transactional, include_unsubscribed (with proper coercion)
    ...updatedAtFilterSchema.shape, // since_updated_at, before_updated_at
  })
  .strict(); // Reject unknown properties for input validation
