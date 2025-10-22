/**
 * Mailchimp API Sent To Success Response Schema
 * Schema for successful responses from the campaign sent-to endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/sent-to
 * Documentation: https://mailchimp.com/developer/marketing/api/sent-to-reports/list-campaign-recipients/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import { mergeFieldSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

/**
 * Status values for delivery status
 * Indicates whether the email was successfully delivered or bounced
 */
export const SENT_TO_STATUS = ["sent", "hard", "soft"] as const;

/**
 * Contact status values
 * Indicates the member's subscription status on the list
 */
export const CONTACT_STATUS = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
] as const;

/**
 * Schema for a campaign recipient (sent-to member)
 * Contains member details and engagement metrics
 */
export const sentToMemberSchema = z.object({
  email_id: z.string().min(1),
  email_address: z.email(),
  merge_fields: mergeFieldSchema,
  vip: z.boolean(),
  status: z.enum(SENT_TO_STATUS), // Delivery status
  open_count: z.number().min(0),
  last_open: z.iso.datetime({ offset: true }).optional(),
  click_count: z.number().min(0),
  last_click: z.iso.datetime({ offset: true }).optional(),
  campaign_id: z.string().min(1),
  list_id: z.string().min(1),
  list_is_active: z.boolean(),
  contact_status: z.enum(CONTACT_STATUS),
  _links: z.array(linkSchema).optional(),
});

/**
 * Main sent-to list success response schema
 * Contains array of recipients and pagination data
 */
export const sentToSuccessSchema = z.object({
  sent_to: z.array(sentToMemberSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
