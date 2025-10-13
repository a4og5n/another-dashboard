/**
 * Authentication and OAuth Error Codes
 * Centralized error code constants for authentication flows
 */

/**
 * Mailchimp connection validation error codes
 * Used by validateMailchimpConnection to indicate specific failure reasons
 */
export const MAILCHIMP_ERROR_CODES = {
  NOT_AUTHENTICATED: "user_not_authenticated",
  NOT_CONNECTED: "mailchimp_not_connected",
  CONNECTION_INACTIVE: "mailchimp_connection_inactive",
  TOKEN_INVALID: "mailchimp_token_invalid",
  VALIDATION_FAILED: "validation_failed",
} as const;

/**
 * Type helper for Mailchimp error codes
 */
export type MailchimpErrorCode =
  (typeof MAILCHIMP_ERROR_CODES)[keyof typeof MAILCHIMP_ERROR_CODES];
