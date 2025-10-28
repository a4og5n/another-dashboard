/**
 * Interest Category Info Page Params Schema
 * UI-layer validation for page route and search parameters
 */

import { z } from "zod";

/**
 * Route parameters schema for Interest Category Info page
 * Validates dynamic route segments in the URL path
 */
export const interestCategoryInfoPageRouteParamsSchema = z.object({
  id: z.string().min(1), // List ID from route
  interest_category_id: z.string().min(1), // Interest Category ID from route
});

/**
 * Search parameters schema for Interest Category Info page
 * This is a detail page with no pagination or search params
 */
export const interestCategoryInfoPageSearchParamsSchema = z.object({
  // No search params for detail page
});
