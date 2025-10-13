/**
 * OAuth connection status parameter types
 * Used when handling our custom redirect after OAuth processing
 * (Different from OAuthCallbackParams which handles provider's redirect)
 */

/**
 * Connection status parameters parsed from our custom redirect
 * After processing OAuth callback, we redirect with these params
 */
export interface MailchimpConnectionParams {
  /** Whether OAuth connection was successful */
  connected: boolean;
  /** Error message from OAuth flow (if any) */
  error: string | null;
}

/**
 * Connection validation result
 * Returned by validation functions to indicate connection health
 */
export interface ValidationResult {
  /** Whether the connection is valid and usable */
  isValid: boolean;
  /** Error code if validation failed */
  error?: string;
}
