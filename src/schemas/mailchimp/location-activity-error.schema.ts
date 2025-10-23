/**
 * Mailchimp API Campaign Location Activity Error Response Schema
 * Schema for error responses from the location activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/locations
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-reports/list-top-open-locations/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Location activity error response schema
 * Extends the standard Mailchimp error schema
 */
export const locationActivityErrorSchema = errorSchema;
