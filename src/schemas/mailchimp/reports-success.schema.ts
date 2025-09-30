/**
 * Mailchimp API Reports List Success Response Schema
 * Schema for successful responses from the reports list endpoint
 *
 * Issue #126: Reports endpoint success response structure validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { LinkSchema } from "@/schemas/mailchimp/common/link.schema";
import { ReportSchema } from "@/schemas/mailchimp/common/report.schema";

/**
 * Main reports list success response schema
 */
export const ReportListSuccessSchema = z.object({
  total_items: z.number().min(0),
  _links: z.array(LinkSchema),
  reports: z.array(ReportSchema),
});
