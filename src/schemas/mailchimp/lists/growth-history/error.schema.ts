/**
 * Mailchimp API List Growth History Error Response Schema
 * Schema for error responses from the list growth history endpoint
 *
 * Endpoint: GET /lists/{list_id}/growth-history
 * Documentation: https://mailchimp.com/developer/marketing/api/list-growth-history/list-growth-history-data/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * List growth history error response schema
 * Uses the common Mailchimp error schema structure
 */
export const growthHistoryErrorSchema = errorSchema;
