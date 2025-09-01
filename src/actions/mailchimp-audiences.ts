/**
 * Server actions for Mailchimp Audiences API
 *
 * - Validates input using Zod schemas
 * - Provides centralized error handling via ValidationError
 * - Exports validation and error classes for use in API routes
 *
 * @see src/schemas/mailchimp/audience.schema.ts for input validation
 * @see src/types/mailchimp/audience.ts for TypeScript types
 */

import { z } from "zod";
import { MailchimpAudienceQueryInternalSchema } from "@/schemas/mailchimp/audience-query.schema";
import type { MailchimpAudiencesQuery } from "@/types/mailchimp/audience";

/**
 * Custom error class for Mailchimp audience API validation errors
 */
export class ValidationError extends Error {
  details: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

// All schemas moved to centralized location: @/schemas/mailchimp/audience.schema

/**
 * Validates Mailchimp audiences API query parameters
 *
 * @param params - Query parameters from request
 * @returns Parsed and typed query object
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateMailchimpAudiencesQuery({ count: "10", sort_field: "member_count" })
 */
export function validateMailchimpAudiencesQuery(
  params: unknown,
): MailchimpAudiencesQuery {
  const result = MailchimpAudienceQueryInternalSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid Mailchimp audiences query parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates a single audience ID parameter
 *
 * @param id - Audience ID to validate
 * @returns Validated audience ID
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateAudienceId("abc123")
 */
export function validateAudienceId(id: unknown): string {
  const result = z
    .string()
    .trim()
    .min(1, "Audience ID is required")
    .safeParse(id);
  if (!result.success) {
    throw new ValidationError("Invalid audience ID", result.error);
  }
  return result.data;
}
