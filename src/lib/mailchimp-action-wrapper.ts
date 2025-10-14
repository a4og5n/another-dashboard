/**
 * Server Action Wrapper for Mailchimp API Calls
 * Follows Next.js App Router best practices for error handling
 *
 * Pattern: Return values for expected errors (not try/catch)
 * Reference: https://nextjs.org/docs/app/getting-started/error-handling
 */

import { getUserMailchimpClient } from "@/lib/mailchimp-client-factory";
import type { ApiResponse } from "@/types/api-errors";
import type { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import {
  MailchimpFetchError,
  MailchimpAuthError,
  MailchimpRateLimitError,
  MailchimpNetworkError,
} from "@/lib/errors";
import { MAILCHIMP_ERROR_CODES } from "@/constants";

/**
 * Wrapper for Mailchimp API calls with user-scoped client
 * Returns ApiResponse<T> for consistent error handling with structured error codes
 *
 * @param apiCall - Function that takes client and returns data
 * @returns ApiResponse with success/error state and errorCode
 */
export async function mailchimpApiCall<T>(
  apiCall: (client: MailchimpFetchClient) => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const client = await getUserMailchimpClient();
    const data = await apiCall(client);

    // Include rate limit info if available
    const rateLimitInfo = client.getRateLimitInfo();

    return {
      success: true,
      data,
      rateLimit: rateLimitInfo
        ? {
            remaining: rateLimitInfo.remaining,
            limit: rateLimitInfo.limit,
            resetTime: rateLimitInfo.resetTime,
          }
        : undefined,
    };
  } catch (error) {
    // Handle connection validation errors with errorCode
    if (error instanceof Error && "errorCode" in error) {
      return {
        success: false,
        error: error.message,
        errorCode: (error as Error & { errorCode: string }).errorCode,
        statusCode: 401,
      };
    }

    // Handle authentication errors
    if (error instanceof MailchimpAuthError) {
      return {
        success: false,
        error: error.message,
        errorCode: MAILCHIMP_ERROR_CODES.TOKEN_INVALID,
        statusCode: error.statusCode,
      };
    }

    // Handle rate limit errors
    if (error instanceof MailchimpRateLimitError) {
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${error.retryAfter} seconds.`,
        errorCode: MAILCHIMP_ERROR_CODES.RATE_LIMIT,
        statusCode: 429,
        rateLimit: {
          remaining: 0,
          limit: error.limit,
          resetTime: new Date(Date.now() + error.retryAfter * 1000),
        },
      };
    }

    // Handle API errors
    if (error instanceof MailchimpFetchError) {
      return {
        success: false,
        error: error.message,
        errorCode: MAILCHIMP_ERROR_CODES.API_ERROR,
        statusCode: error.statusCode,
      };
    }

    // Handle network errors
    if (error instanceof MailchimpNetworkError) {
      return {
        success: false,
        error: error.message,
        errorCode: MAILCHIMP_ERROR_CODES.API_ERROR,
        statusCode: 503,
      };
    }

    // Unknown error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      errorCode: MAILCHIMP_ERROR_CODES.UNKNOWN_ERROR,
      statusCode: 500,
    };
  }
}
