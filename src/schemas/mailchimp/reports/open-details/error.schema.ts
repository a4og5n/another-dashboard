/**
 * Mailchimp Campaign Open List Error Response Schema
 * Schema for error responses from the Open report list endpoint
 *
 * Issue #135: Campaign report list error response validation
 * Endpoint: GET /reports/{campaign_id}/open-details
 * Documentation: https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Campaign report open list error response schema
 * Extends the common error response schema
 */
export const openListErrorSchema = errorSchema;
