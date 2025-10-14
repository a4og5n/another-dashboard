"use client";

/**
 * Auth Error Content Component
 * Client-side component for handling authentication errors with automatic recovery
 *
 * Features:
 * - Automatic state cleanup on mount
 * - Displays error details from URL parameters
 * - One-click retry to login page
 * - Manual cache clear option
 * - Shows cleanup status to user
 *
 * @component
 */
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupComplete, setCleanupComplete] = useState(false);
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  // Get error details from URL parameters
  const errorMessage =
    searchParams.get("error") || "Unknown authentication error";
  const errorDescription = searchParams.get("error_description");

  // Automatically cleanup auth state on component mount
  useEffect(() => {
    const cleanupAuthState = async () => {
      setIsCleaningUp(true);
      try {
        const response = await fetch("/api/auth/clear-state");
        const data = await response.json();

        if (data.success) {
          setCleanupComplete(true);
        } else {
          setCleanupError(
            data.message || "Failed to clear authentication state",
          );
        }
      } catch (error) {
        console.error("Error cleaning up auth state:", error);
        setCleanupError("Network error while clearing authentication state");
      } finally {
        setIsCleaningUp(false);
      }
    };

    cleanupAuthState();
  }, []);

  const handleRetryLogin = () => {
    // Navigate to login page after cleanup
    router.push("/login");
  };

  const handleClearCache = () => {
    // Provide instructions based on platform
    if (typeof window !== "undefined") {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      const shortcut = isMac ? "Cmd + Shift + Delete" : "Ctrl + Shift + Delete";
      alert(
        `To clear your browser cache:\n\n` +
          `1. Press ${shortcut}\n` +
          `2. Select "Cookies and other site data"\n` +
          `3. Choose "All time"\n` +
          `4. Click "Clear data"\n` +
          `5. Return to this page and try again`,
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Error details */}
      {errorDescription && errorDescription !== errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-xs">
            {errorDescription}
          </AlertDescription>
        </Alert>
      )}

      {/* Cleanup status */}
      {isCleaningUp && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Clearing authentication state...</AlertDescription>
        </Alert>
      )}

      {cleanupComplete && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Authentication state cleared successfully. You can now try signing
            in again.
          </AlertDescription>
        </Alert>
      )}

      {cleanupError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {cleanupError}
            <br />
            <span className="text-xs">
              You may need to manually clear your browser cache.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleRetryLogin}
          disabled={isCleaningUp}
          className="flex-1"
        >
          {isCleaningUp ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cleaning up...
            </>
          ) : (
            "Try signing in again"
          )}
        </Button>

        <Button onClick={handleClearCache} variant="outline" className="flex-1">
          Clear browser cache
        </Button>
      </div>
    </div>
  );
}
