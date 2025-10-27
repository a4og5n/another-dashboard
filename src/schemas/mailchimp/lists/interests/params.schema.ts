/**
 * Mailchimp API List Interests in Category Params Schema
 * Schema for request parameters to the list interests in category endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}/interests
 * Documentation: https://mailchimp.com/developer/marketing/api/interests/list-interests-in-category/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters for list interests in category endpoint
 * Includes both list ID and interest category ID
 */
export const listInterestsPathParamsSchema = z
  .object({
    list_id: z.string().min(1), // List ID
    interest_category_id: z.string().min(1), // Interest category ID
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for list interests in category endpoint
 * Controls pagination and field selection
 */
export const listInterestsQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
    offset: z.coerce.number().min(0).default(0), // Records to skip for pagination
  })
  .strict(); // Reject unknown properties for input validation
