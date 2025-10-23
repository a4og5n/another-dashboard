/**
 * List Activity Page Params Schemas
 * Validation schemas for list-activity page params and search params
 */

import { z } from "zod";

/**
 * Schema for list activity page route params
 * Validates the id from the URL
 */
export const listActivityPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

/**
 * Schema for page search params
 * Validates pagination parameters only
 */
export const pageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ListActivityPageParams = z.infer<
  typeof listActivityPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
