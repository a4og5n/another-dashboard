/**
 * User-Scoped Mailchimp Client Factory
 * Creates authenticated client instances per user
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { UnauthorizedError } from "@/types/api-errors";

/**
 * Get user-specific Mailchimp client instance
 * Retrieves OAuth token from database and creates authenticated client
 *
 * @throws {UnauthorizedError} If user not authenticated
 * @throws {Error} If Mailchimp not connected or inactive
 */
export async function getUserMailchimpClient(): Promise<MailchimpFetchClient> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  // Get decrypted token from database
  const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

  if (!connection) {
    throw new Error("Mailchimp not connected. Please connect your account.");
  }

  if (!connection.isActive) {
    throw new Error("Mailchimp connection is inactive. Please reconnect.");
  }

  // Create and return authenticated client
  return new MailchimpFetchClient({
    accessToken: connection.accessToken,
    serverPrefix: connection.serverPrefix,
  });
}
