/**
 * Mailchimp Email Activity Error Response Schema
 * Schema for error responses from the email activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/email-activity
 * Documentation: https://mailchimp.com/developer/marketing/api/email-activity-reports/list-email-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Email activity error response schema
 * Reuses the common error response schema
 */
export const emailActivityErrorSchema = errorSchema;
