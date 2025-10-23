/**
 * Mailchimp API Campaign Advice Success Response Schema
 * Schema for successful responses from the campaign advice endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/advice
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-advice/list-campaign-feedback/
 *
 * ⚠️ ASSUMED FIELDS (based on Mailchimp API patterns):
 * - advice: array of advice objects
 * - campaign_id: string (campaign identifier)
 * - total_items: number (count of advice items)
 * - _links: array of HATEOAS links
 *
 * Note: Schema based on typical Mailchimp API response patterns.
 * May need adjustment after reviewing actual API response.
 *
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Advice type enum - sentiment of the advice item
 */
export const ADVICE_TYPE = ["negative", "positive", "neutral"] as const;

/**
 * Individual advice item schema
 * Represents a single piece of feedback/advice for the campaign
 */
export const adviceItemSchema = z.object({
  type: z.enum(ADVICE_TYPE), // "negative", "positive", or "neutral"
  message: z.string(), // The advice message text
  _links: z.array(linkSchema), // HATEOAS links for navigation
});

/**
 * Main campaign advice success response schema
 * Contains array of advice items and metadata
 */
export const campaignAdviceSuccessSchema = z.object({
  advice: z.array(adviceItemSchema), // Array of advice/feedback items for the campaign
  campaign_id: z.string().min(1), // Campaign ID this advice belongs to
  total_items: z.number().min(0), // Total number of advice items
  _links: z.array(linkSchema), // HATEOAS links for navigation
});
