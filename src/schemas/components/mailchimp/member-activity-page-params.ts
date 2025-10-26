/**
 * UI Schema for Member Activity Page Parameters
 * Validates route and search params for the member activity page
 */
import { z } from "zod";

/**
 * Route params schema for member activity page
 * Validates dynamic route segments: [id] and [subscriber_hash]
 */
export const memberActivityPageRouteParamsSchema = z.object({
  id: z.string().min(1, "List ID is required"),
  subscriber_hash: z.string().min(1, "Subscriber hash is required"),
});

/**
 * Search params schema for member activity page
 * Validates pagination query parameters
 */
export const memberActivityPageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});
