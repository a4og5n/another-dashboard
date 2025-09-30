/**
 * Mailchimp Lists Success Response Schema
 * Schema for successful responses from the Mailchimp API lists endpoint
 *
 * Endpoint: GET /lists
 * Documentation: https://mailchimp.com/developer/marketing/api/lists/get-list-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * Enum for list visibility
 */
export const LIST_VISIBILITY = ["pub", "prv"] as const;

/**
 * Contact information schema
 */
export const ListContactSchema = z.object({
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
export const ListCampaignDefaultsSchema = z.object({
  from_name: z.string(),
  from_email: z.string(),
  subject: z.string(),
  language: z.string(),
});

/**
 * Stats schema
 */
export const ListStatsSchema = z.object({
  member_count: z.number(),
  unsubscribe_count: z.number(),
  cleaned_count: z.number(),
  total_contacts: z.number().optional(),
  member_count_since_send: z.number().optional(),
  unsubscribe_count_since_send: z.number().optional(),
  cleaned_count_since_send: z.number().optional(),
  campaign_count: z.number().optional(),
  campaign_last_sent: z.string().optional(),
  merge_field_count: z.number().optional(),
  avg_sub_rate: z.number().optional(),
  avg_unsub_rate: z.number().optional(),
  target_sub_rate: z.number().optional(),
  open_rate: z.number().optional(),
  click_rate: z.number().optional(),
  last_sub_date: z.string().optional(),
  last_unsub_date: z.string().optional(),
});

/**
 * Main list schema
 */
export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  contact: ListContactSchema,
  permission_reminder: z.string(),
  use_archive_bar: z.boolean(),
  email_type_option: z.boolean(),
  visibility: z.enum(LIST_VISIBILITY),
  date_created: z.string(),
  list_rating: z.number(),
  campaign_defaults: ListCampaignDefaultsSchema,
  notify_on_subscribe: z.string().optional(),
  notify_on_unsubscribe: z.string().optional(),
  modules: z.array(z.string()).optional(),
  stats: ListStatsSchema,
});

/**
 * Lists success response schema
 */
export const ListsSuccessSchema = z.object({
  lists: z.array(ListSchema),
  total_items: z.number(),
  _links: z.array(z.any()).optional(),
});
