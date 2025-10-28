/**
 * Landing Pages Success Response Schema
 * Schema for successful responses from the Mailchimp landing pages endpoint
 *
 * Endpoint: GET /landing-pages
 * Source: Assumed based on Mailchimp API patterns (needs verification with real API response)
 *
 * ⚠️ ASSUMED FIELDS - These schemas are based on common Mailchimp API patterns.
 * Please verify all fields match actual API response during testing.
 * Fields are based on similar list endpoints and typical landing page properties.
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Landing page status values
 */
export const LANDING_PAGE_STATUS = [
  "published",
  "unpublished",
  "draft",
] as const;

/**
 * Landing page tracking settings schema
 * Analytics and tracking configuration
 */
export const landingPageTrackingSchema = z.object({
  track_with_mailchimp: z.boolean().optional(), // Use cookies to track unique visitors and calculate overall conversion rate
  enable_restricted_data_processing: z.boolean().optional(), // Enable restricted data processing for compliance
});

/**
 * Individual landing page schema
 * Represents a single landing page
 */
export const landingPageSchema = z.object({
  id: z.string().min(1), // Landing page ID
  name: z.string(), // Page name/title
  title: z.string().optional(), // Page title
  description: z.string().optional(), // Page description
  template_id: z.number().int().min(0).optional(), // Template ID
  status: z.enum(LANDING_PAGE_STATUS), // Publication status
  list_id: z.string().min(1).optional(), // Associated list ID
  store_id: z.string().optional(), // Associated store ID (for ecommerce)
  web_id: z.number().int().min(0).optional(), // Web ID for the landing page
  created_by_source: z.string().optional(), // Source that created the page
  url: z.url().optional(), // Published page URL
  created_at: z.iso.datetime({ offset: true }).optional(), // ISO 8601 creation timestamp
  published_at: z.iso.datetime({ offset: true }).optional(), // ISO 8601 publication timestamp
  unpublished_at: z.iso.datetime({ offset: true }).optional(), // ISO 8601 unpublication timestamp
  updated_at: z.iso.datetime({ offset: true }).optional(), // ISO 8601 update timestamp
  tracking: landingPageTrackingSchema.optional(), // Tracking settings
  _links: z.array(linkSchema).optional(), // HATEOAS navigation links
});

/**
 * Landing pages list success response schema
 * Contains array of landing pages and pagination info
 */
export const landingPagesSuccessSchema = z.object({
  landing_pages: z.array(landingPageSchema), // Array of landing pages
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema).optional(), // HATEOAS navigation links
});
