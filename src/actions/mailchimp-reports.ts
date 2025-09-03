/**
 * Server actions for Mailchimp Reports API
 *
 * Issue #128: Reports endpoint action layer implementation
 * - Validates input using Zod schemas
 * - Provides centralized error handling via ValidationError
 * - Exports validation and error classes for use in API routes
 * - Follows established patterns from mailchimp-audiences.ts
 *
 * @see src/schemas/mailchimp/report-list-query.schema.ts for input validation
 * @see src/types/mailchimp/reports.ts for TypeScript types
 */

import { z } from "zod";
import { ReportListQueryInternalSchema } from "@/schemas/mailchimp/report-list-query.schema";
import type { ReportListQueryInternal } from "@/types/mailchimp/reports";
import { getMailchimpService } from "@/services";

/**
 * Custom error class for Mailchimp reports API validation errors
 * Reused from audiences pattern for consistency
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
 *
 * @param params - Query parameters from request
 * @returns Parsed and typed query object
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateMailchimpReportsQuery({ count: "10", type: "regular" })
 */
export function validateMailchimpReportsQuery(
  params: unknown,
): ReportListQueryInternal {
  const result = ReportListQueryInternalSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid Mailchimp reports query parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates a single campaign report ID parameter
 *
 * @param id - Campaign report ID to validate
 * @returns Validated campaign report ID
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateCampaignReportId("abc123")
 */
export function validateCampaignReportId(id: unknown): string {
  const result = z
    .string()
    .trim()
    .min(1, "Campaign report ID is required")
    .safeParse(id);
  if (!result.success) {
    throw new ValidationError("Invalid campaign report ID", result.error);
  }
  return result.data;
}

/**
 * Server action to get Mailchimp campaign reports
 *
 * @param params - Query parameters for reports filtering and pagination
 * @returns Success response with reports data or error response
 */
export async function getMailchimpReports(params: unknown) {
  try {
    // Validate input parameters
    const validatedParams = validateMailchimpReportsQuery(params);

    // Get Mailchimp service and fetch reports
    const mailchimp = getMailchimpService();
    const response = await mailchimp.getCampaignReports(validatedParams);

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Failed to fetch campaign reports",
      };
    }

    if (!response.data) {
      return {
        success: false,
        error: "Invalid response format from Mailchimp service",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in getMailchimpReports:", error);

    if (error instanceof ValidationError) {
      return {
        success: false,
        error: `Parameter validation failed: ${error.message}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
