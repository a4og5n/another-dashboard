/**
 * Mailchimp API Member Info Query Parameters Schema
 * Schema for request parameters to the get member info endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/get-member-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters schema for member info endpoint
 * Validates the list_id and subscriber_hash in the URL path
 */
export const memberInfoPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
    subscriber_hash: z.string().min(1, "Subscriber hash is required"),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters schema for member info endpoint
 * Supports field filtering for response customization
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 */
export const memberInfoQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
