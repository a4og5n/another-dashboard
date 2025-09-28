/**
 * Server actions for Mailchimp Campaign Open List API
 *
 * Issue #135: Campaign open list action layer implementation
 * - Validates input using Zod schemas for campaign open list endpoints
 * - Provides centralized error handling via ValidationError
 * - Exports validation and error classes for use in API routes
 * - Follows established patterns from mailchimp-reports.ts
 *
 * @see src/schemas/mailchimp/report-open-list-params.schema.ts for input validation
 * @see src/types/mailchimp/report-open-list.ts for TypeScript types
 */

import { z } from "zod";
import {
  OpenListPathParamsSchema,
  OpenListQueryParamsSchema,
} from "@/schemas/mailchimp/report-open-list-params.schema";
import type {
  OpenListPathParams,
  OpenListQueryParams,
} from "@/types/mailchimp/report-open-list";
import { mailchimpService } from "@/services/mailchimp.service";

/**
 * Custom error class for Mailchimp campaign open list API validation errors
 * Reused from reports pattern for consistency
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
 * Validates Mailchimp campaign open list path parameters
 *
 * @param params - Path parameters from request
 * @returns Parsed and typed path parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateOpenListPathParams({ campaign_id: "abc123" })
 */
export function validateOpenListPathParams(
  params: unknown,
): OpenListPathParams {
  const result = OpenListPathParamsSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid campaign open list path parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates Mailchimp campaign open list query parameters
 *
 * @param params - Query parameters from request
 * @returns Parsed and typed query parameters
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateOpenListQueryParams({ count: 10, offset: 0, sort_dir: "ASC" })
 */
export function validateOpenListQueryParams(
  params: unknown,
): OpenListQueryParams {
  const result = OpenListQueryParamsSchema.safeParse(params);
  if (!result.success) {
    throw new ValidationError(
      "Invalid campaign open list query parameters",
      result.error,
    );
  }
  return result.data;
}

/**
 * Validates a single campaign ID parameter for open list
 *
 * @param id - Campaign ID to validate
 * @returns Validated campaign ID
 * @throws ValidationError if validation fails
 *
 * Example:
 *   validateCampaignId("abc123")
 */
export function validateCampaignId(id: unknown): string {
  const result = z
    .string()
    .trim()
    .min(1, "Campaign ID is required")
    .safeParse(id);
  if (!result.success) {
    throw new ValidationError("Invalid campaign ID", result.error);
  }
  return result.data;
}

/**
 * Server action to get Mailchimp campaign open list
 *
 * @param campaignId - Campaign ID to get open list for
 * @param queryParams - Query parameters for filtering and pagination
 * @returns Success response with open list data or error response
 */
export async function getMailchimpCampaignOpenList(
  campaignId: unknown,
  queryParams?: unknown,
) {
  try {
    // Validate path parameters
    const validatedCampaignId = validateCampaignId(campaignId);

    // Validate query parameters
    const validatedQueryParams = queryParams
      ? validateOpenListQueryParams(queryParams)
      : {};

    // Convert fields and exclude_fields to strings if they are arrays
    const serviceParams = {
      ...validatedQueryParams,
      fields: validatedQueryParams?.fields
        ? Array.isArray(validatedQueryParams.fields)
          ? validatedQueryParams.fields.join(",")
          : validatedQueryParams.fields
        : undefined,
      exclude_fields: validatedQueryParams?.exclude_fields
        ? Array.isArray(validatedQueryParams.exclude_fields)
          ? validatedQueryParams.exclude_fields.join(",")
          : validatedQueryParams.exclude_fields
        : undefined,
    };

    const response = await mailchimpService.getCampaignOpenList(
      validatedCampaignId,
      serviceParams,
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Failed to fetch campaign open list",
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
    console.error("Error in getMailchimpCampaignOpenList:", error);

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
