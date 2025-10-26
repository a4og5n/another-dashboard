/**
 * Search Members Success Response Schema
 * Validates successful response from the Mailchimp Search Members endpoint
 *
 * Endpoint: GET /search-members
 * Source: https://mailchimp.com/developer/marketing/api/search-members/
 */

import { z } from "zod";
import {
  MEMBER_STATUS,
  EMAIL_TYPE,
  SMS_SUBSCRIPTION_STATUS,
} from "@/schemas/mailchimp/common/constants.schema";
import {
  memberLocationSchema,
  marketingPermissionSchema,
  lastNoteSchema,
  memberTagSchema,
  memberStatsSchema,
} from "@/schemas/mailchimp/common/list-member.schema";

/**
 * Individual member result in search response
 * Contains core member information across all lists
 */
const searchMemberResultSchema = z.object({
  id: z.string().min(1),
  email_address: z.email(),
  unique_email_id: z.string().min(1),
  contact_id: z.string().optional(),
  full_name: z.string().optional(),
  web_id: z.number().int(),
  email_type: z.enum(EMAIL_TYPE),
  status: z.enum(MEMBER_STATUS),
  unsubscribe_reason: z.string().optional(),
  consents_to_one_to_one_messaging: z.boolean().optional(),
  sms_phone_number: z.string().optional(),
  sms_subscription_status: z.enum(SMS_SUBSCRIPTION_STATUS).optional(),
  sms_subscription_last_updated: z.iso.datetime({ offset: true }).optional(),
  merge_fields: z.record(z.string(), z.unknown()).optional(),
  interests: z.record(z.string(), z.boolean()).optional(),
  stats: memberStatsSchema.optional(),
  ip_signup: z.union([z.ipv4(), z.ipv6()]).optional(),
  timestamp_signup: z.iso.datetime({ offset: true }).optional(),
  ip_opt: z.union([z.ipv4(), z.ipv6()]).optional(),
  timestamp_opt: z.iso.datetime({ offset: true }).optional(),
  member_rating: z.number().int().min(1).max(5).optional(),
  last_changed: z.iso.datetime({ offset: true }).optional(),
  language: z.string().optional(),
  vip: z.boolean(),
  email_client: z.string().optional(),
  location: memberLocationSchema.optional(),
  marketing_permissions: z.array(marketingPermissionSchema).optional(),
  last_note: lastNoteSchema.optional(),
  source: z.string().optional(),
  tags_count: z.number().int().min(0).optional(),
  tags: z.array(memberTagSchema).optional(),
  list_id: z.string().min(1),
  _links: z.array(z.object({ rel: z.string(), href: z.string() })).optional(),
});

/**
 * Search results section schema
 * Contains an array of member results and total count
 */
const searchResultsSchema = z.object({
  members: z.array(searchMemberResultSchema),
  total_items: z.number().int().min(0),
});

/**
 * Search Members success response schema
 * Contains exact matches and full search results
 */
export const searchMembersSuccessSchema = z.object({
  exact_matches: searchResultsSchema.optional(),
  full_search: searchResultsSchema.optional(),
  _links: z.array(z.object({ rel: z.string(), href: z.string() })).optional(),
});
