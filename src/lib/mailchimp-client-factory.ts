/**
 * User-Scoped Mailchimp Client Factory
 * Creates authenticated client instances per user with validation and caching
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { UnauthorizedError } from "@/types/api-errors";
import type {
  MailchimpValidationResult,
  CachedValidationResult,
} from "@/types/auth";
import { MAILCHIMP_ERROR_CODES, VALIDATION_CACHE_TTL_MS } from "@/constants";

/**
 * In-memory cache for validation results
 * Key: Kinde user ID
 * Value: Cached validation result with timestamp
 *
 * Cache invalidation: 1 hour (matches token validation interval)
 */
const validationCache = new Map<string, CachedValidationResult>();

/**
 * Validate user's Mailchimp connection
 * Returns structured validation result with error codes
 * Implements in-memory caching to reduce database queries
 *
 * @param userId - Kinde user ID
 * @returns Validation result with connection details or error code
 */
async function validateUserConnection(
  userId: string,
): Promise<MailchimpValidationResult> {
  // Check cache first
  const cached = validationCache.get(userId);
  if (cached && Date.now() - cached.timestamp < VALIDATION_CACHE_TTL_MS) {
    return cached.result;
  }

  // Fetch connection from database
  const connection = await mailchimpConnectionRepo.getDecryptedToken(userId);

  // Connection doesn't exist
  if (!connection) {
    const result: MailchimpValidationResult = {
      isValid: false,
      errorCode: MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
      errorMessage:
        "Mailchimp account not connected. Please connect your account to continue.",
    };
    validationCache.set(userId, { result, timestamp: Date.now() });
    return result;
  }

  // Connection exists but is inactive
  if (!connection.isActive) {
    const result: MailchimpValidationResult = {
      isValid: false,
      errorCode: MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE,
      errorMessage:
        "Your Mailchimp connection is inactive. Please reconnect your account.",
    };
    validationCache.set(userId, { result, timestamp: Date.now() });
    return result;
  }

  // Connection is valid
  const result: MailchimpValidationResult = {
    isValid: true,
    server: connection.serverPrefix,
    accessToken: connection.accessToken,
  };
  validationCache.set(userId, { result, timestamp: Date.now() });
  return result;
}

/**
 * Invalidate cache for a specific user
 * Call this when connection state changes (disconnect, reconnect, etc.)
 *
 * @param userId - Kinde user ID
 */
export function invalidateValidationCache(userId: string): void {
  validationCache.delete(userId);
}

/**
 * Clear entire validation cache
 * Useful for testing or cache management
 */
export function clearValidationCache(): void {
  validationCache.clear();
}

/**
 * Get user-specific Mailchimp client instance
 * Includes automatic validation with structured error codes
 *
 * @throws {UnauthorizedError} If user not authenticated (with errorCode)
 * @throws {Error} If connection validation fails (with errorCode property)
 */
export async function getUserMailchimpClient(): Promise<MailchimpFetchClient> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    const error = new UnauthorizedError("User not authenticated");
    (error as UnauthorizedError & { errorCode: string }).errorCode =
      MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED;
    throw error;
  }

  // Validate connection with caching
  const validation = await validateUserConnection(user.id);

  if (!validation.isValid) {
    const error = new Error(
      validation.errorMessage || "Mailchimp connection validation failed",
    );
    (error as Error & { errorCode: string }).errorCode =
      validation.errorCode || MAILCHIMP_ERROR_CODES.UNKNOWN_ERROR;
    throw error;
  }

  // Create and return authenticated client
  return new MailchimpFetchClient({
    accessToken: validation.accessToken!,
    serverPrefix: validation.server!,
  });
}
