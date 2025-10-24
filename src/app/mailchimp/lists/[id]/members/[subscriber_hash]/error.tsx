/**
 * Member Profile Error Boundary
 * Handles errors on the member profile page with retry functionality
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Log error to console for debugging
    console.error("Member Profile Error:", error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Reset error boundary (this triggers re-render)
    reset();
    // Note: reset() will unmount this component on success,
    // so we don't need to reset isRetrying state
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md mx-auto border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
          <CardTitle className="text-red-800">
            Failed to Load Member Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-700 text-center">
            An unexpected error occurred while loading the member profile.
            Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer font-medium hover:text-red-800">
                Error details (development only)
              </summary>
              <pre className="mt-2 rounded bg-red-100 p-2 overflow-auto text-xs">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            variant="default"
            className="w-full gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Try again"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
