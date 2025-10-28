/**
 * Get Interest Category Info Params Schema
 * Schema for path and query parameters for getting interest category info
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/interest-categories/get-interest-category-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Path parameters schema for Get Interest Category Info endpoint
 * Requires both list ID and interest category ID
 */
export const interestCategoryInfoPathParamsSchema = z
  .object({
    id: z.string().min(1), // The unique ID for the list
    interest_category_id: z.string().min(1), // The unique ID for the interest category
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters schema for Get Interest Category Info endpoint
 * Supports field filtering for API response optimization
 */
export const interestCategoryInfoQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
  })
  .strict(); // Reject unknown properties for input validation
