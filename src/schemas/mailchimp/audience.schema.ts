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
    from_email: z.string().email({ message: "Invalid email format" }),
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
