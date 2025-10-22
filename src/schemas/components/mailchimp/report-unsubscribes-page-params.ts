/**
 * Campaign Unsubscribes Page Params Schemas
 * Validation schemas for report-unsubscribes page params and search params
 */

import { z } from "zod";

/**
 * Schema for campaign unsubscribes page route params
 * Validates the id from the URL
 */
export const campaignUnsubscribesPageParamsSchema = z.object({
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
export type CampaignUnsubscribesPageParams = z.infer<
  typeof campaignUnsubscribesPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;
