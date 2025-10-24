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
import { listMemberSchema } from "@/schemas/mailchimp/common/list-member.schema";

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
