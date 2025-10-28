/**
 * Landing Pages Error Response Schema
 * Validates error responses from the Mailchimp landing pages endpoint
 *
 * Endpoint: GET /landing-pages
 * Source: Standard Mailchimp API error format
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const landingPagesErrorSchema = errorSchema;
