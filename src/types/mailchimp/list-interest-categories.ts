/**
 * TypeScript types for List Interest Categories endpoint
 * Inferred from Zod schemas
 */

import type { z } from "zod";
import type {
  listInterestCategoriesPathParamsSchema,
  listInterestCategoriesQueryParamsSchema,
} from "@/schemas/mailchimp/lists/interest-categories/params.schema";
import type {
  listInterestCategoriesSuccessSchema,
  interestCategorySchema,
} from "@/schemas/mailchimp/lists/interest-categories/success.schema";
import type { listInterestCategoriesErrorSchema } from "@/schemas/mailchimp/lists/interest-categories/error.schema";

/**
 * Path parameters for list interest categories endpoint
 */
export type ListInterestCategoriesPathParams = z.infer<
  typeof listInterestCategoriesPathParamsSchema
>;

/**
 * Query parameters for list interest categories endpoint
 */
export type ListInterestCategoriesQueryParams = z.infer<
  typeof listInterestCategoriesQueryParamsSchema
>;

/**
 * Individual interest category item
 */
export type InterestCategory = z.infer<typeof interestCategorySchema>;

/**
 * Success response from list interest categories endpoint
 */
export type ListInterestCategoriesResponse = z.infer<
  typeof listInterestCategoriesSuccessSchema
>;

/**
 * Error response from list interest categories endpoint
 */
export type ListInterestCategoriesError = z.infer<
  typeof listInterestCategoriesErrorSchema
>;
