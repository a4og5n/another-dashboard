/**
 * Authentication Error Page
 * Handles authentication errors with user-friendly messages and automatic recovery
 *
 * Features:
 * - Detects "State not found" errors from Kinde OAuth
 * - Automatic cookie cleanup on page load
 * - Clear recovery instructions
 * - One-click retry with automatic state cleanup
 * - Links to clear browser cache
 */
import { Suspense } from "react";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { AuthErrorContent } from "@/components/auth/auth-error-content";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication",
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="text-3xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            We encountered an issue while signing you in
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
            <CardDescription>
              Your authentication session expired or was corrupted. This usually
              happens when:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Browser cookies from a previous session are stale</li>
              <li>You opened the login page in multiple tabs</li>
              <li>
                You navigated back after starting the authentication process
              </li>
              <li>Your browser blocked or cleared authentication cookies</li>
            </ul>

            <Alert>
              <RefreshCw className="h-4 w-4" />
              <AlertDescription>
                Don&apos;t worry! We&apos;ve automatically cleared your
                authentication state. Simply try signing in again.
              </AlertDescription>
            </Alert>

            {/* Client-side error content with automatic cleanup */}
            <Suspense fallback={<div>Loading...</div>}>
              <AuthErrorContent />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Still having issues?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you continue to experience authentication errors, try these
              additional steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Clear your browser cache and cookies:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Mac: Cmd + Shift + Delete</li>
                  <li>Windows/Linux: Ctrl + Shift + Delete</li>
                  <li>Select &quot;Cookies and other site data&quot;</li>
                  <li>
                    Choose &quot;All time&quot; and click &quot;Clear data&quot;
                  </li>
                </ul>
              </li>
              <li>
                <strong>Try a different browser</strong> or use
                incognito/private mode
              </li>
              <li>
                <strong>Disable browser extensions</strong> that might interfere
                with authentication
              </li>
              <li>
                <strong>Contact support</strong> if the issue persists
              </li>
            </ol>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Your security and privacy are our top priority
        </p>
      </div>
    </div>
  );
}
