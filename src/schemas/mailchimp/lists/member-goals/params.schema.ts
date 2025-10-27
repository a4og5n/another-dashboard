/**
 * List Member Goals - Request Parameters Schema
 *
 * Defines validation for GET /lists/{list_id}/members/{subscriber_hash}/goals
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API documentation and patterns
 * Source: https://mailchimp.com/developer/marketing/api/list-member-goal/list-member-goal-events/
 * API Note: Returns the last 50 Goal events for a member on a specific list
 * Verification required: Test with real API response during implementation
 */

import { z } from "zod";

/**
 * Path parameters for member goals endpoint
 */
export const memberGoalsPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
    subscriber_hash: z
      .string()
      .min(1, "Subscriber hash is required")
      .describe("MD5 hash of lowercase email address"),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for member goals endpoint
 *
 * Note: API documentation indicates this endpoint returns "last 50 Goal events"
 * Supports pagination and field filtering.
 */
export const memberGoalsQueryParamsSchema = z
  .object({
    /**
     * Comma-separated list of fields to include in response
     */
    fields: z.string().optional(),

    /**
     * Comma-separated list of fields to exclude from response
     */
    exclude_fields: z.string().optional(),

    /**
     * Number of records to return (default: 10, max: 1000)
     */
    count: z.coerce.number().min(1).max(1000).default(10),

    /**
     * Number of records to skip for pagination (default: 0)
     */
    offset: z.coerce.number().min(0).default(0),
  })
  .strict(); // Reject unknown properties for input validation
