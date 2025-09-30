/**
 * Mailchimp Campaign Report Parameters Schema
 * Schema for path and query parameters for campaign report endpoint
 *
 * Issue #135: Campaign report parameters validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for path parameters (campaign_id)
 */
export const ReportPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (optional field filtering)
 */
export const ReportQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
