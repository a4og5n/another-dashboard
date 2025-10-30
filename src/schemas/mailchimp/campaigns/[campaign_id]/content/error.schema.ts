/**
 * Get Campaign Content Error Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}/content
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-content/get-campaign-content/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for Get Campaign Content endpoint
 *
 * Possible error scenarios:
 * - 400 Bad Request: Invalid campaign_id format
 * - 401 Unauthorized: Invalid or missing API key
 * - 403 Forbidden: API key doesn't have permission
 * - 404 Not Found: Campaign doesn't exist or has been deleted
 * - 500 Internal Server Error: Mailchimp server error
 */
export const campaignContentErrorSchema = errorSchema;
