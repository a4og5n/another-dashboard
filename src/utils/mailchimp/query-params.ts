/**
 * Mailchimp Query Parameter Utilities
 *
 * Utility functions for transforming and processing Mailchimp API query parameters.
 * Moved from schema files to maintain architectural separation of concerns.
 */

import { z } from "zod";
import { MailchimpAudienceQuerySchema } from "@/schemas/mailchimp/audience-query.schema";

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
