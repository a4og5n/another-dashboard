/**
 * Campaign Content Page Params Schemas
 * Validation schemas for campaign-content page params and search params
 */

import { z } from "zod";

/**
 * Schema for campaign content page route params
 * Validates the campaign_id from the URL
 */
export const campaignContentPageParamsSchema = z.object({
  campaign_id: z.string().min(1, "campaign_id parameter is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type CampaignContentPageParams = z.infer<
  typeof campaignContentPageParamsSchema
>;
