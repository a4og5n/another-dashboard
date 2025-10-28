/**
 * List Member Goals - Success Response Schema
 *
 * Defines the structure for successful GET /lists/{list_id}/members/{subscriber_hash}/goals responses
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API documentation and patterns
 * Source: https://mailchimp.com/developer/marketing/api/list-member-goal/list-member-goal-events/
 * Web Search Results: Goals array with goal_id, event, last_visited_at, data fields
 * Pattern based on: Member Notes, Member Tags endpoints
 * Verification required: Test with real API response during implementation
 *
 * Expected structure:
 * - Array of goal events with ID, event name, timestamp, data
 * - List ID and email ID
 * - Links array for hypermedia
 *
 * API Note: Returns last 50 Goal events for a member
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual goal event schema
 *
 * Represents a single goal completion event for a list member
 */
export const goalEventSchema = z.object({
  /**
   * The id for a Goal event.
   */
  goal_id: z.number().int().min(1),

  /**
   * The name/type of Goal event triggered.
   */
  event: z.string(),

  /**
   * The date and time the user last triggered the Goal event in ISO 8601 format.
   */
  last_visited_at: z.iso.datetime({ offset: true }),

  /**
   * Any extra data passed with the Goal event.
   */
  data: z.string(),
});

/**
 * Success response schema for member goals list
 *
 * Contains array of goal events with member and list identifiers
 */
export const memberGoalsSuccessSchema = z.object({
  /**
   * Array of goal completion events
   * API returns last 50 goal events
   */
  goals: z.array(goalEventSchema),

  /**
   * List ID
   */
  list_id: z.string().min(1),

  /**
   * Email ID (subscriber hash)
   * MD5 hash of lowercase email address
   */
  email_id: z.string().min(1),

  /**
   * Total number of items matching the query
   */
  total_items: z.number().int().min(0),

  /**
   * Pagination and related resource links
   */
  _links: z.array(linkSchema).optional(),
});
