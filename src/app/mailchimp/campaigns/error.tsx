"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Campaigns page error:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground max-w-md">
            An unexpected error occurred while loading the campaigns page.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
