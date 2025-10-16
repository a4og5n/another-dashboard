/**
 * List Page Params Schemas
 * Validation schemas for list detail page params and search params
 */

import { z } from "zod";

const TABS = ["overview", "stats", "settings"] as const;

/**
 * Schema for list page route params
 * Validates the list ID from the URL
 * List IDs are typically hexadecimal strings (10 chars) from Mailchimp API
 * Using lenient validation to handle various ID formats
 */
export const listPageParamsSchema = z.object({
  id: z.string().min(1, "List ID is required"),
});

/**
 * Schema for list page search params
 * Validates the active tab parameter
 */
export const listPageSearchParamsSchema = z.object({
  tab: z.enum(TABS).default(TABS[0]),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ListPageParams = z.infer<typeof listPageParamsSchema>;
export type ListPageSearchParams = z.infer<typeof listPageSearchParamsSchema>;
