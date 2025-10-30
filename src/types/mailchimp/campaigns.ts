/**
 * Campaign Types
 * Types derived from campaigns schemas
 */

import type { z } from "zod";
import type {
  campaignSchema,
  campaignsSuccessSchema,
} from "@/schemas/mailchimp/campaigns/campaigns-success.schema";

/**
 * Individual campaign
 */
export type Campaign = z.infer<typeof campaignSchema>;

/**
 * Campaigns list response
 */
export type CampaignsResponse = z.infer<typeof campaignsSuccessSchema>;
