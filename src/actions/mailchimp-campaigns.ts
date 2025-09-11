/**
 * Server actions for Mailchimp Campaigns API
 *
 * - Validates input using Zod schemas
 * - Provides centralized error handling via MailchimpApiError
 * - Exports validation and error classes for use in API routes
 *
 * @see src/schemas/mailchimp-campaigns.ts for input validation
 * @see src/app/api/mailchimp/campaigns/route.ts for API usage
 */
/**
 * Centralized validation for Mailchimp campaigns API query parameters
 * Uses strict Zod schema from src/schemas/mailchimp-campaigns.ts
 * Throws ValidationError on failure
 */
import { mailchimpCampaignsQuerySchema } from "@/schemas/mailchimp-campaigns";
import { MailchimpCampaignsQuery } from "@/types/mailchimp-campaigns";

/**
 * Custom error class for Mailchimp campaigns API validation errors
 *
 * @param message - Error message
 * @param details - Optional error details (Zod error object)
 */
export class ValidationError extends Error {
  details: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

/**
 * Validates Mailchimp campaigns API query parameters
 * @param params - Query parameters from request
 * @returns Parsed and typed query object
 * @throws ValidationError if validation fails
 */
/**
 * Validates Mailchimp campaigns API query parameters using Zod schema
 *
 * @param params - Query parameters from request (object)
 * @returns Parsed and typed query object (MailchimpCampaignsQuery)
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateMailchimpCampaignsQuery({ count: "10", type: "regular" })
 */
export function validateMailchimpCampaignsQuery(
  params: unknown,
): MailchimpCampaignsQuery {
  const result = mailchimpCampaignsQuerySchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid Mailchimp campaigns query parameters",
      result.error,
    );
  }
  
  // Transform fields and exclude_fields from string to arrays
  const data = result.data;
  
  // Create a new object with the transformed data
  const transformedData: MailchimpCampaignsQuery = {
    ...data,
    fields: data.fields === undefined 
      ? undefined 
      : data.fields === '' 
        ? []
        : data.fields.split(',').map(field => field.trim()).filter(Boolean),
    exclude_fields: data.exclude_fields === undefined
      ? undefined
      : data.exclude_fields === ''
        ? []
        : data.exclude_fields.split(',').map(field => field.trim()).filter(Boolean)
  };

  return transformedData;
}
