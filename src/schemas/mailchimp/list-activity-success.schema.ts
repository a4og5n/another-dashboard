/**
 * Mailchimp API List Activity Success Response Schema
 * Schema for successful responses from the list activity endpoint
 *
 * Endpoint: GET /lists/{list_id}/activity
 * Documentation: https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual activity item schema
 * Represents a single activity event in the list's timeline
 */
export const listActivityItemSchema = z.object({
  day: z.iso.datetime({ offset: true }), // ISO 8601 date
  emails_sent: z.number().int().min(0), // Integer count of emails sent
  unique_opens: z.number().int().min(0), // Integer count of unique opens
  recipient_clicks: z.number().int().min(0), // Integer count of clicks
  hard_bounce: z.number().int().min(0), // Integer count of hard bounces
  soft_bounce: z.number().int().min(0), // Integer count of soft bounces
  subs: z.number().int().min(0), // Integer count of subscriptions
  unsubs: z.number().int().min(0), // Integer count of unsubscriptions
  other_adds: z.number().int().min(0), // Integer count of other additions
  other_removes: z.number().int().min(0), // Integer count of other removals
  _links: z.array(linkSchema), // HATEOAS links for navigation
});

/**
 * Main list activity success response schema
 * Contains array of activity items with pagination
 */
export const listActivitySuccessSchema = z.object({
  activity: z.array(listActivityItemSchema), // Array of activity events
  list_id: z.string().min(1), // List ID
  total_items: z.number().min(0), // Total number of activities
  _links: z.array(linkSchema), // HATEOAS links for navigation
});
