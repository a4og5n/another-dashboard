/**
 * Send Checklist Page Params Schemas
 * Validation schemas for campaign-send-checklist page params and search params
 */

import { z } from "zod";

/**
 * Schema for send checklist page route params
 * Validates the campaign_id from the URL
 */
export const sendChecklistPageParamsSchema = z.object({
  campaign_id: z.string().min(1, "campaign_id parameter is required"),
});

/**
 * Inferred TypeScript types from schemas
 */
export type SendChecklistPageParams = z.infer<
  typeof sendChecklistPageParamsSchema
>;
