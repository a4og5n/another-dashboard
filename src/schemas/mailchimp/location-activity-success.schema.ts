/**
 * Mailchimp API Campaign Location Activity Success Response Schema
 * Schema for successful responses from the location activity endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/locations
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-reports/list-top-open-locations/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual location data schema
 * Represents geographic location with engagement metrics
 */
export const locationSchema = z.object({
  country_code: z.string().regex(/^[A-Z]{2}$/), // ISO 3166-1 alpha-2 country code (exactly 2 uppercase letters)
  region: z.string().optional(), // State/province/region name
  region_name: z.string().default("Rest of Country"), // State/province code
  opens: z.number().min(0), // Number of opens from this location
  proxy_excluded_opens: z.number().min(0), // Number of unique opens from this location
});

/**
 * Main location activity success response schema
 * Contains array of locations with engagement metrics and pagination
 */
export const locationActivitySuccessSchema = z.object({
  locations: z.array(locationSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});
