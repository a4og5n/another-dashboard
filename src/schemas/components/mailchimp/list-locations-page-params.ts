/**
 * UI Schema for List Locations Page Parameters
 * Validates and transforms route params for the UI layer
 */

import { z } from "zod";

/**
 * Route parameters schema for list locations page
 * Validates list ID from URL path
 */
export const listLocationsPageParamsSchema = z.object({
  id: z.string().min(1),
});
