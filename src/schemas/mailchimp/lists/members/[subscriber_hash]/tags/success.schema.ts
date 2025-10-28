/**
 * Mailchimp API Member Tags Success Response Schema
 * Schema for the successful response from the list member tags endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}/tags
 * Documentation: https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual tag schema
 * Represents a single tag assigned to a member
 *
 * @property id - Unique identifier for the tag (integer >= 0)
 * @property name - Display name of the tag
 * @property date_added - ISO 8601 timestamp when tag was added to the member
 */
export const memberTagSchema = z.object({
  id: z.number().int().min(0), // Tag ID (integer)
  name: z.string(),
  date_added: z.iso.datetime({ offset: true }),
});

/**
 * Success response schema for member tags endpoint
 * Returns a paginated list of tags for a specific list member
 *
 * @property tags - Array of tag objects assigned to the member
 * @property total_items - Total number of tags for this member (integer >= 0)
 * @property _links - Hypermedia links for API navigation
 */
export const memberTagsSuccessSchema = z.object({
  tags: z.array(memberTagSchema),
  total_items: z.number().int().min(0), // Total tag count
  _links: z.array(linkSchema).optional(),
});
