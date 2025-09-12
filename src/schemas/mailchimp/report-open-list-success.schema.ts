/**
 * Mailchimp API Reports List Success Response Schema
 * Schema for successful responses from the campaign reports list endpoint
 *
 * Issue #126: Reports endpoint success response structure validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { MailchimpLinkSchema } from "@/schemas/mailchimp/common/link.schema";
import { CampaignListMemberReportSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

/**
 * Main reports list success response schema
 */
export const ReportOpenListSuccessSchema = z.object({
  members: z.array(CampaignListMemberReportSchema),
  campaign_id: z.string(),
  total_opens: z.number(),
  total_proxy_excluded_opens: z.number(),
  total_items: z.number().min(0),
  _links: z.array(MailchimpLinkSchema),
});
