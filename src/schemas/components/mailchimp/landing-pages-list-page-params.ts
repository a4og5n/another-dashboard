/**
 * Landing Pages Page Params Schemas
 * Validation schemas for landing-pages-list page params and search params
 */

import { z } from "zod";

/**
 * Schema for page search params
 * Validates pagination and sorting parameters (UI format with camelCase)
 */
export const pageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  sortField: z.string().optional(), // UI uses camelCase
  sortDir: z.string().optional(), // UI uses camelCase
});

/**
 * Inferred TypeScript types from schemas
 */
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
