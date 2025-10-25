/**
 * Mailchimp API List Segments Success Response Schema
 * Schema for the successful response from the list segments endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segments/list-segments/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Segment type enum
 */
export const SEGMENT_TYPE = ["saved", "static", "fuzzy"] as const;

/**
 * Segment status enum
 */
export const SEGMENT_STATUS = ["saved", "sending", "sent"] as const;

/**
 *
 */
export const SEGMENT_MATCH_TYPE = ["any", "all"] as const;

/**
 * Condition type for segment rules
 */
export const CONDITION_TYPE = [
  "Aim",
  "Automation",
  "CampaignPoll",
  "Conversation",
  "Date",
  "EmailClient",
  "Language",
  "MandrilApp",
  "MemberRating",
  "SignupSource",
  "SurveyMonkey",
  "VIP",
  "Interests",
  "EcommCategory",
  "EcommNumber",
  "EcommPurchased",
  "EcommSpent",
  "EcommStore",
  "GoalActivity",
  "GoalTimestamp",
  "FuzzySegment",
  "StaticSegment",
  "IPGeoCountryState",
  "IPGeoIn",
  "IPGeoInZip",
  "IPGeoUnknown",
  "IPGeoZip",
  "SocialAge",
  "SocialGender",
  "SocialInfluence",
  "SocialNetworkMember",
  "SocialNetworkFollow",
  "AddressMerge",
  "ZipMerge",
  "BirthdayMerge",
  "DateMerge",
  "TextMerge",
  "SelectMerge",
  "EmailAddress",
] as const;

/**
 * Operator type for segment conditions
 */
export const CONDITION_OPERATOR = [
  "is",
  "not",
  "greater",
  "less",
  "contains",
  "notcontain",
  "starts",
  "ends",
  "blank",
  "blank_not",
  "date_within",
  "date_not_within",
] as const;

/**
 * Individual segment condition schema
 */
export const segmentConditionSchema = z.object({
  condition_type: z.enum(CONDITION_TYPE), // Type of condition (e.g., Interests, DateMerge)
  field: z.string(), // Segment field to apply the condition to
  op: z.enum(CONDITION_OPERATOR), // Operator to apply (e.g., is, not, contains)
  value: z.string().optional(), // Value for the condition
  extra: z.string().optional(), // Extra parameters for the condition
});

/**
 * Segment options schema
 */
export const segmentOptionsSchema = z.object({
  match: z.enum(SEGMENT_MATCH_TYPE), // Match type - whether to match any or all conditions
  conditions: z.array(segmentConditionSchema), // Array of segment conditions
});

/**
 * Individual segment schema
 */
export const segmentSchema = z.object({
  id: z.number().int().min(0), // Unique ID for the segment
  name: z.string(), // Name of the segment
  member_count: z.number().int().min(0), // Number of active subscribers currently included in the segment
  type: z.enum(SEGMENT_TYPE), // Type of segment (saved, static, fuzzy)
  created_at: z.iso.datetime({ offset: true }), // Date and time the segment was created (ISO 8601)
  updated_at: z.iso.datetime({ offset: true }), // Date and time the segment was last updated (ISO 8601)
  options: segmentOptionsSchema.optional(), // Segment options (conditions and match type) - only for saved segments
  list_id: z.string().min(1), // List ID this segment belongs to
  _links: z.array(linkSchema).optional(), // Links related to this segment
});

/**
 * Success response schema for list segments endpoint
 * Contains array of segments and pagination data
 */
export const listSegmentsSuccessSchema = z.object({
  segments: z.array(segmentSchema), // An array of objects, each representing a specific segment
  list_id: z.string().min(1), // The list ID
  total_items: z.number().int().min(0), // The total number of items matching the query
  _links: z.array(linkSchema), // A list of link types and descriptions for the API schema
});
