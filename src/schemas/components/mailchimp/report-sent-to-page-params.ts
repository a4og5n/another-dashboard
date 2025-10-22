/**
 * Campaign Recipients Page Params Schemas
 * Validation schemas for report-sent-to page params and search params
 */

import { z } from "zod";

/**
 * Schema for campaign recipients page route params
 * Validates the id from the URL
 */
export const campaignRecipientsPageParamsSchema = z.object({
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
export type CampaignRecipientsPageParams = z.infer<
  typeof campaignRecipientsPageParamsSchema
>;
export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;

// Alias for consistency with route name
export const reportSentToPageParamsSchema = campaignRecipientsPageParamsSchema;
