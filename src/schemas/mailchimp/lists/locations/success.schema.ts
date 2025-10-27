/**
 * List Locations - Success Response Schema
 *
 * Defines the structure for successful GET /lists/{list_id}/locations responses
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API documentation and patterns
 * Source: https://mailchimp.com/developer/marketing/api/list-locations/list-locations/
 * Web Search Results: Returns locations (countries) where subscribers are located based on IP geocoding
 * Pattern based on: Growth History, Member Activity endpoints
 * Verification required: Test with real API response during implementation
 *
 * Expected structure:
 * - Array of location objects with country, country code, and subscriber count/percentage
 * - List ID
 * - Total items count
 * - Links array for hypermedia
 *
 * API Note: Returns geographic distribution of subscribers by country
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual location item schema
 *
 * Represents subscriber count and percentage for a specific country
 */
export const locationItemSchema = z.object({
  /**
   * The name of the country.
   */
  country: z.string(),

  /**
   * The ISO 3166-1 alpha-2 country code (exactly 2 uppercase letters).
   */
  cc: z.string().regex(/^[A-Z]{2}$/),

  /**
   * The percentage of subscribers in the list from this country.
   */
  percent: z.number().min(0).max(100),

  /**
   * The total number of subscribers from this country.
   */
  total: z.number().int().min(0),
});

/**
 * Success response schema for list locations
 *
 * Contains array of location data showing geographic distribution of subscribers
 */
export const listLocationsSuccessSchema = z.object({
  /**
   * Array of location data (countries where subscribers are located)
   */
  locations: z.array(locationItemSchema),

  /**
   * List ID
   */
  list_id: z.string().min(1),

  /**
   * Total number of items matching the query
   */
  total_items: z.number().int().min(0),

  /**
   * Pagination and related resource links
   */
  _links: z.array(linkSchema).optional(),
});
