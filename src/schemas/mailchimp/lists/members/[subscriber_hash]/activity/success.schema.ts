/**
 * Mailchimp Member Activity Feed Success Response Schema
 * Schema for successful responses from the member activity feed endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/activity-feed
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-activity-feed/
 * Alternative Schemas: https://mailchimp.com/developer/marketing/docs/alternative-schemas/#activity-schemas
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Returns paginated activity events for a member on a specific list.
 * Uses discriminated union based on activity_type field.
 * Supports pagination with count and offset parameters.
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Activity filter types for member activity feed
 *
 * Complete list of activity types that can appear in the activity feed.
 * These correspond to the activity_filters parameter values.
 *
 * Source: https://mailchimp.com/developer/marketing/docs/alternative-schemas/#activity-schemas
 */
export const MEMBER_ACTIVITY_FILTERS = [
  "open",
  "click",
  "bounce",
  "unsub",
  "sent",
  "conversation",
  "note",
  "marketing_permission",
  "postcard_sent",
  "squatter_signup",
  "website_signup",
  "landing_page_signup",
  "ecommerce_signup",
  "generic_signup",
  "order",
  "event",
  "survey_response",
] as const;

/**
 * Bounce types for bounce actions
 */
export const BOUNCE_TYPES = ["hard", "soft"] as const;

/**
 * Generic activity types (not yet fully typed with discriminated unions)
 *
 * TODO: Add discriminated union schemas for these types (Issue #269)
 */
export const GENERIC_ACTIVITY_TYPES = [
  "marketing_permission",
  "postcard_sent",
  "squatter_signup",
  "website_signup",
  "landing_page_signup",
  "ecommerce_signup",
  "generic_signup",
  "order",
  "event",
  "survey_response",
] as const;

/**
 * Open Activity Schema
 * Activity feed item representing opening an email
 */
export const openActivitySchema = z.object({
  activity_type: z.literal("open"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
});

/**
 * Click Activity Schema
 * Activity feed item representing having a link clicked by a contact
 */
export const clickActivitySchema = z.object({
  activity_type: z.literal("click"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
  link_clicked: z.url(),
});

/**
 * Bounce Activity Schema
 * Activity feed item representing an email to this contact bouncing
 */
export const bounceActivitySchema = z.object({
  activity_type: z.literal("bounce"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
  bounce_type: z.enum(BOUNCE_TYPES),
  bounce_has_open_activity: z.boolean(),
});

/**
 * Unsubscribe Activity Schema
 * Activity feed item representing this contact unsubscribing from a list
 */
export const unsubActivitySchema = z.object({
  activity_type: z.literal("unsub"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
  is_admin_unsubscribed: z.boolean(),
  unsubscribe_reason: z.string(),
});

/**
 * Sent Activity Schema
 * Activity feed item representing having an email sent to the contact
 */
export const sentActivitySchema = z.object({
  activity_type: z.literal("sent"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
});

/**
 * Conversation Activity Schema
 * Activity feed item representing an individual reply in a conversation
 */
export const conversationActivitySchema = z.object({
  activity_type: z.literal("conversation"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  campaign_id: z.string().min(1),
  campaign_title: z.string(),
  thread_id: z.string().min(1),
  message_text: z.string(),
  created_by: z.string(),
  is_user: z.boolean(),
  has_read: z.boolean(),
  from_email: z.email(),
  avatar_url: z.url(),
});

/**
 * Note Activity Schema
 * Activity feed item representing a note on the contact record
 */
export const noteActivitySchema = z.object({
  activity_type: z.literal("note"),
  created_at_timestamp: z.iso.datetime({ offset: true }),
  updated_at_timestamp: z.iso.datetime({ offset: true }),
  note_id: z.string().min(1),
  note_text: z.string(),
  created_by: z.string(),
  avatar_url: z.url(),
});

/**
 * Generic/Fallback Activity Schema
 * For activity types not yet fully typed
 *
 * Uses catchall to allow unknown fields since these activity types
 * haven't been fully documented yet.
 *
 * TODO: Add discriminated union schemas for these types (Issue #269)
 */
export const genericActivitySchema = z
  .object({
    activity_type: z.enum(GENERIC_ACTIVITY_TYPES),
    created_at_timestamp: z.iso.datetime({ offset: true }),
  })
  .catchall(z.unknown()); // Zod 4: Use catchall instead of deprecated passthrough

/**
 * Discriminated Union of all activity types
 * Uses activity_type as the discriminator field
 */
export const memberActivityEventSchema = z.discriminatedUnion("activity_type", [
  openActivitySchema,
  clickActivitySchema,
  bounceActivitySchema,
  unsubActivitySchema,
  sentActivitySchema,
  conversationActivitySchema,
  noteActivitySchema,
  genericActivitySchema,
]);

/**
 * Main member activity feed success response schema
 * Contains array of paginated activity events and links
 *
 * Supports pagination via count/offset query parameters.
 *
 * @property email_id - MD5 hash of lowercase email address
 * @property list_id - The list ID
 * @property activity - Array of activity events (paginated)
 * @property total_items - Total number of activity events available
 * @property _links - HATEOAS links for related resources
 */
export const memberActivitySuccessSchema = z.object({
  activity: z.array(memberActivityEventSchema),
  email_id: z.string().min(1),
  list_id: z.string().min(1),
  _links: z.array(linkSchema).optional(),
});
