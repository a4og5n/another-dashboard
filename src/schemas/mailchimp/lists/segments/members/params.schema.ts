/**
 * Mailchimp API Segment Members Params Schema
 * Schema for request parameters to the segment members endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments/{segment_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters for segment members endpoint
 * Identifies which list and segment to fetch members from
 */
export const segmentMembersPathParamsSchema = z
  .object({
    list_id: z.string().min(1), // Unique ID for the list
    segment_id: z.string().min(1), // Unique ID for the segment
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for segment members endpoint
 * Controls pagination, field selection, and member status filtering
 */
export const segmentMembersQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated list of fields to include
    exclude_fields: z.string().optional(), // Comma-separated list of fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records to return (default: 10, max: 1000)
    offset: z.coerce.number().min(0).default(0), // Number of records to skip (default: 0)
    include_cleaned: z.coerce.boolean().optional(), // Include cleaned members in response
    include_transactional: z.coerce.boolean().optional(), // Include transactional members in response
    include_unsubscribed: z.coerce.boolean().optional(), // Include unsubscribed members in response
  })
  .strict(); // Reject unknown properties for input validation
