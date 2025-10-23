/**
 * Mailchimp API Unsubscribes Success Response Schema
 * Schema for successful responses from the campaign unsubscribes endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/unsubscribed
 * Documentation: https://mailchimp.com/developer/marketing/api/unsub-reports/list-unsubscribed-members/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import { mergeFieldSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

/**
 * Schema for an unsubscribed member
 * Contains member details and unsubscribe information
 */
export const unsubscribedMemberSchema = z.object({
  email_id: z.string().min(1),
  email_address: z.email(),
  merge_fields: mergeFieldSchema,
  vip: z.boolean(),
  timestamp: z.iso.datetime({ offset: true }), // When the member unsubscribed
  reason: z.string().optional(), // Unsubscribe reason if provided
  campaign_id: z.string().min(1),
  list_id: z.string().min(1),
  list_is_active: z.boolean(),
  _links: z.array(linkSchema).optional(),
});

/**
 * Main unsubscribes list success response schema
 * Contains array of unsubscribed members and pagination data
 */
export const unsubscribesSuccessSchema = z.object({
  unsubscribes: z.array(unsubscribedMemberSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
