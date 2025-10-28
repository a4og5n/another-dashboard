/**
 * Mailchimp API Member Tags Query Parameters Schema
 * Schema for request parameters to the list member tags endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/tags
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters schema for member tags endpoint
 * Validates the list_id and subscriber_hash in the URL path
 */
export const memberTagsPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
    subscriber_hash: z.string().min(1, "Subscriber hash is required"),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters schema for member tags endpoint
 * Supports pagination and field filtering for response customization
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 * @property count - Number of records to return (default: 10, max: 1000)
 * @property offset - Number of records to skip for pagination (default: 0)
 */
export const memberTagsQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
