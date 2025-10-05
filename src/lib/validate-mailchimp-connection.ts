/**
 * Mailchimp Connection Validation Middleware
 * Validates OAuth token health and connection status
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { mailchimpService } from "@/services/mailchimp.service";

/**
 * Connection validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Error codes for Mailchimp connection issues
 */
export const MAILCHIMP_ERROR_CODES = {
  NOT_AUTHENTICATED: "user_not_authenticated",
  NOT_CONNECTED: "mailchimp_not_connected",
  CONNECTION_INACTIVE: "mailchimp_connection_inactive",
  TOKEN_INVALID: "mailchimp_token_invalid",
  VALIDATION_FAILED: "validation_failed",
} as const;

/**
 * Validate Mailchimp connection and token health
 * Call this in server components/actions before making API calls
 *
 * Features:
 * - Checks user authentication
 * - Verifies connection exists and is active
 * - Validates token health (once per hour to avoid rate limits)
 * - Auto-deactivates invalid connections
 */
export async function validateMailchimpConnection(): Promise<ValidationResult> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return {
        isValid: false,
        error: MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED,
      };
    }

    const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

    if (!connection) {
      return {
        isValid: false,
        error: MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
      };
    }

    if (!connection.isActive) {
      return {
        isValid: false,
        error: MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE,
      };
    }

    // Optional: Validate token with lightweight API call
    // Only do this once per session/hour to avoid rate limits
    const lastValidated = await mailchimpConnectionRepo.findByKindeUserId(
      user.id,
    );
    const hoursSinceValidation = lastValidated?.lastValidatedAt
      ? (Date.now() - lastValidated.lastValidatedAt.getTime()) /
        (1000 * 60 * 60)
      : 999;

    if (hoursSinceValidation > 1) {
      // Validate with ping endpoint
      const pingResult = await mailchimpService.healthCheck();

      if (!pingResult.success) {
        // Token invalid - mark connection inactive
        await mailchimpConnectionRepo.update(user.id, { isActive: false });
        return {
          isValid: false,
          error: MAILCHIMP_ERROR_CODES.TOKEN_INVALID,
        };
      }

      // Update last validated timestamp
      await mailchimpConnectionRepo.touchValidation(user.id);
    }

    return { isValid: true };
  } catch (error) {
    console.error("Connection validation error:", error);
    return {
      isValid: false,
      error: MAILCHIMP_ERROR_CODES.VALIDATION_FAILED,
    };
  }
}

/**
 * Get user-friendly error message for error codes
 */
export function getValidationErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED:
      return "You must be logged in to access Mailchimp data.";
    case MAILCHIMP_ERROR_CODES.NOT_CONNECTED:
      return "Mailchimp account not connected. Please connect your account to continue.";
    case MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE:
      return "Your Mailchimp connection is inactive. Please reconnect your account.";
    case MAILCHIMP_ERROR_CODES.TOKEN_INVALID:
      return "Your Mailchimp connection has expired. Please reconnect your account.";
    case MAILCHIMP_ERROR_CODES.VALIDATION_FAILED:
      return "Failed to validate Mailchimp connection. Please try again.";
    default:
      return "An error occurred with your Mailchimp connection.";
  }
}
