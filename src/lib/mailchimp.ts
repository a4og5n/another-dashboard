/**
 * User-Scoped Mailchimp SDK Setup
 * Creates Mailchimp client instances per user based on OAuth tokens
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// SDK interop requires any types for proper functioning

import mailchimp from "@mailchimp/mailchimp_marketing";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import type { ApiResponse } from "@/types/api-errors";

/**
 * Get user-specific Mailchimp client
 * Retrieves OAuth token from database and configures SDK
 */
export async function getUserMailchimpClient() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  // Get decrypted token from database
  const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

  if (!connection) {
    throw new Error("Mailchimp not connected. Please connect your account.");
  }

  if (!connection.isActive) {
    throw new Error("Mailchimp connection is inactive. Please reconnect.");
  }

  // Configure client with user's token
  mailchimp.setConfig({
    accessToken: connection.accessToken,
    server: connection.serverPrefix,
  });

  return mailchimp;
}

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
 * Wrapper for SDK calls with user-scoped client and error handling
 */
export async function mailchimpCall<T>(
  sdkCall: (client: typeof mailchimp) => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const client = await getUserMailchimpClient();
    const data = await sdkCall(client);
    return { success: true, data };
  } catch (error: any) {
    // Handle connection errors
    if (
      error.message?.includes("not connected") ||
      error.message?.includes("inactive")
    ) {
      return { success: false, error: error.message };
    }

    return { success: false, error: formatError(error) };
  }
}
