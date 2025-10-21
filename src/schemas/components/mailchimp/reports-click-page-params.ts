/**
 * Click Details Page Params Schemas
 * Validation schemas for reports-click page params and search params
 */

import { z } from "zod";

/**
 * Schema for click details page route params
 * Validates the id from the URL
 */
export const clickDetailsPageParamsSchema = z.object({
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
export type ClickDetailsPageParams = z.infer<
  typeof clickDetailsPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
