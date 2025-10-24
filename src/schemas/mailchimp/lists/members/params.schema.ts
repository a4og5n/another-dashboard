/**
 * Mailchimp API List Members Params Schema
 * Schema for request parameters to the list members endpoint
 *
 * Endpoint: GET /lists/{list_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";

/**
 * Status values for filtering list members
 * Controls which member statuses to include in results
 */
export const MEMBER_STATUS_FILTER = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;

/**
 * Email type filter values
 * Controls which email format preferences to include
 */
export const EMAIL_TYPE_FILTER = ["html", "text"] as const;

/**
 * Interest match type values
 * Controls how interest filters are applied
 */
export const INTEREST_MATCH_TYPES = ["any", "all", "none"] as const;

/**
 * Sort field values for list members
 * Fields that can be used for sorting
 */
export const MEMBER_SORT_FIELDS = [
  "timestamp_opt",
  "timestamp_signup",
  "last_changed",
] as const;

/**
 * Sort direction values
 * Controls ascending or descending sort order
 */
export const MEMBER_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

/**
 * Path parameters for list members endpoint
 * Identifies which list to fetch members from
 */
export const listMembersPathParamsSchema = z
  .object({
    list_id: z.string().min(1), // Unique ID for the list
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for list members endpoint
 * Controls pagination, filtering, and field selection
 */
export const listMembersQueryParamsSchema = z
  .object({
    fields: z.string().optional(), // Comma-separated list of fields to include
    exclude_fields: z.string().optional(), // Comma-separated list of fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records to return (default: 10, max: 1000)
    offset: z.coerce.number().min(0).default(0), // Number of records to skip (default: 0)
    email_type: z.enum(EMAIL_TYPE_FILTER).optional(), // Filter by email type (html or text)
    status: z.enum(MEMBER_STATUS_FILTER).optional(), // Filter by member status
    since_timestamp_opt: z.iso.datetime({ offset: true }).optional(), // Restrict results to members who opted in after this timestamp (ISO 8601)
    before_timestamp_opt: z.iso.datetime({ offset: true }).optional(), // Restrict results to members who opted in before this timestamp (ISO 8601)
    since_last_changed: z.iso.datetime({ offset: true }).optional(), // Restrict results to members whose data changed after this timestamp (ISO 8601)
    before_last_changed: z.iso.datetime({ offset: true }).optional(), // Restrict results to members whose data changed before this timestamp (ISO 8601)
    unique_email_id: z.string().optional(), // Filter by unique email ID
    vip_only: z.coerce.boolean().optional(), // Filter for VIP members only
    interest_category_id: z.string().optional(), // Unique ID for the interest category
    interest_ids: z.string().optional(), // Comma-separated list of interest IDs to filter by
    interest_match: z.enum(INTEREST_MATCH_TYPES).optional(), // Match type for interest filters (any, all, none)
    sort_field: z.enum(MEMBER_SORT_FIELDS).optional(), // Field to sort by
    sort_dir: z.enum(MEMBER_SORT_DIRECTIONS).optional(), // Sort direction (ASC or DESC)
    since_last_campaign: z.coerce.boolean().optional(), // Filter for members since a specific campaign was sent
    unsubscribed_since: z.iso.datetime({ offset: true }).optional(), // Filter for members who unsubscribed after this date (ISO 8601)
  })
  .strict(); // Reject unknown properties for input validation
