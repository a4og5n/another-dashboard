/**
 * Mailchimp API Segment Members Error Response Schema
 * Schema for error responses from the segment members endpoint
 *
 * Endpoint: GET /lists/{list_id}/segments/{segment_id}/members
 * Documentation: https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error schema for segment members endpoint
 * Uses the standard Mailchimp error response structure
 */
export const segmentMembersErrorSchema = errorSchema;
