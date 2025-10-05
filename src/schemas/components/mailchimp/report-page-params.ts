/**
 * Report Page Params Schemas
 * Validation schemas for campaign report detail page params and search params
 */

import { z } from "zod";

const TABS = ["overview", "details"] as const;

/**
 * Schema for report page route params
 * Validates the campaign ID from the URL
 * Campaign IDs are alphanumeric strings from Mailchimp API
 */
export const reportPageParamsSchema = z.object({
  id: z
    .string()
    .min(1, "Campaign ID is required")
    .regex(/^[a-zA-Z0-9]+$/, "Campaign ID must be alphanumeric"),
});

/**
 * Schema for report page search params
 * Validates the active tab parameter
 */
export const reportPageSearchParamsSchema = z.object({
  tab: z.enum(TABS).default(TABS[0]),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ReportPageParams = z.infer<typeof reportPageParamsSchema>;
export type ReportPageSearchParams = z.infer<
  typeof reportPageSearchParamsSchema
>;
