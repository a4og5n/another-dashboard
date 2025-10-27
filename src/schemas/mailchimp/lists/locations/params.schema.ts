/**
 * List Locations - Request Parameters Schema
 *
 * Defines validation for GET /lists/{list_id}/locations
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API documentation and patterns
 * Source: https://mailchimp.com/developer/marketing/api/list-locations/list-locations/
 * API Note: Returns the locations (countries) that the list's subscribers have been tagged to based on geocoding their IP address
 * Verification required: Test with real API response during implementation
 */

import { z } from "zod";

/**
 * Path parameters for list locations endpoint
 */
export const listLocationsPathParamsSchema = z
  .object({
    list_id: z.string().min(1, "List ID is required"),
  })
  .strict(); // Reject unknown properties for input validation

/**
 * Query parameters for list locations endpoint
 *
 * Note: API documentation indicates this endpoint returns subscriber location data
 * based on IP address geocoding. Supports field filtering.
 */
export const listLocationsQueryParamsSchema = z
  .object({
    /**
     * Comma-separated list of fields to include in response
     */
    fields: z.string().optional(),

    /**
     * Comma-separated list of fields to exclude from response
     */
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties for input validation
