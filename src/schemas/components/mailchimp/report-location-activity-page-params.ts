/**
 * Campaign Locations Page Params Schemas
 * Validation schemas for report-location-activity page params and search params
 */

import { z } from "zod";

/**
 * Schema for campaign locations page route params
 * Validates the id from the URL
 */
export const reportLocationActivityPageParamsSchema = z.object({
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
export type ReportLocationActivityPageParams = z.infer<
  typeof reportLocationActivityPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
