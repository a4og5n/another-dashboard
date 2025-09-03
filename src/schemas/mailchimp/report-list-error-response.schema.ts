/**
 * Mailchimp API Reports List Error Response Schema
 * Schema for error responses from the campaign reports list endpoint
 *
 * Issue #126: Reports endpoint error response structure validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 * Reuses common error response schema from shared schemas
 */

import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";

/**
 * Reports list error response schema
 * Reuses the shared Mailchimp error response structure
 */
export const reportListErrorResponseSchema = mailchimpErrorResponseSchema;
