"use client";

/**
 * Landing Page Report Error Boundary
 * Handles errors that occur in the landing page report page
 *
 * @route /mailchimp/reporting/landing-pages/[outreach_id]
 */

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Landing page report error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Unable to Load Landing Page Report</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            An error occurred while loading the landing page report data. This
            could be due to a network issue or server problem.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" asChild>
              <Link href="/mailchimp/landing-pages">Back to Landing Pages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
