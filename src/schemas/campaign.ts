import { z } from "zod";
import { MAILCHIMP_CAMPAIGN_STATUS } from "@/schemas/mailchimp/campaign-list-response.schema";

/**
 * Zod schema for a single Mailchimp campaign object
 * Used for validating campaign data in dashboard components and actions.
 */
export const CampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(MAILCHIMP_CAMPAIGN_STATUS).or(z.string()), // Allow known statuses or any string for flexibility
  emailsSent: z.number(),
  sendTime: z.string(),
});

/**
 * Zod schema for an array of Mailchimp campaigns
 */
export const CampaignsArraySchema = z.array(CampaignSchema);
