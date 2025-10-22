/**
 * Mailchimp Email Activity Success Response Schema
 * Schema for successful responses from the email activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/email-activity
 * Documentation: https://mailchimp.com/developer/marketing/api/email-activity-reports/list-email-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * NOTE: This schema is based on patterns from similar endpoints (opens, clicks, unsubscribes)
 * and will be validated/refined with actual API responses during testing
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Activity action types
 */
export const EMAIL_ACTIVITY_ACTIONS = ["open", "click", "bounce"] as const;

/**
 * Bounce types
 */
export const BOUNCE_TYPES = ["hard", "soft"] as const;

/**
 * Schema for a single email activity event
 * Represents one action taken by a subscriber
 */
export const emailActivitySchema = z.object({
  action: z.enum(EMAIL_ACTIVITY_ACTIONS),
  type: z.enum(BOUNCE_TYPES).optional(), // Bounce type (hard/soft) - only for bounce actions
  timestamp: z.iso.datetime({ offset: true }), // When the activity occurred
  url: z.url().optional(), // URL clicked - only for click actions
  ip: z.union([z.ipv4(), z.ipv6()]).optional(), // IP address - IPv4 or IPv6
});

/**
 * Schema for an email with activity data
 * Contains subscriber info and their activity events for the campaign
 */
export const emailWithActivitySchema = z.object({
  campaign_id: z.string().min(1),
  list_id: z.string().min(1),
  list_is_active: z.boolean(),
  email_id: z.string().min(1), // MD5 hash of lowercase email address
  email_address: z.email(),
  activity: z.array(emailActivitySchema), // Array of activity events
  _links: z.array(linkSchema).optional(),
});

/**
 * Main email activity list success response schema
 * Contains array of emails with activity and pagination data
 */
export const emailActivitySuccessSchema = z.object({
  emails: z.array(emailWithActivitySchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
