/**
 * Landing Page Info Error Response Schema
 * Schema for error responses from the GET /landing-pages/{page_id} endpoint
 *
 * Endpoint: GET /landing-pages/{page_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/landing-pages/get-landing-page-info/
 *
 * Common error scenarios:
 * - 404: Landing page not found (invalid page_id)
 * - 401: Unauthorized (invalid or expired access token)
 * - 403: Forbidden (insufficient permissions)
 * - 500: Internal server error
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Landing page info error response schema
 *
 * Uses the standard Mailchimp error format:
 * {
 *   type: "error_type",
 *   title: "Error Title",
 *   status: 404,
 *   detail: "Detailed error message",
 *   instance: "request_id"
 * }
 */
export const landingPageInfoErrorSchema = errorSchema;
