/**
 * Mailchimp API List Activity Error Response Schema
 * Schema for error responses from the list activity endpoint
 *
 * Endpoint: GET /lists/{list_id}/activity
 * Documentation: https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * List activity error response schema
 * Extends the common Mailchimp error schema
 */
export const listActivityErrorSchema = errorSchema;
