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
import { mergeFieldSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

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
