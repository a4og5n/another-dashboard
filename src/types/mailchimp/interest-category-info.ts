/**
 * Interest Category Info Types
 * Type definitions for the interest category info endpoint
 */

import { z } from "zod";
import { interestCategoryInfoSuccessSchema } from "@/schemas/mailchimp/lists/interest-categories/[interest_category_id]/success.schema";

/**
 * Interest category detail type
 * Inferred from Zod schema for type safety
 */
export type InterestCategoryInfo = z.infer<
  typeof interestCategoryInfoSuccessSchema
>;
