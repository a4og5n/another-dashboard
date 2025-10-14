/**
 * Mailchimp Lists Success Response Schema
 * Schema for successful responses from the Mailchimp API lists endpoint
 *
 * Endpoint: GET /lists
 * Documentation: https://mailchimp.com/developer/marketing/api/lists/get-list-info/
 * Follows PRD guideline: "Always use the same objt/property names as the API"
 */
import { z } from "zod";

/**
 * Enum for list visibility
 */
export const LIST_VISIBILITY = ["pub", "prv"] as const;

/**
 * Contact information schema
 */
export const listContactSchema = z.object({
  company: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
  phone: z.string().optional(),
});

/**
 * Campaign defaults schema
 */
export const listCampaignDefaultsSchema = z.object({
  from_name: z.string(),
  from_email: z.email(),
  subject: z.string(),
  language: z.string(),
});

/**
 * schema
 */
export const listConstraintsSchema = z.object({
  may_create: z.boolean(),
  max_instances: z.number(), // -1 indicates unlimited
  current_total_instances: z.number(), // -1 indicates unlimited
});

/**
 * Stats schema
 */
export const listStatsSchema = z.object({
  member_count: z.number().min(0),
  total_contacts: z.number().min(0).optional(),
  unsubscribe_count: z.number().min(0),
  cleaned_count: z.number().min(0),
  member_count_since_send: z.number().min(0),
  unsubscribe_count_since_send: z.number().min(0),
  cleaned_count_since_send: z.number().min(0),
  campaign_count: z.number().min(0),
  campaign_last_sent: z.iso.datetime({ offset: true }).optional(),
  merge_field_count: z.number().min(0),
  avg_sub_rate: z.number().optional(),
  avg_unsub_rate: z.number().optional(),
  target_sub_rate: z.number().optional(),
  open_rate: z.number().min(0).max(100).optional(),
  click_rate: z.number().min(0).max(100).optional(),
  last_sub_date: z.iso.datetime({ offset: true }).optional(),
  last_unsub_date: z.iso.datetime({ offset: true }).optional(),
});

/**
 * Main list schema
 */
export const listSchema = z.object({
  id: z.string(),
  web_id: z.number(),
  name: z.string(),
  contact: listContactSchema,
  permission_reminder: z.string(),
  use_archive_bar: z.boolean(),
  campaign_defaults: listCampaignDefaultsSchema,
  notify_on_subscribe: z.email().optional(),
  notify_on_unsubscribe: z.email().optional(),
  date_created: z.iso.datetime({ offset: true }),
  list_rating: z.number().min(0).max(5), // auto-generated activity score (0-5)
  email_type_option: z.boolean(),
  subscribe_url_short: z.url(),
  subscribe_url_long: z.url(),
  beamer_address: z.email(),
  visibility: z.enum(LIST_VISIBILITY),
  double_optin: z.boolean(),
  has_welcome: z.boolean(),
  marketing_permissions: z.boolean(),
  modules: z.array(z.string()).optional(),
  stats: listStatsSchema,
  _links: z.array(z.any()).optional(),
});

/**
 * Lists success response schema
 */
export const listsSuccessSchema = z.object({
  lists: z.array(listSchema),
  total_items: z.number(),
  constraints: listConstraintsSchema,
  _links: z.array(z.any()).optional(),
});
