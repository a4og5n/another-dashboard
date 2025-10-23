/**
 * TypeScript types for Mailchimp Location Activity API
 * Inferred from Zod schemas for type safety
 */

import type { z } from "zod";
import type {
  locationSchema,
  locationActivitySuccessSchema,
} from "@/schemas/mailchimp/location-activity-success.schema";
import type { locationActivityErrorSchema } from "@/schemas/mailchimp/location-activity-error.schema";
import type {
  locationActivityPathParamsSchema,
  locationActivityQueryParamsSchema,
} from "@/schemas/mailchimp/location-activity-params.schema";

/**
 * Single location with engagement metrics
 */
export type Location = z.infer<typeof locationSchema>;

/**
 * Location activity list success response
 */
export type LocationActivitySuccess = z.infer<
  typeof locationActivitySuccessSchema
>;

/**
 * Location activity error response
 */
export type LocationActivityError = z.infer<typeof locationActivityErrorSchema>;

/**
 * Path parameters for location activity endpoint
 */
export type LocationActivityPathParams = z.infer<
  typeof locationActivityPathParamsSchema
>;

/**
 * Query parameters for location activity endpoint
 */
export type LocationActivityQueryParams = z.infer<
  typeof locationActivityQueryParamsSchema
>;
