/**
 * Report Opens Page Params Schemas
 * Validation schemas for campaign opens page params and search params
 */

import { z } from "zod";

/**
 * Schema for report opens page route params
 * Validates the campaign ID from the URL
 * Campaign IDs are typically hexadecimal strings (10 chars) from Mailchimp API
 * Using lenient validation to handle various ID formats
 */
export const reportOpensPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});

/**
 * Schema for report opens page search params
 * Validates pagination parameters only
 * Note: Mailchimp API accepts sort parameters but does not implement sorting
 */
export const reportOpensPageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ReportOpensPageParams = z.infer<typeof reportOpensPageParamsSchema>;
export type ReportOpensPageSearchParams = z.infer<
  typeof reportOpensPageSearchParamsSchema
>;
