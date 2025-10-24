/**
 * Mailchimp API List Members Success Response Schema
 * Schema for successful responses from the list members endpoint
 *
 * Endpoint: GET /lists/{list_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/list-members-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import { mergeFieldSchema } from "@/schemas/mailchimp/common/report-list-member.schema";

/**
 * Status values for member subscription status
 */
export const MEMBER_STATUS = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;

/**
 * Email type values
 */
export const EMAIL_TYPE = ["html", "text"] as const;

/**
 * The status of an SMS subscription
 */
export const sms_subscription_status = [
  "subscribed",
  "unsubscribed",
  "nonsubscribed",
  "pending",
] as const;

/**
 * Marketing permission schema
 * Represents a single marketing permission for a member
 */
export const marketingPermissionSchema = z.object({
  marketing_permission_id: z.string().min(1), // The ID for the marketing permission on the list
  text: z.string(), // The text of the permission
  enabled: z.boolean(), // Whether the member has opted in to this permission
});

/**
 * Tag schema
 * Represents a tag applied to a member
 */
export const memberTagSchema = z.object({
  id: z.number().int().min(1), // The tag ID
  name: z.string().min(1), // The name of the tag
});

/**
 * Note schema
 * Represents a note attached to a member
 */
export const memberNoteSchema = z.object({
  note_id: z.number().int().min(1), // The note ID
  created_at: z.iso.datetime({ offset: true }), // The date and time the note was created
  created_by: z.string(), // The author of the note
  note: z.string(), // The content of the note
});

/**
 * Location schema
 * Geographic location information for a member
 */
export const memberLocationSchema = z.object({
  latitude: z.number(), // The location latitude
  longitude: z.number(), // The location longitude
  gmtoff: z.number().int(), // The time difference in hours from GMT
  dstoff: z.number().int(), // The offset for daylight savings time
  country_code: z.string(), // The unique code for the location country
  timezone: z.string(), // The timezone for the location
  region: z.string().optional(), // The region for the location
});

/**
 * Stats schema
 * Engagement statistics for a member
 */
export const memberStatsSchema = z.object({
  avg_open_rate: z.number().min(0).max(1), // A member's average open rate
  avg_click_rate: z.number().min(0).max(1), // A member's average clickthrough rate
  ecommerce_data: z
    .object({
      total_revenue: z.number(), // The total revenue the member has brought in
      number_of_orders: z.number().int().min(0), // The total number of orders placed by the member
      currency_code: z.string().length(3).toUpperCase(), // The three-letter ISO 4217 code for the currency (e.g., USD, EUR, GBP)
    })
    .optional(), // E-commerce stats for the member if available
});

/**
 * Last note schema
 * Information about the most recent note added to a member
 */
export const lastNoteSchema = z.object({
  note_id: z.number().int().min(1), // The note ID
  created_at: z.iso.datetime({ offset: true }), // The date and time the note was created
  created_by: z.string(), // The author of the note
  note: z.string(), // The content of the note
});

/**
 * Schema for a list member
 * Contains complete member profile, preferences, and engagement data
 */
export const listMemberSchema = z.object({
  id: z.string().min(1), // The MD5 hash of the lowercase version of the list member's email address
  email_address: z.email(), // Email address for a subscriber
  unique_email_id: z.string().min(1), // An identifier for the address across all of Mailchimp
  contact_id: z.string().min(1).optional(), // A unique identifier for the contact
  full_name: z.string().optional(), // The contact's full name
  web_id: z.number().int().min(0), // The ID used in the Mailchimp web application
  email_type: z.enum(EMAIL_TYPE), // Type of email this member asked to get ('html' or 'text')
  status: z.enum(MEMBER_STATUS), // Subscriber's current status
  unsubscribe_reason: z.string().optional(), // The reason the member unsubscribed
  consents_to_one_to_one_messaging: z.boolean().optional(), // Indicates whether the member consents to one-to-one messaging
  sms_phone_number: z.string().optional(), // A US phone number for SMS contact
  sms_subscription_status: z.enum(sms_subscription_status).optional(), // The status of an SMS subscription
  sms_subscription_last_updated: z.iso.datetime({ offset: true }).optional(), // The datetime when the SMS subscription was last updated
  merge_fields: mergeFieldSchema, // A dictionary of merge fields where the keys are the merge tags
  interests: z.record(z.string(), z.boolean()).optional(), // The key is the interest ID and the value is a boolean indicating interest status
  stats: memberStatsSchema, // Open and click rates for this subscriber
  ip_signup: z.union([z.ipv4(), z.ipv6()]).optional(), // IP address the subscriber signed up from - IPv4 or IPv6
  timestamp_signup: z.iso.datetime({ offset: true }).optional(), // The date and time the subscriber signed up for the list
  ip_opt: z.union([z.ipv4(), z.ipv6()]).optional(), // The IP address the subscriber used to confirm their opt-in status - IPv4 or IPv6
  timestamp_opt: z.iso.datetime({ offset: true }).optional(), // The date and time the subscriber confirmed their opt-in status
  member_rating: z.number().int().min(1).max(5), // Star rating for this member (1-5, where 1 is lowest)
  last_changed: z.iso.datetime({ offset: true }), // The date and time the member's info was last changed
  language: z.string().optional(), // If set, the language of the subscriber
  vip: z.boolean(), // VIP status for subscriber
  email_client: z.string().optional(), // The email client the member uses
  location: memberLocationSchema.optional(), // Subscriber location information
  marketing_permissions: z.array(marketingPermissionSchema).optional(), // The marketing permissions for the subscriber
  last_note: lastNoteSchema.optional(), // The most recent note added about this member
  source: z.string().optional(), // The source from which the subscriber was added
  tags_count: z.number().int().min(0), // The number of tags applied to this member
  tags: z.array(memberTagSchema).optional(), // The tags applied to this member
  list_id: z.string().min(1), // The list ID
  _links: z.array(linkSchema).optional(), // A list of link types and descriptions for the API schema
});

/**
 * Main list members success response schema
 * Contains array of members and pagination data
 */
export const listMembersSuccessSchema = z.object({
  members: z.array(listMemberSchema), // An array of objects, each representing a specific list member
  list_id: z.string().min(1), // The list ID
  total_items: z.number().int().min(0), // The total number of items matching the query
  _links: z.array(linkSchema), // A list of link types and descriptions for the API schema
});
