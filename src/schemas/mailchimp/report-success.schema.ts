/**
 * Mailchimp Report Success Response Schema
 * Schema for successful responses from the report endpoint
 *
 * Issue #135: Report success response validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { ReportSchema } from "@/schemas/mailchimp/common/report.schema";

/**
 * Report success response schema
 * Reuses the common ReportSchema as the endpoint returns the same structure
 * ReportSchema already includes _links as an array of LinkSchema
 */
export const ReportSuccessSchema = ReportSchema;
