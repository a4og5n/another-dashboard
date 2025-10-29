/**
 * Landing Page Info Success Response Schema
 * Schema for successful response from the GET /landing-pages/{page_id} endpoint
 *
 * Endpoint: GET /landing-pages/{page_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/landing-pages/get-landing-page-info/
 *
 * Returns detailed information about a specific landing page including
 * status, URLs, creation/publication dates, tracking settings, and associated resources.
 */

import { landingPageSchema } from "@/schemas/mailchimp/landing-pages/landing-pages-success.schema";

/**
 * Landing page info success response schema
 *
 * The response is a single landing page object (not wrapped in an array).
 * Reuses the landingPageSchema from the list endpoint since both represent
 * the same landing page structure.
 *
 * Fields include:
 * - id: Landing page unique identifier
 * - name: Internal page name
 * - title: Public page title
 * - description: Page description
 * - status: published | unpublished | draft
 * - url: Published page URL
 * - created_at, published_at, updated_at: ISO 8601 timestamps
 * - tracking: Analytics and tracking settings
 * - _links: HATEOAS navigation links
 */
export const landingPageInfoSuccessSchema = landingPageSchema;
