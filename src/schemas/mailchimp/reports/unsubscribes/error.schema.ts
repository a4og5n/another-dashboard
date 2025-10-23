/**
 * Mailchimp Campaign Unsubscribes Error Response Schema
 * Schema for error responses from the campaign unsubscribes endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/unsubscribed
 * Documentation: https://mailchimp.com/developer/marketing/api/unsub-reports/list-unsubscribed-members/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Campaign unsubscribes error response schema
 * Extends the common error response schema
 */
export const unsubscribesErrorSchema = errorSchema;
