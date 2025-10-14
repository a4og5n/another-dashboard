/**
 * Mailchimp OAuth Validation Types
 *
 * Types for OAuth connection validation and error handling
 * Used by DAL layer and UI components for consistent error states
 */

import type { MailchimpErrorCode } from "@/constants";

/**
 * Result of Mailchimp connection validation
 * Used internally by client factory and action wrapper
 */
export interface MailchimpValidationResult {
  /** Whether the validation succeeded */
  isValid: boolean;
  /** Error code if validation failed */
  errorCode?: MailchimpErrorCode;
  /** Human-readable error message */
  errorMessage?: string;
  /** The Mailchimp API server URL if validation succeeded */
  server?: string;
  /** The decrypted access token if validation succeeded */
  accessToken?: string;
}

/**
 * Cached validation result with timestamp
 * Used for in-memory caching to reduce database queries
 */
export interface CachedValidationResult {
  /** The validation result */
  result: MailchimpValidationResult;
  /** Timestamp when this result was cached */
  timestamp: number;
}
