import { z } from "zod";

/**
 * Mailchimp API Root Parameters Schema
 * Zod schema for Mailchimp API Root endpoint query parameters
 *
 * Issue #118: API Root query parameters for field selection
 * Based on: https://mailchimp.com/developer/marketing/api/root/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Supported parameters:
 * - fields: comma-separated list of fields to return, supports dot notation for sub-objects
 * - exclude_fields: comma-separated list of fields to exclude, supports dot notation for sub-objects
 *
 * Note: For developer convenience, server actions can accept fields as arrays and use
 * convertFieldsToCommaString() utility to transform them to the API's comma-separated format.
 */
export const rootParamsSchema = z
  .object({
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties
