/**
 * Automations Page UI Parameters Schema
 * Schema for validating URL search parameters in the automations page
 *
 * This schema validates the UI-facing parameters (from URL) before they
 * are transformed into API parameters.
 */

import { z } from "zod";

/**
 * Automations page search params schema (UI layer)
 * Validates URL search parameters before API transformation
 */
export const automationsPageSearchParamsSchema = z.object({
  page: z.string().optional(), // Page number as string from URL
  perPage: z.string().optional(), // Items per page as string from URL
  status: z.string().optional(), // Filter by automation status
  since_create_time: z.string().optional(), // ISO 8601 datetime filter
  before_create_time: z.string().optional(), // ISO 8601 datetime filter
});

export type AutomationsPageSearchParams = z.infer<
  typeof automationsPageSearchParamsSchema
>;
