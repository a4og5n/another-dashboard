/**
 * Mailchimp Empty State Component
 * Shown when user hasn't connected their Mailchimp account
 * Prompts OAuth connection flow
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
import { Mail, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MailchimpEmptyStateProps {
  error?: string | null;
}

/**
 * Get user-friendly error message for connection errors
 */
function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    access_denied:
      "You denied access to Mailchimp. Please try again if you'd like to connect.",
    invalid_state: "Security validation failed. Please try connecting again.",
    unauthorized: "Please log in to connect your Mailchimp account.",
    connection_failed: "Failed to establish connection. Please try again.",
    missing_parameters: "Invalid OAuth response. Please try again.",
    mailchimp_not_connected:
      "Mailchimp account not connected. Click below to get started.",
    mailchimp_connection_inactive:
      "Your Mailchimp connection is inactive. Please reconnect your account.",
    mailchimp_token_invalid:
      "Your Mailchimp connection has expired. Please reconnect your account.",
  };

  return messages[error] || "An error occurred. Please try again.";
}

/**
 * Empty state shown when user hasn't connected Mailchimp
 */
export function MailchimpEmptyState({ error }: MailchimpEmptyStateProps) {
  const [isConnecting, setIsConnecting] = useState(false);

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
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Connect Your Mailchimp Account
          </CardTitle>
          <CardDescription className="text-base mt-2">
            View campaign analytics, audience insights, and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {getErrorMessage(error)}
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
                Connect Mailchimp
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
            By connecting, you authorize Another Dashboard to access your
            Mailchimp data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
