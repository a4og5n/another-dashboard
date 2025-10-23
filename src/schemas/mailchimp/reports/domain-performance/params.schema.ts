/**
 * Mailchimp Campaign Domain Performance Parameters Schema
 * Schema for path and query parameters for campaign domain performance endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/domain-performance
 * Documentation: https://mailchimp.com/developer/marketing/api/domain-performance-reports/list-domain-performance-stats/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Schema for path parameters (campaign_id)
 */
export const domainPerformancePathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Schema for query parameters (pagination and field filtering)
 */
export const domainPerformanceQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
