/**
 * Landing Page Info Query Parameters Schema
 * Schema for query parameters for the GET /landing-pages/{page_id} endpoint
 *
 * Endpoint: GET /landing-pages/{page_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/landing-pages/get-landing-page-info/
 *
 * This endpoint retrieves detailed information about a specific landing page.
 */

import { z } from "zod";

/**
 * Path parameters schema for landing page info endpoint
 * Validates the page_id route parameter
 */
export const landingPageInfoPathParamsSchema = z
  .object({
    page_id: z.string().min(1, "Page ID is required"),
  })
  .strict();

/**
 * Query parameters schema for landing page info endpoint
 * Supports standard Mailchimp field filtering
 *
 * @property fields - Comma-separated list of fields to include in response
 * @property exclude_fields - Comma-separated list of fields to exclude from response
 */
export const landingPageInfoQueryParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict();
