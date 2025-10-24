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

  const handleRetry = () => {
    setIsRetrying(true);
    // Reset error boundary
    reset();
    // Reset state after a brief delay to show loading
    setTimeout(() => setIsRetrying(false), 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-700">
            An unexpected error occurred while loading the member profile.
            Please try again.
          </p>
          {error.message && (
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer font-medium">
                Error details
              </summary>
              <pre className="mt-2 rounded bg-red-100 p-2 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            variant="default"
            className="gap-2"
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
