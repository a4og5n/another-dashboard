/**
 * Mailchimp Connection Guard (Pure UI Component)
 * Pure UI component that renders content based on errorCode prop
 *
 * This component is now purely presentational - validation happens at the DAL layer
 * and the errorCode is passed down from server actions/pages.
 *
 * Architecture:
 * - Pure UI Component: No business logic or validation
 * - Wraps MailchimpConnectionBanner (Client Component) for UI logic
 * - Receives errorCode from parent (DAL handles validation)
 * - Passes OAuth callback params for success/error banners
 */

import { MailchimpConnectionBanner } from "@/components/mailchimp/mailchimp-connection-banner";
import type { ReactNode } from "react";

interface MailchimpConnectionGuardProps {
  /**
   * Content to render when connection is valid (no errorCode)
   * Can be a ReactNode or a function that returns a ReactNode
   * Use function form to defer execution until after validation
   */
  children: ReactNode | (() => ReactNode);

  /**
   * Error code from DAL validation
   * If present, shows empty state instead of children
   * Possible values: 'MAILCHIMP_NOT_CONNECTED', 'MAILCHIMP_TOKEN_EXPIRED', etc.
   */
  errorCode?: string;

  /**
   * Optional: OAuth callback connected status
   * Used to show success banner after OAuth flow
   */
  connected?: boolean;

  /**
   * Optional: OAuth callback error message
   * Used to show error banner after OAuth flow
   */
  oauthError?: string | null;
}

/**
 * Pure UI Component that renders based on errorCode prop
 * Validation happens at DAL layer, not in this component
 *
 * @example
 * ```tsx
 * // Usage with DAL validation result
 * const result = await mailchimpDAL.fetchCampaigns();
 *
 * <MailchimpConnectionGuard errorCode={result.errorCode}>
 *   <YourMailchimpContent data={result.data} />
 * </MailchimpConnectionGuard>
 *
 * // With OAuth callback params (for main dashboard page)
 * <MailchimpConnectionGuard
 *   errorCode={result.errorCode}
 *   connected={connected}
 *   oauthError={error}
 * >
 *   <YourMailchimpContent />
 * </MailchimpConnectionGuard>
 * ```
 */
export function MailchimpConnectionGuard({
  children,
  errorCode,
  connected,
  oauthError,
}: MailchimpConnectionGuardProps) {
  // If errorCode present, connection is not valid - show empty state
  const isValid = !errorCode;

  // If not valid, show empty state (children won't be evaluated)
  if (!isValid) {
    return (
      <MailchimpConnectionBanner
        isValid={false}
        error={errorCode || oauthError}
        connected={connected}
      >
        {null}
      </MailchimpConnectionBanner>
    );
  }

  // Connection valid - evaluate children (function or ReactNode)
  const content = typeof children === "function" ? children() : children;

  return (
    <MailchimpConnectionBanner
      isValid={true}
      error={oauthError}
      connected={connected}
    >
      {content}
    </MailchimpConnectionBanner>
  );
}
