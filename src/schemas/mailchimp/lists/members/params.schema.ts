/**
 * Mailchimp API List Members Params Schema
 * Schema for request parameters to the list members endpoint
 *
 * Endpoint: GET /lists/{list_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { createEnumSortingSchema } from "@/schemas/mailchimp/common/sorting.schema";
import {
  timestampOptFilterSchema,
  lastChangedFilterSchema,
  sinceFilterSchema,
} from "@/schemas/mailchimp/common/date-filters.schema";

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
    fields: z.string().optional(), // Comma-separated fields to include
    exclude_fields: z.string().optional(), // Comma-separated fields to exclude
    count: z.coerce.number().min(1).max(1000).default(10), // Number of records (1-1000)
    offset: z.coerce.number().min(0).default(0), // Records to skip for pagination
    email_type: z.enum(EMAIL_TYPE_FILTER).optional(), // Filter by email type (html or text)
    status: z.enum(MEMBER_STATUS_FILTER).optional(), // Filter by member status
    ...timestampOptFilterSchema.shape, // since_timestamp_opt, before_timestamp_opt
    ...lastChangedFilterSchema.shape, // since_last_changed, before_last_changed
    unique_email_id: z.string().optional(), // Filter by unique email ID
    vip_only: z.coerce.boolean().optional(), // Filter for VIP members only
    interest_category_id: z.string().optional(), // Interest category ID
    interest_ids: z.string().optional(), // Comma-separated interest IDs
    interest_match: z.enum(INTEREST_MATCH_TYPES).optional(), // Interest match type (any, all, none)
    ...createEnumSortingSchema(MEMBER_SORT_FIELDS).shape, // sort_field, sort_dir
    since_last_campaign: z.coerce.boolean().optional(), // Filter since last campaign
    unsubscribed_since: sinceFilterSchema, // Filter unsubscribed after date (ISO 8601)
  })
  .strict(); // Reject unknown properties for input validation
