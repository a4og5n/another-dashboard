/**
 * Campaigns Page Params Schemas
 * Validation schemas for campaigns-list page params and search params
 */

import { z } from "zod";

/**
 * Schema for page search params
 * Validates pagination and sorting parameters
 */
export const pageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  sortField: z.string().optional(),
  sortDir: z.string().optional(),
});

/**
 * Alias for campaigns list page params
 */
export const campaignsListPageParamsSchema = pageSearchParamsSchema;

/**
 * Inferred TypeScript types from schemas
 */
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
