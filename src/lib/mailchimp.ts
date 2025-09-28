/**
 * Simple Mailchimp SDK Setup
 * Direct SDK usage for MVP - no complex service layers
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import mailchimp from "@mailchimp/mailchimp_marketing";
import { env } from "@/lib/config";
import type { ApiResponse } from "@/types/api-errors";

// Configure the Mailchimp SDK once
mailchimp.setConfig({
  apiKey: env.MAILCHIMP_API_KEY,
  server: env.MAILCHIMP_SERVER_PREFIX || "us1",
});

/**
 * Simple error formatter for SDK responses
 */
function formatError(error: any): string {
  if (error.response?.body?.detail) {
    return error.response.body.detail;
  }
  if (error.response?.body?.title) {
    return error.response.body.title;
  }
  if (error.message) {
    return error.message;
  }
  return "An unknown error occurred";
}

/**
 * Simple wrapper for SDK calls with consistent error handling
 */
export async function mailchimpCall<T>(
  sdkCall: () => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const data = await sdkCall();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

// Export the configured SDK instance
export { mailchimp };
