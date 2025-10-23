/**
 * Mailchimp API Campaign Domain Performance Error Response Schema
 * Schema for error responses from the domain performance endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/domain-performance
 * Documentation: https://mailchimp.com/developer/marketing/api/domain-performance-reports/list-domain-performance-stats/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Domain performance error response schema
 * Extends the common Mailchimp error schema
 */
export const domainPerformanceErrorSchema = errorSchema;
