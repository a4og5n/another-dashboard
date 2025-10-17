/**
 * Authentication and OAuth Error Codes
 * Centralized error code constants for authentication flows
 */

/**
 * Mailchimp connection validation error codes
 * Used by DAL layer and UI components for consistent error handling
 */
export const MAILCHIMP_ERROR_CODES = {
  /** User not authenticated with Kinde */
  NOT_AUTHENTICATED: "user_not_authenticated",
  /** User has not connected their Mailchimp account */
  NOT_CONNECTED: "mailchimp_not_connected",
  /** Mailchimp connection exists but is marked inactive */
  CONNECTION_INACTIVE: "mailchimp_connection_inactive",
  /** Mailchimp OAuth token is invalid or expired */
  TOKEN_INVALID: "mailchimp_token_invalid",
  /** Validation check failed (network or API error) */
  VALIDATION_FAILED: "validation_failed",
  /** Rate limit exceeded */
  RATE_LIMIT: "mailchimp_rate_limit",
  /** Network or API error */
  API_ERROR: "mailchimp_api_error",
  /** Database connectivity error */
  DATABASE_ERROR: "database_connection_error",
  /** Unknown error occurred */
  UNKNOWN_ERROR: "mailchimp_unknown_error",
} as const;

/**
 * Type helper for Mailchimp error codes
 */
export type MailchimpErrorCode =
  (typeof MAILCHIMP_ERROR_CODES)[keyof typeof MAILCHIMP_ERROR_CODES];

/**
 * Cache TTL for validation results (1 hour in milliseconds)
 * Matches the token validation interval in the database
 */
export const VALIDATION_CACHE_TTL_MS = 60 * 60 * 1000;
