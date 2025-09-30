/**
 * Mailchimp Query Parameter Utilities
 *
 * Utility functions for transforming and processing Mailchimp API query parameters.
 * Moved from schema files to maintain architectural separation of concerns.
 */

import { z } from "zod";
import { MailchimpListParamsSchema } from "@/schemas/mailchimp/list-params.schema";
import { ReportsPageParamsSchema } from "@/schemas/components/reports-page-params.schema";
import { REPORT_TYPES } from "@/schemas/mailchimp/reports-params.schema";
import type { ReportsPageSearchParams } from "@/types/mailchimp";
/**
 * Transforms page-based pagination parameters to Mailchimp API offset-based format
 * Used by service layer for converting URL params to API params
 *
 * @param page - Page number (1-based) as string
 * @param limit - Items per page as string
 * @returns Object with count and offset properties for Mailchimp API
 *
 * @example
 * ```ts
 * const params = transformPaginationParams("2", "25");
 * // Returns: { count: 25, offset: 25 }
 * ```
 */
function transformPaginationParams(
  page?: string,
  limit?: string,
): { count?: number; offset?: number } {
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  const parsedPage = page ? parseInt(page, 10) : undefined;

  return {
    ...(parsedLimit && { count: parsedLimit }),
    ...(parsedPage && {
      offset: (parsedPage - 1) * (parsedLimit || 10), // Use 10 as fallback for offset calculation
    }),
  };
}

/**
 * Date validation helper for YYYY-MM-DD format
 *
 * Validates that a string is in YYYY-MM-DD format and represents a valid date,
 * including proper handling of leap years and days per month.
 *
 * @param val - Date string to validate
 * @returns true if valid date, false otherwise
 *
 * @example
 * ```typescript
 * validDate("2024-02-29") // true (leap year)
 * validDate("2023-02-29") // false (not leap year)
 * validDate("2024-13-01") // false (invalid month)
 * ```
 */
export const validDate = (val: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
  const [year, month, day] = val.split("-").map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  // Days in month, accounting for leap years
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  return true;
};

/**
 * Transform function to convert API query params to internal format
 *
 * Converts comma-separated field strings to arrays for service layer consumption.
 * Only transforms supported parameters (fields, exclude_fields, count, offset)
 *
 * @param params - Validated query parameters from MailchimpAudienceQuerySchema
 * @returns Transformed parameters with fields as arrays
 *
 * @example
 * ```typescript
 * const input = { fields: "id,name,stats.member_count", count: 10, offset: 0 };
 * const result = transformQueryParams(input);
 * // result.fields = ["id", "name", "stats.member_count"]
 * ```
 */
export function transformQueryParams(
  params: z.infer<typeof MailchimpListParamsSchema>,
) {
  // Return params as is - don't convert to arrays to match type expectations
  return params;
}

/**
 * Validation function for reports page query parameters
 * Returns result object following Next.js best practices for expected errors
 *
 * @param params - URL search parameters from reports page
 * @returns Success object with validated data or error object with message
 *
 * @example
 * ```typescript
 * const result = validateReportsPageParams({ page: "1", perPage: "10" });
 * if (result.success) {
 *   console.log(result.data.page); // 1 (number)
 * } else {
 *   console.error(result.error); // validation error message
 * }
 * ```
 */
export function validateReportsPageParams(
  params: Record<string, string | undefined>,
) {
  const result = ReportsPageParamsSchema.safeParse(params);

  if (!result.success) {
    return {
      success: false as const,
      error: `Invalid reports page parameters: ${result.error.issues.map((issue) => issue.message).join(", ")}`,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

/**
 * Transform campaign reports page parameters to Mailchimp API format
 * Combines pagination transformation with campaign-specific filters
 *
 * @param params - Campaign reports page search parameters
 * @returns Object with API-ready parameters
 *
 * @example
 * ```typescript
 * const params = { page: "2", perPage: "25", type: "regular", before_send_time: "2024-01-01" };
 * const result = transformCampaignReportsParams(params);
 * // Returns: { count: 25, offset: 25, type: "regular", before_send_time: "2024-01-01" }
 * ```
 */
export function transformCampaignReportsParams(
  params: ReportsPageSearchParams,
) {
  return {
    ...transformPaginationParams(params.page, params.perPage),
    ...(params.type &&
      REPORT_TYPES.includes(params.type as (typeof REPORT_TYPES)[number]) && {
        type: params.type as (typeof REPORT_TYPES)[number],
      }),
    ...(params.before_send_time && {
      before_send_time: params.before_send_time,
    }),
    ...(params.since_send_time && { since_send_time: params.since_send_time }),
  };
}

/**
 * Export the server-compatible transformPaginationParams function
 * for use in service layer and other server-side code
 */
export { transformPaginationParams };
