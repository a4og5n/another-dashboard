/**
 * UI Schema for List Segments Page Parameters
 * Validates and processes route and search params for the list segments page
 *
 * Route: /mailchimp/lists/[id]/segments
 */

import { z } from "zod";

/**
 * Route parameters schema for list segments page
 * Validates the list ID from the URL path
 */
export const listSegmentsPageRouteParamsSchema = z.object({
  id: z.string().min(1), // List ID from URL path
});

/**
 * Search parameters schema for list segments page
 * Validates pagination parameters from URL query string
 */
export const listSegmentsPageSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1), // Current page number
  perPage: z.coerce.number().min(1).max(100).default(10).catch(10), // Items per page
});
