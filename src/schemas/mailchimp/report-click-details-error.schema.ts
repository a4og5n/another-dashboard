/**
 * Mailchimp Campaign Click List Error Response Schema
 * Schema for error responses from the Click report list endpoint
 *
 * Issue #135: Campaign report click list  error response validation
 * Endpoint: GET /reports/{campaign_id}/click-details
 * Documentation: https://mailchimp.com/developer/marketing/api/click-reports/list-campaign-details/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Campaign report click list error response schema
 * Extends the common error response schema
 */
export const clickListErrorSchema = errorSchema;
