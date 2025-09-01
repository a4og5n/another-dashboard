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
import { MailchimpAudienceSchema } from "@/schemas/mailchimp/audience.schema";
import { MailchimpAudienceQueryInternalSchema } from "@/schemas/mailchimp/audience-query.schema";
import type {
  MailchimpAudiencesQuery,
  CreateMailchimpAudienceParams,
  UpdateMailchimpAudienceParams,
} from "@/types/mailchimp/audience";

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

// Query schema moved to centralized location: @/schemas/mailchimp/audience-query.schema

/**
 * Zod schema for creating audience parameters
 */
const createAudienceSchema = z.object({
  name: z.string().min(1, "Audience name is required"),
  contact: z.object({
    company: z.string().min(1, "Company is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
  }),
  permission_reminder: z.string().min(1, "Permission reminder is required"),
  campaign_defaults: z.object({
    from_name: z.string().min(1, "From name is required"),
    from_email: z.string().email("Valid email is required"),
    subject: z.string().min(1, "Subject is required"),
    language: z.string().min(1, "Language is required"),
  }),
  email_type_option: z.boolean().default(false),
  use_archive_bar: z.boolean().default(true),
  notify_on_subscribe: z.string().email().optional(),
  notify_on_unsubscribe: z.string().email().optional(),
  visibility: z.enum(["pub", "prv"]).default("pub"),
});

/**
 * Zod schema for updating audience parameters
 */
const updateAudienceSchema = createAudienceSchema.partial().extend({
  id: z.string().min(1, "Audience ID is required"),
});

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
 * Validates parameters for creating a new Mailchimp audience
 *
 * @param params - Create audience parameters
 * @returns Parsed and typed create parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateCreateAudienceParams({
 *     name: "Newsletter Subscribers",
 *     contact: { company: "ACME", address1: "123 Main St", ... },
 *     permission_reminder: "You signed up for our newsletter",
 *     campaign_defaults: { from_name: "ACME", from_email: "newsletter@acme.com", ... }
 *   })
 */
export function validateCreateAudienceParams(
  params: unknown,
): CreateMailchimpAudienceParams {
  const result = createAudienceSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid create audience parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates parameters for updating a Mailchimp audience
 *
 * @param params - Update audience parameters (must include id)
 * @returns Parsed and typed update parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateUpdateAudienceParams({
 *     id: "abc123",
 *     name: "Updated Newsletter Name"
 *   })
 */
export function validateUpdateAudienceParams(
  params: unknown,
): UpdateMailchimpAudienceParams {
  const result = updateAudienceSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid update audience parameters",
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
  const result = z.string().min(1, "Audience ID is required").safeParse(id);
  if (!result.success) {
    throw new ValidationError("Invalid audience ID", result.error);
  }
  return result.data;
}

/**
 * Validates a full audience object against the schema
 *
 * @param audience - Audience object to validate
 * @returns Validated audience object
 * @throws ValidationError if validation fails
 *
 * Useful for validating API responses or ensuring data integrity
 */
export function validateAudienceObject(audience: unknown) {
  const result = MailchimpAudienceSchema.safeParse(audience);
  if (!result.success) {
    throw new ValidationError("Invalid audience object", result.error);
  }
  return result.data;
}
