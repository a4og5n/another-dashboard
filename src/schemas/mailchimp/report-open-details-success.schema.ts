/**
 * Mailchimp API Report Open List Success Response Schema
 * Schema for successful responses from the report open details endpoint
 *
 * Issue #126: Reports endpoint success response structure validation
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { LinkSchema } from "@/schemas/mailchimp/common/link.schema";
import { ReportListMemberSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

/**
 * Main reports list success response schema
 */
export const ReportOpenListSuccessSchema = z.object({
  members: z.array(ReportListMemberSchema),
  campaign_id: z.string(),
  total_opens: z.number(),
  total_proxy_excluded_opens: z.number(),
  total_items: z.number().min(0),
  _links: z.array(LinkSchema),
});
