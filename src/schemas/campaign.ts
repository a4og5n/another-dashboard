import { z } from "zod";

/**
 * Zod schema for a single Mailchimp campaign object
 * Used for validating campaign data in dashboard components and actions.
 */
export const CampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  emailsSent: z.number(),
  sendTime: z.string(),
});

/**
 * Zod schema for an array of Mailchimp campaigns
 */
export const CampaignsArraySchema = z.array(CampaignSchema);
