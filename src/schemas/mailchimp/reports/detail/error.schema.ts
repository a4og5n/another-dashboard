/**
 * Mailchimp Campaign Report Error Response Schema
 * Schema for error responses from the campaign report endpoint
 *
 * Issue #135: Campaign report error response validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Campaign report error response schema
 * Extends the common error response schema
 */
export const reportErrorSchema = errorSchema;
