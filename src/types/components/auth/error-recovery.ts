/**
 * Type definitions for AuthErrorRecovery component
 */

/**
 * Auth error types for categorization
 */
export type AuthErrorType =
  | "network" // Network/connection errors
  | "timeout" // Request timeout
  | "rate_limit" // Too many requests
  | "invalid_credentials" // Invalid OAuth credentials
  | "state_not_found" // OAuth state verification failed
  | "token_exchange" // Failed to exchange code for token
  | "metadata_fetch" // Failed to fetch account metadata
  | "mailchimp_connection" // Mailchimp connection/auth error
  | "kinde_jwks" // Kinde JWKS fetch error
  | "unknown"; // Generic/unclassified error

export interface AuthErrorRecoveryProps {
  /**
   * Error type for contextual messages
   */
  errorType: AuthErrorType;

  /**
   * Error message to display
   */
  message: string;

  /**
   * Optional technical details (shown in collapsed section)
   */
  technicalDetails?: string;

  /**
   * Optional callback when "Try Again" is clicked
   * If not provided, redirects to /login
   */
  onRetry?: () => void;

  /**
   * Optional callback when "Clear Session" is clicked
   * If not provided, calls /api/auth/clear-state
   */
  onClearSession?: () => void;

  /**
   * Show detailed troubleshooting steps
   * @default true
   */
  showTroubleshootingSteps?: boolean;
}
