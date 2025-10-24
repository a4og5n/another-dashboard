/**
 * Mailchimp API List Growth History Success Response Schema
 * Schema for successful responses from the list growth history endpoint
 *
 * Endpoint: GET /lists/{list_id}/growth-history
 * Documentation: https://mailchimp.com/developer/marketing/api/list-growth-history/list-growth-history-data/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual growth history item schema
 * Represents monthly growth statistics for a list
 *
 * Note: Some fields are deprecated by Mailchimp and will always return 0.
 * See: https://mailchimp.com/developer/release-notes/deprecated-fields-growth-history-endpoint/
 */
export const growthHistoryItemSchema = z.object({
  list_id: z.string().min(1), // List ID for this growth history record
  month: z.string().min(1), // Month in YYYY-MM format (e.g., "2024-01")
  existing: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  imports: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  optins: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  subscribed: z.number().int().min(0), // Total new subscriptions for the month
  unsubscribed: z.number().int().min(0), // Total unsubscribes for the month
  reconfirm: z.number().int().min(0), // Reconfirmation requests sent
  cleaned: z.number().int().min(0), // Cleaned/removed invalid addresses
  pending: z.number().int().min(0), // Pending confirmations
  deleted: z.number().int().min(0), // Deleted members
  transactional: z.number().int().min(0), // Transactional email recipients
  _links: z.array(linkSchema), // HATEOAS links for navigation
});

/**
 * Main list growth history success response schema
 * Contains array of monthly growth data with pagination
 */
export const growthHistorySuccessSchema = z.object({
  history: z.array(growthHistoryItemSchema), // Array of monthly growth records
  list_id: z.string().min(1), // List ID
  total_items: z.number().min(0), // Total number of growth history records
  _links: z.array(linkSchema), // HATEOAS links for navigation
});
