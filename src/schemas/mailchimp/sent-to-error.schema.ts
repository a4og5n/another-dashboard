/**
 * Mailchimp API Sent To Error Response Schema
 * Schema for error responses from the campaign sent-to endpoint
 *
 * Endpoint: GET /reports/{campaign_id}/sent-to
 * Documentation: https://mailchimp.com/developer/marketing/api/sent-to-reports/list-campaign-recipients/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response schema for sent-to endpoint
 * Uses the common Mailchimp error schema
 */
export const sentToErrorSchema = errorSchema;
