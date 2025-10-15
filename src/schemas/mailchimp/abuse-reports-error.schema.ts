/**
 * Mailchimp API Campaign Abuse Reports List Error Schema
 * Schema for error responses from the campaign abuse reports list endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/abuse-reports
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 * Reuses common error schema from shared schemas
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Abuse reports list error schema
 * Reuses the shared Mailchimp error structure
 */
export const abuseReportListErrorSchema = errorSchema;
