/**
 * Mailchimp API Segment Members Success Response Schema
 * Schema for successful response from the segment members endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments/{segment_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";
import { mergeFieldSchema } from "@/schemas/mailchimp/common/report-list-member.schema";
import {
  MEMBER_STATUS,
  EMAIL_TYPE,
} from "@/schemas/mailchimp/common/constants.schema";
import {
  memberLocationSchema,
  memberStatsSchema,
  lastNoteSchema,
} from "@/schemas/mailchimp/common/list-member.schema";

/**
 * Segment member schema
 * Member object returned by segment members endpoint (subset of full member schema)
 * Note: Does NOT include tags_count, tags, or some other fields present in listMemberSchema
 */
export const segmentMemberSchema = z.object({
  id: z.string().min(1), // The MD5 hash of the lowercase version of the list member's email address
  email_address: z.email(), // Email address for a subscriber
  full_name: z.string().optional(), // The contact's full name
  unique_email_id: z.string().min(1), // An identifier for the address across all of Mailchimp
  email_type: z.enum(EMAIL_TYPE), // Type of email this member asked to get ('html' or 'text')
  status: z.enum(MEMBER_STATUS), // Subscriber's current status
  merge_fields: mergeFieldSchema, // A dictionary of merge fields where the keys are the merge tags
  interests: z.record(z.string(), z.boolean()).optional(), // The key is the interest ID and the value is a boolean indicating interest status
  stats: memberStatsSchema, // Open and click rates for this subscriber
  ip_signup: z.union([z.ipv4(), z.ipv6()]).optional(), // IP address the subscriber signed up from
  timestamp_signup: z.iso.datetime({ offset: true }).optional(), // The date and time the subscriber signed up for the list
  ip_opt: z.union([z.ipv4(), z.ipv6()]).optional(), // The IP address the subscriber used to confirm their opt-in status
  timestamp_opt: z.iso.datetime({ offset: true }).optional(), // The date and time the subscriber confirmed their opt-in status
  member_rating: z.number().int().min(1).max(5), // Star rating for this member (1-5, where 1 is lowest)
  last_changed: z.iso.datetime({ offset: true }), // The date and time the member's info was last changed
  language: z.string().optional(), // If set, the language of the subscriber
  vip: z.boolean(), // VIP status for subscriber
  email_client: z.string().optional(), // The email client the member uses
  location: memberLocationSchema.optional(), // Subscriber location information
  last_note: lastNoteSchema.optional(), // The most recent note added about this member
  list_id: z.string().min(1), // The list ID
  _links: z.array(linkSchema).optional(), // A list of link types and descriptions for the API schema
});

/**
 * Segment members success response schema
 * Contains array of members in the segment with pagination metadata
 */
export const segmentMembersSuccessSchema = z.object({
  members: z.array(segmentMemberSchema), // Array of member objects in the segment
  total_items: z.number().int().min(0), // The total number of items matching the query
  _links: z.array(linkSchema).optional(), // A list of link types and descriptions for the API schema
});
