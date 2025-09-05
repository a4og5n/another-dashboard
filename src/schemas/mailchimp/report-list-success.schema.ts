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
import { CampaignReportSchema } from "@/schemas/mailchimp/common/campaign-report.schema";

/**
 * Main reports list success response schema
 */
export const ReportListSuccessSchema = z.object({
  total_items: z.number().min(0),
  _links: z.array(MailchimpLinkSchema),
  reports: z.array(CampaignReportSchema),
});
