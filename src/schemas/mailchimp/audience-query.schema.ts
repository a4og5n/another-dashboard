import { z } from "zod";

/**
 * MailchimpAudienceQuerySchema
 * Zod schema for Mailchimp Lists API query parameters
 *
 * Issues #95, #96: Removed unsupported query parameters to match official API
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 *
 * Supported parameters only:
 * - fields: comma-separated list of fields to include
 * - exclude_fields: comma-separated list of fields to exclude
 * - count: number of records to return (1-1000)
 * - offset: number of records to skip
 */
export const MailchimpAudienceQuerySchema = z
  .object({
    // Field selection (API expects comma-separated strings)
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),

    // Pagination parameters
    count: z.coerce.number().int().min(1).max(1000).default(10),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict(); // Reject unknown properties

/**
 * Alternative schema for actions/internal use where fields are arrays
 * Transforms string fields to arrays for service layer consumption
 */
export const MailchimpAudienceQueryInternalSchema =
  MailchimpAudienceQuerySchema.extend({
    // Keep the same string type to match MailchimpAudiencesQuery interface
    fields: z.string().optional(),
    exclude_fields: z.string().optional(),
  }).strict(); // Also reject unknown properties in internal schema
