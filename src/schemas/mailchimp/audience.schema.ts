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
 * MailchimpAudienceSchema
 * Zod schema for individual Mailchimp List/Audience objects from the Marketing API
 *
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 * Service interface: /src/services/mailchimp.service.ts MailchimpList
 */
export const MailchimpAudienceSchema = z.object({
  // Core identifiers (documented fields)
  id: z.string().min(1, "Audience ID is required"),
  name: z.string().min(1, "Audience name is required"),

  // Contact information (required by API)
  contact: z.object({
    company: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),

  // List settings (documented fields)
  permission_reminder: z.string(),
  use_archive_bar: z.boolean(),
  email_type_option: z.boolean(),
  visibility: z.enum(VISIBILITY),

  // Campaign defaults (documented)
  campaign_defaults: z.object({
    from_name: z.string(),
    from_email: z.string().refine((email) => /\S+@\S+\.\S+/.test(email), {
      message: "Invalid email format",
    }),
    subject: z.string(),
    language: z.string(),
  }),

  // Notifications (documented, but often empty strings not emails)
  notify_on_subscribe: z.string().optional(),
  notify_on_unsubscribe: z.string().optional(),

  // Timestamps (documented)
  date_created: z.string(),

  // Rating (documented, 0-5 star rating)
  list_rating: z.number().int().min(0).max(5),

  // Statistics object (documented core fields)
  stats: z.object({
    // Always present in API responses
    member_count: z.number(),
    total_contacts: z.number().optional(), // Total including unsubscribed
    unsubscribe_count: z.number(),
    cleaned_count: z.number(),

    // Campaign-related stats (optional, may not be present)
    member_count_since_send: z.number().optional(),
    unsubscribe_count_since_send: z.number().optional(),
    cleaned_count_since_send: z.number().optional(),
    campaign_count: z.number().optional(),
    campaign_last_sent: z.string().optional(),

    // Engagement metrics (optional)
    merge_field_count: z.number().optional(),
    avg_sub_rate: z.number().optional(),
    avg_unsub_rate: z.number().optional(),
    target_sub_rate: z.number().optional(),
    open_rate: z.number().optional(),
    click_rate: z.number().optional(),

    // Activity timestamps (optional)
    last_sub_date: z.string().optional(),
    last_unsub_date: z.string().optional(),
  }),

  // Optional fields that may be present
  modules: z.array(z.string()).optional(),

  // Marketing permissions (structure varies, keeping generic)
  marketing_permissions: z.unknown().optional(),

  // QUESTIONABLE FIELDS - marked optional until verified
  // These exist in our MailchimpList interface but aren't in official docs
  web_id: z.number().optional(), // May be internal Mailchimp ID
  subscribe_url_short: z.string().optional(), // Subscription URLs
  subscribe_url_long: z.string().optional(),
  beamer_address: z.string().optional(), // Email-to-subscribe address
  double_optin: z.boolean().optional(), // Double opt-in setting
  has_welcome: z.boolean().optional(), // Welcome email setting

  // Additional fields that might be returned
  last_marked_as_clean: z.string().optional(),
  email_signup: z.boolean().optional(),
  sms_signup: z.boolean().optional(),
});

/**
 * Database model schema for persisting Mailchimp Audience data
 * Extends the API schema with additional fields for database operations
 */
export const AudienceModelSchema = MailchimpAudienceSchema.extend({
  // Database-specific fields
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  last_synced_at: z.string().optional(),
  sync_status: z.enum(SYNC_STATUS).default("pending"),
  is_deleted: z.boolean().default(false),

  // Cached metadata for performance
  cached_member_count: z.number().int().min(0).optional(),
  cached_stats: z
    .object({
      last_updated: z.string(),
      member_count: z.number().int().min(0),
      growth_rate: z.number().optional(),
      engagement_rate: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

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
 */
export const AudienceStatsSchema = z.object({
  total_audiences: z.number().int().min(0),
  total_members: z.number().int().min(0),
  avg_member_count: z.number().min(0),
  avg_engagement_rate: z.number().min(0).max(1),
  audiences_by_status: z.object({
    pending: z.number().int().min(0),
    syncing: z.number().int().min(0),
    completed: z.number().int().min(0),
    failed: z.number().int().min(0),
  }),
  audiences_by_visibility: z.object({
    pub: z.number().int().min(0),
    prv: z.number().int().min(0),
  }),
  last_updated: z.string(),
});

/**
 * Validation helper functions
 */
export const AudienceModelValidators = {
  /**
   * Validates audience model data
   */
  validateModel: (data: unknown) => {
    const result = AudienceModelSchema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid audience model: ${result.error.message}`);
    }
    return result.data;
  },

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
