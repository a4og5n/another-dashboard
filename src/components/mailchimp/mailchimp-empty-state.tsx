/**
 * Mailchimp Onboarding Component
 * Welcoming experience for users connecting their Mailchimp account
 * Prompts OAuth connection flow with clear benefits
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface MailchimpEmptyStateProps {
  error?: string | null;
}

/**
 * Get user-friendly error message for connection errors
 * Only shown when there's an actual error (not for initial connection)
 */
function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    access_denied:
      "You denied access to Mailchimp. Please try again if you'd like to connect.",
    invalid_state: "Security validation failed. Please try connecting again.",
    unauthorized: "Please log in to connect your Mailchimp account.",
    connection_failed: "Failed to establish connection. Please try again.",
    missing_parameters: "Invalid OAuth response. Please try again.",
    mailchimp_connection_inactive:
      "Your Mailchimp connection is inactive. Please reconnect your account.",
    mailchimp_token_invalid:
      "Your Mailchimp connection has expired. Please reconnect your account.",
    database_connection_error:
      "Unable to connect to database. Please check your internet connection and try again later.",
    mailchimp_unreachable:
      "Unable to reach Mailchimp servers. This may be a temporary network issue. Please check your internet connection and try again in a few moments.",
    database_error:
      "Database error occurred while saving your connection. Please try again later.",
  };

  return messages[error] || "An error occurred. Please try again.";
}

/**
 * Onboarding experience for connecting Mailchimp
 * Shows benefits and makes the connection process welcoming
 */
export function MailchimpEmptyState({ error }: MailchimpEmptyStateProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  // Only show error styling if there's an actual error (not normal "not connected" state)
  const hasActualError = error && error !== "mailchimp_not_connected";

  async function handleConnect() {
    setIsConnecting(true);
    try {
      // Call authorize endpoint to get OAuth URL
      const response = await fetch("/api/auth/mailchimp/authorize", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate connection");
      }

      const { url } = await response.json();

      // Redirect to Mailchimp OAuth page
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to Mailchimp. Please try again.");
      setIsConnecting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {hasActualError
              ? "Reconnect Your Mailchimp Account"
              : "Welcome! Let's Get Started"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {hasActualError
              ? "We need to reconnect your account to continue"
              : "Connect your Mailchimp account to unlock powerful insights"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasActualError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {getErrorMessage(error)}
            </div>
          )}

          {!hasActualError && (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                What you&apos;ll get access to:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Campaign Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Track opens, clicks, and engagement metrics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Audience Insights</p>
                    <p className="text-xs text-muted-foreground">
                      Monitor subscriber growth and list health
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Real-Time Data</p>
                    <p className="text-xs text-muted-foreground">
                      Always up-to-date with your latest campaigns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            size="lg"
            className="w-full"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                Connect Mailchimp Account
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-muted-foreground">
              <strong className="text-foreground">Safe & Secure:</strong> We use
              OAuth 2.0 for authentication. You can revoke access anytime from
              your Mailchimp account settings.
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By connecting, you authorize Fichaz to access your Mailchimp data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
