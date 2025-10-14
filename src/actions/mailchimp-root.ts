/**
 * Mailchimp API Root Server Actions (OAuth-based)
 * Server actions for fetching Mailchimp API Root endpoint data
 *
 * Issue #120: API Root server actions implementation
 * Based on schemas from: @/schemas/mailchimp/root-*.schema.ts
 * Uses types from: @/types/mailchimp/root.ts
 */
"use server";

import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { rootParamsSchema } from "@/schemas/mailchimp/root-params.schema";
import { rootSuccessSchema } from "@/schemas/mailchimp/root-success.schema";
import { rootErrorSchema } from "@/schemas/mailchimp/root-error.schema";
import { convertFieldsToCommaString } from "@/utils/mailchimp";
import type { RootSuccess, RootError } from "@/types/mailchimp";

/**
 * Fetch Mailchimp API Root data with field selection
 *
 * @param query - Query parameters for field selection (accepts fields as string or array)
 * @returns Promise<RootSuccess | RootError>
 */
export async function getApiRoot(
  query: {
    fields?: string | string[];
    exclude_fields?: string | string[];
  } = {},
): Promise<RootSuccess | RootError> {
  try {
    // Convert arrays to comma-separated strings
    const apiQuery = convertFieldsToCommaString(query);

    // Validate API format parameters
    const validatedApiQuery = rootParamsSchema.parse(apiQuery);

    // Get API root data (validation happens at DAL layer)
    const response = await mailchimpDAL.fetchApiRoot(validatedApiQuery);

    if (response.success && response.data) {
      // Parse and validate successful response
      const validatedData = rootSuccessSchema.parse(response.data);
      return validatedData;
    } else {
      // Handle API error response
      const errorResponse: RootError = {
        type: "about:blank",
        title: "API Root Error",
        detail: response.error || "Failed to fetch API root data",
        status: response.statusCode || 500,
        instance: "/",
      };

      // Validate error response structure
      return rootErrorSchema.parse(errorResponse);
    }
  } catch (error) {
    console.error("Mailchimp API Root error:", error);

    // Return structured error response
    const errorResponse: RootError = {
      type: "about:blank",
      title: "Validation Error",
      detail: error instanceof Error ? error.message : "Unknown error occurred",
      status: 400,
      instance: "/",
    };

    return rootErrorSchema.parse(errorResponse);
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
