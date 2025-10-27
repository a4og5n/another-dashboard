/**
 * Automations Query Parameters Schema
 * Schema for query parameters when fetching automations list
 *
 * Endpoint: GET /automations
 * Source: Assumed based on Mailchimp API patterns (needs verification with real API response)
 *
 * ⚠️ ASSUMED FIELDS - These schemas are based on common Mailchimp API patterns.
 * Please verify all fields match actual API response during testing.
 */

import { z } from "zod";
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
import { AUTOMATION_STATUS } from "@/schemas/mailchimp/common/constants.schema";

/**
 * Automations query parameters schema
 * Extends standard pagination with automation-specific filters
 */
export const automationsQueryParamsSchema = standardQueryParamsSchema.extend({
  before_create_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
  since_create_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
  before_start_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
  since_start_time: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
  status: z.enum(AUTOMATION_STATUS).optional(), // Filter by automation status
});
