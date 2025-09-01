/**
 * Mailchimp Audience Schema
 * Updated to match actual Mailchimp Marketing API response structure
 *
 * Issue #84: Removed unverified fields and aligned with official API documentation
 * Conservative approach: only includes documented or verified fields
 */
import { z } from "zod";

/**
 * Visibility enum for Mailchimp audiences
 */
export const VISIBILITY = ["pub", "prv"] as const;

/**
 * Sync status enum for database operations
 */
export const SYNC_STATUS = [
  "pending",
  "syncing",
  "completed",
  "failed",
] as const;

/**
 * Sort fields enum for query filters
 */
export const SORT_FIELDS = [
  "created_at",
  "updated_at",
  "name",
  "member_count",
  "engagement_rate",
] as const;

/**
 * Sort order enum
 */
export const SORT_ORDER = ["asc", "desc"] as const;

/**
 * Schema for audience query filters in the database
 */
export const AudienceQueryFiltersSchema = z.object({
  // Basic filters
  ids: z.array(z.string()).optional(),
  name_contains: z.string().optional(),
  visibility: z.enum(VISIBILITY).optional(),

  // Status filters
  sync_status: z.enum(SYNC_STATUS).optional(),
  is_deleted: z.boolean().optional(),

  // Date filters
  created_after: z.string().optional(),
  created_before: z.string().optional(),
  last_synced_after: z.string().optional(),
  last_synced_before: z.string().optional(),

  // Performance filters
  min_member_count: z.number().int().min(0).optional(),
  max_member_count: z.number().int().min(0).optional(),
  min_engagement_rate: z.number().min(0).max(1).optional(),

  // Pagination
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
  sort_by: z.enum(SORT_FIELDS).default("created_at"),
  sort_order: z.enum(SORT_ORDER).default("desc"),
});

/**
 * Schema for audience aggregate statistics
 * Simplified to match data actually available from Mailchimp API
 */
export const AudienceStatsSchema = z.object({
  total_audiences: z.number().int().min(0),
  total_members: z.number().int().min(0),
  audiences_by_visibility: z.object({
    pub: z.number().int().min(0),
    prv: z.number().int().min(0),
  }),
});

/**
 * Validation helper functions
 */
export const AudienceModelValidators = {
  /**
   * Validates query filters
   */
  validateFilters: (data: unknown) => {
    const result = AudienceQueryFiltersSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid query filters: ${result.error.message}`);
    }
    return result.data;
  },
};
