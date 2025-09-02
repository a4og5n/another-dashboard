import { z } from "zod";

/**
 * Mailchimp API Root Query Schema
 * Zod schema for Mailchimp API Root endpoint query parameters
 *
 * Issue #118: API Root query parameters for field selection
 * Based on: https://mailchimp.com/developer/marketing/api/root/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Supported parameters:
 * - fields: comma-separated list of fields to return, supports dot notation for sub-objects
 * - exclude_fields: comma-separated list of fields to exclude, supports dot notation for sub-objects
 */
export const MailchimpRootQuerySchema = z
  .object({
    // Field selection (API expects comma-separated strings)
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  })
  .strict(); // Reject unknown properties

/**
 * Alternative schema for actions/internal use where fields are arrays
 * Transforms string fields to arrays for service layer consumption
 */
export const MailchimpRootQueryInternalSchema = MailchimpRootQuerySchema.extend(
  {
    fields: z.array(z.string()).optional(),
    exclude_fields: z.array(z.string()).optional(),
  },
).strict(); // Also reject unknown properties in internal schema
