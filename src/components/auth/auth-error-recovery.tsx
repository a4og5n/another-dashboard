"use client";

/**
 * Auth Error Recovery Component
 * Provides user-friendly error messages and actionable recovery steps
 * for authentication and OAuth-related failures.
 *
 * Features:
 * - Context-aware error messages (Kinde vs Mailchimp)
 * - Specific recovery instructions based on error type
 * - "Try Again" and "Clear Session" actions
 * - Links to troubleshooting documentation
 * - Network error detection
 * - Rate limit guidance
 *
 * @component
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  XCircle,
  WifiOff,
  Clock,
  Shield,
} from "lucide-react";
import type {
  AuthErrorType,
  AuthErrorRecoveryProps,
} from "@/types/components/auth/error-recovery";

/**
 * Get icon component based on error type
 */
function getErrorIcon(errorType: AuthErrorType) {
  switch (errorType) {
    case "network":
    case "timeout":
      return WifiOff;
    case "rate_limit":
      return Clock;
    case "invalid_credentials":
    case "state_not_found":
      return Shield;
    default:
      return AlertCircle;
  }
}

/**
 * Get contextual recovery steps based on error type
 */
function getRecoverySteps(errorType: AuthErrorType): string[] {
  switch (errorType) {
    case "network":
      return [
        "Check your internet connection",
        "Verify your firewall isn't blocking the request",
        "Try refreshing the page",
        "Wait a few moments and try again",
      ];

    case "timeout":
      return [
        "The request took too long to complete",
        "Check your internet connection speed",
        "Try again in a few moments",
        "If the issue persists, contact support",
      ];

    case "rate_limit":
      return [
        "You've made too many authentication attempts",
        "Wait 5-10 minutes before trying again",
        "Clear your browser cache and cookies",
        "If the issue persists, contact support",
      ];

    case "invalid_credentials":
      return [
        "Your OAuth credentials may be incorrect",
        "Verify your Mailchimp account is active",
        "Try disconnecting and reconnecting your account",
        "Contact support if the issue persists",
      ];

    case "state_not_found":
      return [
        "OAuth state verification failed (security check)",
        "Clear your browser cookies for this site",
        "Make sure cookies are enabled in your browser",
        "Try in an incognito/private window",
        'In development: ensure KINDE_COOKIE_DOMAIN="127.0.0.1"',
      ];

    case "token_exchange":
      return [
        "Failed to exchange authorization code for access token",
        "The authorization code may have expired",
        "Try signing in again from the beginning",
        "Clear your browser cache if the issue persists",
      ];

    case "metadata_fetch":
      return [
        "Failed to retrieve your Mailchimp account information",
        "Mailchimp's servers may be temporarily unavailable",
        "Wait a few moments and try again",
        "Check Mailchimp status at status.mailchimp.com",
      ];

    case "mailchimp_connection":
      return [
        "Unable to connect to Mailchimp",
        "Your Mailchimp connection may have expired",
        "Try reconnecting your account in Settings → Integrations",
        "Verify your Mailchimp account is active",
      ];

    case "kinde_jwks":
      return [
        "Failed to verify authentication with Kinde",
        "This is usually a temporary network issue",
        "Clear your browser cache and cookies",
        "Try again in a few moments",
        "If developing locally, restart the dev server",
      ];

    default:
      return [
        "An unexpected error occurred",
        "Try clearing your browser cache and cookies",
        "Sign out and sign in again",
        "If the issue persists, contact support",
      ];
  }
}

/**
 * AuthErrorRecovery Component
 */
export function AuthErrorRecovery({
  errorType,
  message,
  technicalDetails,
  onRetry,
  onClearSession,
  showTroubleshootingSteps = true,
}: AuthErrorRecoveryProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const Icon = getErrorIcon(errorType);
  const recoverySteps = getRecoverySteps(errorType);

  /**
   * Handle "Try Again" action
   */
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default: redirect to login
      router.push("/login");
    }
  };

  /**
   * Handle "Clear Session" action
   */
  const handleClearSession = async () => {
    if (onClearSession) {
      onClearSession();
      return;
    }

    // Default: call clear-state API
    setIsClearing(true);
    try {
      const response = await fetch("/api/auth/clear-state");
      const data = await response.json();

      if (data.success) {
        // Redirect to login after successful cleanup
        router.push("/login");
      } else {
        console.error("Failed to clear session:", data.message);
        alert(
          "Failed to clear session. Please clear your browser cookies manually.",
        );
      }
    } catch (error) {
      console.error("Error clearing session:", error);
      alert("Network error while clearing session. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <CardTitle className="text-destructive">
              Authentication Error
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Technical details (collapsible) */}
        {technicalDetails && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="mb-2 h-auto p-0 text-xs hover:no-underline"
            >
              {showDetails ? "Hide" : "Show"} technical details
            </Button>
            {showDetails && (
              <Alert className="bg-muted">
                <AlertDescription className="font-mono text-xs break-all">
                  {technicalDetails}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Recovery steps */}
        {showTroubleshootingSteps && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">What you can try:</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {recoverySteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleRetry}
            variant="default"
            className="flex-1"
            disabled={isClearing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={handleClearSession}
            variant="outline"
            className="flex-1"
            disabled={isClearing}
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Clear Session
              </>
            )}
          </Button>
        </div>

        {/* Help link */}
        <p className="text-xs text-center text-muted-foreground">
          Need more help?{" "}
          <a
            href="/docs/troubleshooting/authentication"
            className="text-primary hover:underline"
          >
            View troubleshooting guide
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to detect error type from error object
 */
export function detectAuthErrorType(error: unknown): AuthErrorType {
  if (typeof error === "object" && error !== null) {
    const err = error as { status?: number; message?: string; code?: string };

    // Check for specific error patterns
    if (err.message?.toLowerCase().includes("network")) return "network";
    if (err.message?.toLowerCase().includes("timeout")) return "timeout";
    if (err.message?.toLowerCase().includes("state not found"))
      return "state_not_found";
    if (err.message?.toLowerCase().includes("token")) return "token_exchange";
    if (err.message?.toLowerCase().includes("metadata"))
      return "metadata_fetch";
    if (err.message?.toLowerCase().includes("jwks")) return "kinde_jwks";

    // Check HTTP status codes
    if (err.status === 429) return "rate_limit";
    if (err.status === 401 || err.status === 403) return "invalid_credentials";
    if (err.status && err.status >= 500) return "network";
  }

  return "unknown";
}
