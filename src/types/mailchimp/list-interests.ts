/**
 * List Interests Types
 * Type definitions for the list interests endpoint
 *
 * Based on: GET /lists/{list_id}/interest-categories/{interest_category_id}/interests
 */

import type { z } from "zod";
import type {
  interestSchema,
  listInterestsSuccessSchema,
} from "@/schemas/mailchimp/lists/interests/success.schema";
import type {
  listInterestsPathParamsSchema,
  listInterestsQueryParamsSchema,
} from "@/schemas/mailchimp/lists/interests/params.schema";
import type { listInterestsErrorSchema } from "@/schemas/mailchimp/lists/interests/error.schema";

/**
 * Individual interest in a category
 */
export type Interest = z.infer<typeof interestSchema>;

/**
 * Success response from list interests endpoint
 */
export type ListInterestsResponse = z.infer<typeof listInterestsSuccessSchema>;

/**
 * Path parameters for list interests endpoint
 */
export type ListInterestsPathParams = z.infer<
  typeof listInterestsPathParamsSchema
>;

/**
 * Query parameters for list interests endpoint
 */
export type ListInterestsQueryParams = z.infer<
  typeof listInterestsQueryParamsSchema
>;

/**
 * Error response from list interests endpoint
 */
export type ListInterestsError = z.infer<typeof listInterestsErrorSchema>;
