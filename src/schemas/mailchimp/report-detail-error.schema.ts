/**
 * Mailchimp Campaign Report Detail Error Response Schema
 * Schema for error responses from the campaign report detail endpoint
 *
 * Issue #135: Campaign report detail error response validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";

/**
 * Campaign report detail error response schema
 * Extends the common error response schema
 */
export const ReportDetailErrorSchema = mailchimpErrorResponseSchema;
