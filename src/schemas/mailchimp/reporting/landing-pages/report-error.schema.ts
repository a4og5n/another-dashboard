/**
 * Mailchimp Landing Page Report Error Response Schema
 * Schema for error responses from the landing page report endpoint
 *
 * Issue #400: Get Landing Page Report implementation
 * Endpoint: GET /reporting/landing-pages/{outreach_id}
 * Documentation: https://mailchimp.com/developer/marketing/api/reporting-landing-pages/get-landing-page-report/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Landing page report error response schema
 * Reuses the common errorSchema as errors follow standard Mailchimp format
 *
 * Common error scenarios:
 * - 400: Invalid outreach_id format
 * - 404: Landing page not found
 * - 401: Authentication failed
 * - 403: Insufficient permissions
 */
export const landingPageReportErrorSchema = errorSchema;
