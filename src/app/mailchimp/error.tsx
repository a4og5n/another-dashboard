"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function MailchimpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Mailchimp page error:", error);
  }, [error]);

  // Check for specific error types
  const isConnectionError =
    error.message.includes("not connected") ||
    error.message.includes("inactive");

  return (
    <DashboardLayout>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            {isConnectionError
              ? "Mailchimp Connection Required"
              : "Something went wrong!"}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {isConnectionError
              ? "Please connect your Mailchimp account to view this page. You can connect your account in Settings > Integrations."
              : "An unexpected error occurred while communicating with Mailchimp. Please try again."}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            {isConnectionError && (
              <a
                href="/settings/integrations"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Go to Settings
              </a>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
