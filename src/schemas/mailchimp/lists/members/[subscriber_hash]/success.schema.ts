/**
 * Mailchimp API Member Info Success Response Schema
 * Schema for successful responses from the get member info endpoint
 *
 * Endpoint: GET /lists/{list_id}/members/{subscriber_hash}
 * Documentation: https://mailchimp.com/developer/marketing/api/list-members/get-member-info/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Note: The response structure is identical to the individual member object
 * from the List Members endpoint, so we reuse the listMemberSchema from common.
 */

import { listMemberSchema } from "@/schemas/mailchimp/common/list-member.schema";

/**
 * Member info success response schema
 * Returns complete member profile with all details
 *
 * This endpoint returns the same structure as a single member from the
 * list members endpoint, including:
 * - Email and contact information
 * - Subscription status and preferences
 * - Engagement statistics (open/click rates)
 * - Member tags and interests
 * - Marketing permissions
 * - Location data
 * - E-commerce data (if applicable)
 * - Most recent note
 * - Merge fields
 */
export const memberInfoSuccessSchema = listMemberSchema;
