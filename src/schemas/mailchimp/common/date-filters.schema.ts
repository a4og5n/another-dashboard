/**
 * Common Date Filter Schemas for Mailchimp API
 * Reusable date/time filtering patterns to eliminate duplication
 *
 * Consolidates duplicate date filter patterns from 6+ files:
 * - lists/params.schema.ts (before_date_created, since_date_created, etc.)
 * - lists/members/params.schema.ts (since_timestamp_opt, before_timestamp_opt, etc.)
 * - lists/segments/params.schema.ts (since_created_at, before_created_at, etc.)
 * - automations-params.schema.ts (before_create_time, since_create_time, etc.)
 * - reports/open-details/params.schema.ts (since)
 *
 * Related: Issue #252 (Filter System Standardization)
 */
import { z } from "zod";

/**
 * Base ISO 8601 datetime schema with timezone offset
 * All Mailchimp API datetime filters use this format
 */
const isoDatetimeSchema = z.iso.datetime({ offset: true });

/**
 * Simple "since" datetime filter
 * Use for endpoints that only support filtering after a date
 *
 * @example
 * ```typescript
 * export const queryParamsSchema = z.object({
 *   ...standardQueryParamsSchema.shape,
 *   since: sinceFilterSchema,
 * });
 * ```
 */
export const sinceFilterSchema = isoDatetimeSchema.optional();

/**
 * Simple "before" datetime filter
 * Use for endpoints that only support filtering before a date
 */
export const beforeFilterSchema = isoDatetimeSchema.optional();

/**
 * Create a date range filter schema with custom field names
 * Use for endpoints that support both "since" and "before" filtering
 *
 * @param sinceFieldName - Name of the "since" field (e.g., "since_created_at")
 * @param beforeFieldName - Name of the "before" field (e.g., "before_created_at")
 * @returns Zod object schema with both fields
 *
 * @example
 * ```typescript
 * // Created date range
 * const createdAtFilter = createDateRangeFilterSchema(
 *   "since_created_at",
 *   "before_created_at"
 * );
 *
 * // Updated date range
 * const updatedAtFilter = createDateRangeFilterSchema(
 *   "since_updated_at",
 *   "before_updated_at"
 * );
 * ```
 */
export function createDateRangeFilterSchema(
  sinceFieldName: string,
  beforeFieldName: string,
) {
  return z.object({
    [sinceFieldName]: isoDatetimeSchema.optional(),
    [beforeFieldName]: isoDatetimeSchema.optional(),
  });
}

/**
 * Pre-built created_at date range filter
 * Most common pattern across Mailchimp API endpoints
 */
export const createdAtFilterSchema = z.object({
  since_created_at: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_created_at: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built updated_at date range filter
 * Common pattern for endpoints tracking resource updates
 */
export const updatedAtFilterSchema = z.object({
  since_updated_at: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_updated_at: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built date_created date range filter
 * Used by lists and some campaign endpoints
 */
export const dateCreatedFilterSchema = z.object({
  since_date_created: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_date_created: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built timestamp_opt date range filter
 * Used by list members for opt-in timestamp filtering
 */
export const timestampOptFilterSchema = z.object({
  since_timestamp_opt: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_timestamp_opt: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built last_changed date range filter
 * Used by list members for tracking data changes
 */
export const lastChangedFilterSchema = z.object({
  since_last_changed: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_last_changed: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built campaign_last_sent date range filter
 * Used by lists endpoint for campaign activity filtering
 */
export const campaignLastSentFilterSchema = z.object({
  since_campaign_last_sent: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_campaign_last_sent: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built create_time date range filter
 * Used by automations endpoint
 */
export const createTimeFilterSchema = z.object({
  since_create_time: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_create_time: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});

/**
 * Pre-built start_time date range filter
 * Used by automations endpoint
 */
export const startTimeFilterSchema = z.object({
  since_start_time: isoDatetimeSchema.optional(), // ISO 8601 with timezone
  before_start_time: isoDatetimeSchema.optional(), // ISO 8601 with timezone
});
