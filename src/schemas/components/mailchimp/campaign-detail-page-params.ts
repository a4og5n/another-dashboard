/**
 * Campaign Detail Page Params Schema
 * Validates route parameters for campaign detail page
 */
import { z } from "zod";

export const campaignDetailPageParamsSchema = z
  .object({
    campaign_id: z.string().min(1, "Campaign ID is required"),
  })
  .strict();
