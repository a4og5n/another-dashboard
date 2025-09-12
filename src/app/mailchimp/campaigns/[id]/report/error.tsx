/**
 * Campaign Report Detail Error Page
 * Error boundary for campaign report detail pages
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established error handling
 */

"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Campaign report error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>Unable to load the campaign report.</p>
            <p className="text-sm mt-2">
              {error.message.includes("not found") ||
              error.message.includes("404")
                ? "This campaign report doesn't exist or has been deleted."
                : "There was an error loading the report data."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => reset()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/mailchimp/reports">
                <Home className="h-4 w-4 mr-2" />
                Back to Reports
              </Link>
            </Button>
          </div>

          {error.digest && (
            <div className="text-xs text-center text-muted-foreground">
              Error ID: {error.digest}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
