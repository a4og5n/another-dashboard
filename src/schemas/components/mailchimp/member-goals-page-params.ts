/**
 * UI Schema for Member Goals Page Parameters
 * Validates and transforms route and search params for the UI layer
 */

import { z } from "zod";

/**
 * Route parameters schema for member goals page
 * Validates list ID and subscriber hash from URL path
 */
export const memberGoalsPageRouteParamsSchema = z.object({
  id: z.string().min(1),
  subscriber_hash: z.string().min(1),
});

/**
 * Search parameters schema for member goals page
 * Validates query string parameters for pagination
 */
export const memberGoalsPageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});
