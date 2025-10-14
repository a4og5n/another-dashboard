/**
 * Mailchimp Connection Guard (Server Component)
 * Server-side wrapper that automatically validates Mailchimp connection
 * before rendering children or showing empty state
 *
 * This component handles validation internally, so pages don't need to remember
 * to call validateMailchimpConnection() before using it.
 *
 * Architecture:
 * - Server Component: Validates connection on server
 * - Wraps MailchimpConnectionBanner (Client Component) for UI logic
 * - Passes OAuth callback params for success/error banners
 */

import { MailchimpConnectionBanner } from "@/components/mailchimp/mailchimp-connection-banner";
import { validateMailchimpConnection } from "@/lib/validate-mailchimp-connection";
import type { ReactNode } from "react";

interface MailchimpConnectionGuardProps {
  /**
   * Content to render when connection is valid
   * Can be a ReactNode or a function that returns a ReactNode
   * Use function form to defer execution until after validation
   */
  children: ReactNode | (() => ReactNode);

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
 * Server Component that validates Mailchimp connection automatically
 * and delegates UI rendering to MailchimpConnectionBanner
 *
 * @example
 * ```tsx
 * // Simple usage - validation happens automatically
 * <MailchimpConnectionGuard>
 *   <YourMailchimpContent />
 * </MailchimpConnectionGuard>
 *
 * // With OAuth callback params (for main dashboard page)
 * <MailchimpConnectionGuard connected={connected} oauthError={error}>
 *   <YourMailchimpContent />
 * </MailchimpConnectionGuard>
 * ```
 */
export async function MailchimpConnectionGuard({
  children,
  connected,
  oauthError,
}: MailchimpConnectionGuardProps) {
  // Automatically validate connection - pages don't need to do this manually
  const validation = await validateMailchimpConnection();

  // If not valid, show empty state (children won't be evaluated)
  if (!validation.isValid) {
    return (
      <MailchimpConnectionBanner
        isValid={false}
        error={validation.error || oauthError}
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
