/**
 * Mailchimp API Root Server Actions
 * Server actions for fetching Mailchimp API Root endpoint data
 *
 * Issue #120: API Root server actions implementation
 * Based on schemas from: @/schemas/mailchimp/root-*.schema.ts
 * Uses types from: @/types/mailchimp/root.ts
 */
"use server";

import { mailchimpService } from "@/services/mailchimp.service";
import {
  MailchimpRootParamsSchema,
  MailchimpRootParamsInternalSchema,
} from "@/schemas/mailchimp/root-params.schema";
import { MailchimpRootSuccessSchema } from "@/schemas/mailchimp/root-success.schema";
import { mailchimpRootErrorResponseSchema } from "@/schemas/mailchimp/root-error-response.schema";
import type {
  MailchimpRoot,
  MailchimpRootQuery,
  MailchimpRootQueryInternal,
  MailchimpRootErrorResponse,
} from "@/types/mailchimp";

/**
 * Transform array-based query parameters to comma-separated strings for API
 */
function transformQueryParams(
  params: MailchimpRootQueryInternal,
): MailchimpRootQuery {
  const result: MailchimpRootQuery = {};

  if (params.fields) {
    result.fields = Array.isArray(params.fields)
      ? params.fields.join(",")
      : params.fields;
  }

  if (params.exclude_fields) {
    result.exclude_fields = Array.isArray(params.exclude_fields)
      ? params.exclude_fields.join(",")
      : params.exclude_fields;
  }

  return result;
}

/**
 * Fetch Mailchimp API Root data with field selection
 *
 * @param query - Query parameters for field selection
 * @returns Promise<MailchimpRoot | MailchimpRootErrorResponse>
 */
export async function getApiRoot(
  query: MailchimpRootQueryInternal = {},
): Promise<MailchimpRoot | MailchimpRootErrorResponse> {
  try {
    // Validate and parse input parameters (internal format with arrays)
    const validatedQuery = MailchimpRootParamsInternalSchema.parse(query);

    // Transform to API format (strings)
    const apiQuery = transformQueryParams(validatedQuery);

    // Validate API format parameters
    const validatedApiQuery = MailchimpRootParamsSchema.parse(apiQuery);

    // Get API root data
    const response = await mailchimpService.getApiRoot(validatedApiQuery);

    if (response.success && response.data) {
      // Parse and validate successful response
      const validatedData = MailchimpRootSuccessSchema.parse(response.data);
      return validatedData;
    } else {
      // Handle API error response
      const errorResponse: MailchimpRootErrorResponse = {
        type: "about:blank",
        title: "API Root Error",
        detail: response.error || "Failed to fetch API root data",
        status: response.statusCode || 500,
        instance: "/",
      };

      // Validate error response structure
      return mailchimpRootErrorResponseSchema.parse(errorResponse);
    }
  } catch (error) {
    console.error("Mailchimp API Root error:", error);

    // Return structured error response
    const errorResponse: MailchimpRootErrorResponse = {
      type: "about:blank",
      title: "Validation Error",
      detail: error instanceof Error ? error.message : "Unknown error occurred",
      status: 400,
      instance: "/",
    };

    return mailchimpRootErrorResponseSchema.parse(errorResponse);
  }
}

/**
 * Health check wrapper for API Root endpoint
 *
 * @returns Promise<boolean> - true if API Root is accessible
 */
export async function checkApiRootHealth(): Promise<boolean> {
  try {
    const result = await getApiRoot({ fields: ["account_id"] });

    // Check if result has account_id (successful response)
    return "account_id" in result && typeof result.account_id === "string";
  } catch {
    return false;
  }
}
