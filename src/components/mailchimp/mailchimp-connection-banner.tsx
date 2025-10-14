/**
 * Mailchimp Connection Guard
 * Handles all connection-related UI logic:
 * - Shows success/error banner after OAuth flow
 * - Shows empty state if not connected
 * - Renders children only when connected
 */

"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { MailchimpEmptyState } from "@/components/mailchimp/mailchimp-empty-state";
import type { MailchimpConnectionBannerProps } from "@/types/components/mailchimp";

/**
 * Self-contained connection guard component
 * Handles all connection states and renders appropriate UI
 */
export function MailchimpConnectionBanner({
  connected,
  error,
  isValid,
  children,
}: MailchimpConnectionBannerProps) {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Auto-dismiss banner after 5 seconds
  useEffect(() => {
    if (!connected && !error) return;

    const timer = setTimeout(() => setIsBannerVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [connected, error]);

  // Show banner if redirected from OAuth
  const showBanner = isBannerVisible && (connected || error);

  // If not connected, show empty state (with optional banner)
  if (!isValid) {
    return (
      <>
        {showBanner && (
          <ConnectionBanner
            connected={connected}
            error={error}
            onDismiss={() => setIsBannerVisible(false)}
          />
        )}
        <MailchimpEmptyState error={error} />
      </>
    );
  }

  // Connected: show banner (if applicable) and children
  return (
    <>
      {showBanner && (
        <ConnectionBanner
          connected={connected}
          error={error}
          onDismiss={() => setIsBannerVisible(false)}
        />
      )}
      {children}
    </>
  );
}

/**
 * Internal banner component for success/error messages
 */
function ConnectionBanner({
  connected,
  error,
  onDismiss,
}: {
  connected?: boolean;
  error?: string | null;
  onDismiss: () => void;
}) {
  return (
    <Alert variant={connected ? "default" : "destructive"} className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription>
                <strong>Mailchimp connected successfully!</strong> Your
                dashboard is now loading...
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                <strong>Connection failed.</strong> {error}
              </AlertDescription>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
