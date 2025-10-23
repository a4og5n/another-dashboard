/**
 * Mailchimp API Campaign Abuse Reports List Parameters Schema
 * Schema for path and query parameters for campaign abuse reports list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/abuse-reports
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for path parameters (campaign_id)
 */
export const abuseReportsPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

/**
 * Schema for query parameters (optional field filtering)
 *
 * Note: For developer convenience, server actions can accept fields as arrays and use
 * convertFieldsToCommaString() utility to transform them to the API's comma-separated format.
 */
export const abuseReportsQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
