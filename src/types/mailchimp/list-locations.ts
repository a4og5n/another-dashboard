/**
 * TypeScript types for List Locations endpoint
 * Inferred from Zod schemas
 */

import type { z } from "zod";
import type {
  listLocationsPathParamsSchema,
  listLocationsQueryParamsSchema,
} from "@/schemas/mailchimp/lists/locations/params.schema";
import type {
  listLocationsSuccessSchema,
  locationItemSchema,
} from "@/schemas/mailchimp/lists/locations/success.schema";
import type { listLocationsErrorSchema } from "@/schemas/mailchimp/lists/locations/error.schema";

/**
 * Path parameters for list locations endpoint
 */
export type ListLocationsPathParams = z.infer<
  typeof listLocationsPathParamsSchema
>;

/**
 * Query parameters for list locations endpoint
 */
export type ListLocationsQueryParams = z.infer<
  typeof listLocationsQueryParamsSchema
>;

/**
 * Individual location item
 */
export type LocationItem = z.infer<typeof locationItemSchema>;

/**
 * Success response from list locations endpoint
 */
export type ListLocationsResponse = z.infer<typeof listLocationsSuccessSchema>;

/**
 * Error response from list locations endpoint
 */
export type ListLocationsError = z.infer<typeof listLocationsErrorSchema>;
