import { z } from "zod";

/**
 * Schema for dashboard campaign data
 * Simplified version for dashboard display components
 */
export const MailchimpDashboardCampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  emailsSent: z.number().min(0),
  sendTime: z.iso.datetime({ offset: true }), // ISO 8601 format
});

/**
 * Schema for array of dashboard campaigns
 * Used by reports table and other dashboard components
 */
export const CampaignsArraySchema = z.array(MailchimpDashboardCampaignSchema);
