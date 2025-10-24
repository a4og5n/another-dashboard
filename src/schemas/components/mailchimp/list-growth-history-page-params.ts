/**
 * List Growth History Page Params Schemas
 * Validation schemas for list-growth-history page params and search params
 */

import { z } from "zod";

/**
 * Schema for list growth history page route params
 * Validates the id from the URL
 */
export const listGrowthHistoryPageParamsSchema = z.object({
  id: z.string().min(1, "List ID is required"),
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
export type ListGrowthHistoryPageParams = z.infer<
  typeof listGrowthHistoryPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
