/**
 * UI Schema for List Interest Categories Page Parameters
 * Validates and processes route and search params for the list interest categories page
 *
 * Route: /mailchimp/lists/[id]/interest-categories
 */

import { z } from "zod";

/**
 * Route parameters schema for list interest categories page
 * Validates the list ID from the URL path
 */
export const listInterestCategoriesPageRouteParamsSchema = z.object({
  id: z.string().min(1), // List ID from URL path
});

/**
 * Search parameters schema for list interest categories page
 * Validates pagination parameters from URL query string
 */
export const listInterestCategoriesPageSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1), // Current page number
  perPage: z.coerce.number().min(1).max(100).default(10).catch(10), // Items per page
});
