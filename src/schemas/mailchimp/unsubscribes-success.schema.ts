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

/**
 * Schema for Mailchimp merge field address type
 * Reused from report-list-member pattern
 */
const mergeFieldAddressSchema = z.object({
  addr1: z.string(),
  addr2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().optional(),
});

/**
 * Schema for Mailchimp merge fields
 * Supports various field types as documented at:
 * https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
 */
const mergeFieldSchema = z.record(
  z.string(),
  z.union([
    z.string(), // text, radio, dropdown, date, birthday, zip, phone, url, imageurl
    z.number(), // number
    mergeFieldAddressSchema, // address
  ]),
);

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
