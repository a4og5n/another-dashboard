/**
 * Mailchimp API Campaign Abuse Reports List Success Response Schema
 * Schema for successful responses from the campaign abuse reports list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/abuse-reports
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Schema for Mailchimp merge field address type
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
 * Individual abuse report schema
 * Represents a single abuse complaint for a campaign
 */
export const abuseReportSchema = z.object({
  id: z.number(),
  campaign_id: z.string(),
  list_id: z.string(),
  list_is_active: z.boolean(),
  email_id: z.string(),
  email_address: z.email(),
  merge_fields: mergeFieldSchema.optional(),
  vip: z.boolean(),
  date: z.iso.datetime({ offset: true }),
  _links: z.array(linkSchema),
});

/**
 * Main abuse reports list success response schema
 */
export const abuseReportListSuccessSchema = z.object({
  abuse_reports: z.array(abuseReportSchema),
  campaign_id: z.string(),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
