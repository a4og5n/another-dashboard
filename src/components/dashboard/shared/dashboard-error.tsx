/**
 * Dashboard Error Component
 * Generic error state for dashboard pages
 */

import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import React from "react";

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
  onGoHome: () => void;
  isRefreshing?: boolean;
}

export function DashboardError({
  error,
  onRetry,
  onGoHome,
  isRefreshing,
}: DashboardErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <EmptyStateCard
        icon={RefreshCw}
        variant="error"
        title="Dashboard Error"
        message={error}
        className="w-full max-w-md mx-4"
        actions={
          <>
            <Button
              onClick={onRetry}
              variant="default"
              className="gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Button>
            <Button onClick={onGoHome} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Button>
          </>
        }
      />
    </div>
  );
}
