/**
 * Mailchimp Campaign Report Detail Success Response Schema
 * Schema for successful responses from the campaign report detail endpoint
 *
 * Issue #135: Campaign report detail success response validation
 * Endpoint: GET /reports/{campaign_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { CampaignReportSchema } from "@/schemas/mailchimp/common/campaign-report.schema";

/**
 * Campaign report detail success response schema
 * Reuses the common CampaignReportSchema as the detail endpoint returns the same structure
 */
export const ReportDetailSuccessSchema = CampaignReportSchema;
