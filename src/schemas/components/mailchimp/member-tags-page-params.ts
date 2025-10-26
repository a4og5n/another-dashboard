/**
 * UI-level schema for Member Tags page route and search parameters
 *
 * This schema validates URL parameters at the component/UI level,
 * separate from the API-level schema used in DAL calls.
 */

import { z } from "zod";

/**
 * Route parameters schema for member tags page
 * Validates the list_id and subscriber_hash from the URL path
 */
export const memberTagsPageRouteParamsSchema = z.object({
  id: z.string().min(1),
  subscriber_hash: z.string().min(1),
});

/**
 * Search parameters schema for member tags page
 * Validates query string parameters from the URL (pagination)
 */
export const memberTagsPageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});
