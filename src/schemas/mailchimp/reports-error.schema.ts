/**
 * Mailchimp API Reports List Error Schema
 * Schema for error responses from the campaign reports list endpoint
 *
 * Issue #126: Reports endpoint error response structure validation
 * Endpoint: GET /reports
 * Documentation: https://mailchimp.com/developer/marketing/api/reports/list-campaign-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 * Reuses common error schema from shared schemas
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Reports list error schema
 * Reuses the shared Mailchimp error structure
 */
export const reportListErrorSchema = errorSchema;
