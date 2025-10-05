/**
 * Report Opens Page Params Schemas
 * Validation schemas for campaign opens page params and search params
 */

import { z } from "zod";

/**
 * Schema for report opens page route params
 * Validates the campaign ID from the URL
 * Campaign IDs are alphanumeric strings from Mailchimp API
 */
export const reportOpensPageParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Campaign ID is required")
    .regex(/^[a-zA-Z0-9]+$/, "Campaign ID must be alphanumeric"),
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
