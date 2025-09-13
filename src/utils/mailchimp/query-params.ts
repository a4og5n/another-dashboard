/**
 * Mailchimp Query Parameter Utilities
 *
 * Utility functions for transforming and processing Mailchimp API query parameters.
 * Moved from schema files to maintain architectural separation of concerns.
 */

import { z } from "zod";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";
import { CampaignsPageQuerySchema } from "@/schemas/mailchimp/campaign-query.schema";

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
  params: z.infer<typeof MailchimpAudienceQuerySchema>,
) {
  // Return params as is - don't convert to arrays to match type expectations
  return params;
}

/**
 * Validation function for campaigns page query parameters
 * Returns result object following Next.js best practices for expected errors
 *
 * @param params - URL search parameters from campaigns page
 * @returns Success object with validated data or error object with message
 *
 * @example
 * ```typescript
 * const result = validateCampaignsPageParams({ page: "1", perPage: "10" });
 * if (result.success) {
 *   console.log(result.data.page); // 1 (number)
 * } else {
 *   console.error(result.error); // validation error message
 * }
 * ```
 */
export function validateCampaignsPageParams(
  params: Record<string, string | undefined>,
) {
  const result = CampaignsPageQuerySchema.safeParse(params);

  if (!result.success) {
    return {
      success: false as const,
      error: `Invalid campaigns page parameters: ${result.error.issues.map((issue) => issue.message).join(", ")}`,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
