/**
 * Campaign Opens Parameter Utilities
 * Utility functions for processing and validating campaign opens page parameters
 *
 * Following project guidelines: Extract business logic from components
 * Centralizes parameter validation logic for reusability and testability
 */

import { validateOpenListQueryParams } from "@/actions/mailchimp-reports-open";
import { isDev } from "@/lib/config";
import type { OpenListQueryParams } from "@/types/mailchimp";

/**
 * Processes and validates raw search parameters for campaign opens pages
 *
 * @param rawSearchParams - Raw search parameters from Next.js searchParams
 * @returns Validated and typed query parameters with guaranteed defaults
 *
 * @example
 * ```typescript
 * const searchParams = await searchParams;
 * const queryParams = processOpenListSearchParams(searchParams);
 * // queryParams.count and queryParams.offset are guaranteed to be numbers
 * ```
 */
export function processOpenListSearchParams(
  rawSearchParams: Record<string, string | string[] | undefined>,
): OpenListQueryParams & { count: number; offset: number } {
  try {
    // Convert string parameters to appropriate types for validation
    const countStr = Array.isArray(rawSearchParams.count)
      ? rawSearchParams.count[0]
      : rawSearchParams.count;
    const offsetStr = Array.isArray(rawSearchParams.offset)
      ? rawSearchParams.offset[0]
      : rawSearchParams.offset;

    const parsedCount = countStr ? parseInt(countStr, 10) : undefined;
    const parsedOffset = offsetStr ? parseInt(offsetStr, 10) : undefined;

    const paramsToValidate = {
      ...rawSearchParams,
      count: !isNaN(parsedCount!) ? parsedCount : undefined,
      offset: !isNaN(parsedOffset!) ? parsedOffset : undefined,
    };

    const validatedParams = validateOpenListQueryParams(paramsToValidate);

    // Ensure required fields are set with proper defaults
    return {
      ...validatedParams,
      count: validatedParams.count ?? 10,
      offset: validatedParams.offset ?? 0,
    };
  } catch (error) {
    if (isDev) {
      console.error("Invalid query parameters:", error);
    }

    // Fallback to defaults if validation fails
    return {
      count: 10,
      offset: 0,
    };
  }
}
