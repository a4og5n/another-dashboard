/**
 * Mailchimp Report Success Response Schema
 * Schema for successful responses from the report endpoint
 *
 * Issue #135: Report success response validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { reportSchema } from "@/schemas/mailchimp/common/report.schema";

/**
 * Report success response schema
 * Reuses the common reportSchema as the endpoint returns the same structure
 * reportSchema already includes _links as an array of linkSchema
 */
export const reportSuccessSchema = reportSchema;
