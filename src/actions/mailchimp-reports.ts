/**
 * Server actions for Mailchimp Reports API
 * Simplified to use SDK directly for MVP approach
 */

import { reportListParamsSchema } from "@/schemas/mailchimp/reports-params.schema";
import { ReportsQuery } from "@/types/mailchimp-reports";

/**
 * Custom error class for Mailchimp reports API validation errors
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
 * Validates Mailchimp reports API query parameters
 * @param params - Query parameters from request
 * @returns Parsed and typed query object
 * @throws ValidationError if validation fails
 */
/**
 * Validates Mailchimp reports API query parameters using Zod schema
 *
 * @param params - Query parameters from request (object)
 * @returns Parsed and typed query object (ReportsQuery)
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateReportsQuery({ count: "10", type: "regular" })
 */
export function validateReportsQuery(params: unknown): ReportsQuery {
  const result = reportListParamsSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid Mailchimp reports query parameters",
      result.error,
    );
  }

  // Transform fields and exclude_fields from string to arrays
  const data = result.data;

  if (!data) {
    throw new ValidationError("Validation succeeded but data is undefined");
  }

  // Create a new object with the transformed data
  const transformedData: ReportsQuery = {
    ...data,
    fields:
      data.fields === undefined
        ? undefined
        : data.fields === ""
          ? []
          : data.fields
              .split(",")
              .map((field) => field.trim())
              .filter(Boolean),
    exclude_fields:
      data.exclude_fields === undefined
        ? undefined
        : data.exclude_fields === ""
          ? []
          : data.exclude_fields
              .split(",")
              .map((field) => field.trim())
              .filter(Boolean),
  };

  return transformedData;
}
