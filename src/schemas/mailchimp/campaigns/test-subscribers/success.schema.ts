/**
 * Test Schema: Campaign Subscribers Success Response
 * Used for testing the page generator
 *
 * Endpoint: GET /reports/{campaign_id}/email-activity
 */
import { z } from "zod";

/**
 * Email activity schema
 */
export const emailActivitySchema = z.object({
  campaign_id: z.string(),
  list_id: z.string(),
  list_is_active: z.boolean(),
  email_id: z.string(),
  email_address: z.email(),
  activity: z.array(
    z.object({
      action: z.string(),
      timestamp: z.iso.datetime({ offset: true }),
      url: z.string().optional(),
      type: z.string().optional(),
      ip: z.string().optional(),
    }),
  ),
});

/**
 * Success response schema
 */
export const subscribersSuccessSchema = z.object({
  emails: z.array(emailActivitySchema),
  campaign_id: z.string(),
  total_items: z.number(),
});
