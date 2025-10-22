/**
 * Page parameter schemas for Campaign Email Activity page
 * Used for validating route parameters and search parameters
 */

import { z } from "zod";

/**
 * Schema for email activity page route parameters
 * Validates the campaign ID from the URL path
 */
export const emailActivityPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

/**
 * Schema for email activity page search parameters
 * Validates pagination parameters
 */
export const emailActivityPageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type EmailActivityPageParams = z.infer<
  typeof emailActivityPageParamsSchema
>;
export type EmailActivityPageSearchParams = z.infer<
  typeof emailActivityPageSearchParamsSchema
>;
