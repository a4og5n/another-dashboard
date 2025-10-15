import { notFound } from "next/navigation";
import type { ApiResponse } from "@/types";

/**
 * Check if an error message indicates a 404/not found error
 *
 * Following Next.js best practices for error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 *
 * @param message - Error message to check
 * @returns true if the message indicates a 404 error
 *
 * @example
 * ```tsx
 * is404Error("Campaign not found") // true
 * is404Error("Resource does not exist") // true
 * is404Error("Invalid API key") // false
 * ```
 */
export function is404Error(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return (
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("404") ||
    normalizedMessage.includes("does not exist")
  );
}

/**
 * Handle API response errors with automatic 404 detection
 *
 * This utility follows Next.js App Router conventions:
 * - Calls notFound() to trigger not-found.tsx rendering (safe in Server Components)
 * - Returns error message for non-404 errors to allow conditional UI rendering
 * - Returns null for successful responses
 *
 * Note: This does not throw for non-404 errors, following Next.js guidance
 * to model expected errors as return values rather than exceptions.
 *
 * @param response - API response from DAL (includes success, data, error, errorCode)
 * @returns error message if not a 404, null if success
 * @throws Calls notFound() for 404 errors (triggers Next.js not-found.tsx)
 *
 * @example
 * ```tsx
 * const response = await mailchimpDAL.fetchCampaignReport(id);
 * const error = handleApiError(response);
 * if (error) {
 *   return <ErrorDisplay message={error} />;
 * }
 * // Render success UI
 * ```
 */
export function handleApiError(response: ApiResponse<unknown>): string | null {
  if (!response.success) {
    const errorMessage = response.error || "Failed to load data";
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}

/**
 * Handle API errors with custom fallback message
 *
 * Same as handleApiError but allows specifying a custom fallback message
 * when response.error is undefined.
 *
 * @param response - API response from DAL
 * @param fallbackMessage - Custom error message if response.error is undefined
 * @returns error message if not a 404, null if success
 * @throws Calls notFound() for 404 errors (triggers Next.js not-found.tsx)
 *
 * @example
 * ```tsx
 * const response = await mailchimpDAL.fetchList(id);
 * const error = handleApiErrorWithFallback(response, "Failed to load list details");
 * if (error) {
 *   return <ErrorDisplay message={error} />;
 * }
 * ```
 */
export function handleApiErrorWithFallback(
  response: ApiResponse<unknown>,
  fallbackMessage: string,
): string | null {
  if (!response.success) {
    const errorMessage = response.error || fallbackMessage;
    if (is404Error(errorMessage)) {
      notFound();
    }
    return errorMessage;
  }
  return null;
}
