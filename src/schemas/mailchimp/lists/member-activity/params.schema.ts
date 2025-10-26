/**
 * Mailchimp Member Activity Feed Parameters Schema
 * Schema for request parameters for the member activity feed endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/activity-feed
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-activity-feed/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * This endpoint returns details about a subscriber's recent activity with pagination support.
 * Recommended over the older /activity endpoint which only returns last 50 events.
 */
import { z } from "zod";

/**
 * Path parameters schema for member activity endpoint
 * Validates the list_id and subscriber_hash in the URL path
 */
export const memberActivityPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
    subscriber_hash: z
      .string()
      .min(1, "Subscriber hash is required")
      .describe(
        "MD5 hash of lowercase email address, or the email address itself, or contact_id",
      ),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters schema for member activity feed endpoint
 * Supports pagination, field filtering, and activity type filtering
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 * @property count - Number of records to return (1-1000, default 10)
 * @property offset - Number of records to skip for pagination (default 0)
 * @property activity_filters - Comma-separated list of activity types to filter by
 *   Valid types: open, click, bounce, unsub, sent, conversation, note,
 *   marketing_permission, postcard_sent, squatter_signup, website_signup,
 *   landing_page_signup, ecommerce_signup, generic_signup, order, event, survey_response
 *   Example: "open,bounce,click"
 */
export const memberActivityQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
    count: z.coerce.number().min(1).max(1000).default(10),
    offset: z.coerce.number().min(0).default(0),
    activity_filters: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
