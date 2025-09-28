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
import {
  ReportDetailPathParamsSchema,
  ReportDetailQueryParamsSchema,
} from "@/schemas/mailchimp/report-detail-params.schema";
import type { ReportListQueryInternal } from "@/types/mailchimp/reports";
import type {
  ReportDetailPathParams,
  ReportDetailQueryParams,
} from "@/types/mailchimp/report-detail";
import { mailchimpService } from "@/services/mailchimp.service";

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
 * Validates campaign report detail path parameters
 *
 * @param params - Path parameters from request
 * @returns Parsed and typed path parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateReportDetailPathParams({ campaign_id: "abc123" })
 */
export function validateReportDetailPathParams(
  params: unknown,
): ReportDetailPathParams {
  const result = ReportDetailPathParamsSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid campaign report detail path parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates campaign report detail query parameters
 *
 * @param params - Query parameters from request
 * @returns Parsed and typed query parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateReportDetailQueryParams({ fields: "opens,clicks" })
 */
export function validateReportDetailQueryParams(
  params: unknown,
): ReportDetailQueryParams {
  const result = ReportDetailQueryParamsSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid campaign report detail query parameters",
      result.error,
    );
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

    // Convert fields and exclude_fields to strings if they are arrays
    const serviceParams = {
      ...validatedParams,
      fields: validatedParams?.fields
        ? Array.isArray(validatedParams.fields)
          ? validatedParams.fields.join(",")
          : validatedParams.fields
        : undefined,
      exclude_fields: validatedParams?.exclude_fields
        ? Array.isArray(validatedParams.exclude_fields)
          ? validatedParams.exclude_fields.join(",")
          : validatedParams.exclude_fields
        : undefined,
    };

    const response = await mailchimpService.getCampaignReports(serviceParams);

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

/**
 * Server action to get a single Mailchimp campaign report
 *
 * @param campaignId - Campaign ID to get report for
 * @param queryParams - Optional query parameters for field filtering
 * @returns Success response with campaign report data or error response
 */
export async function getMailchimpCampaignReport(campaignId: unknown) {
  try {
    // Validate path parameters
    const validatedId = validateCampaignReportId(campaignId);

    // Get single campaign report
    const response = await mailchimpService.getCampaignReport(validatedId);

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Failed to fetch campaign report",
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
    console.error("Error in getMailchimpCampaignReport:", error);

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
