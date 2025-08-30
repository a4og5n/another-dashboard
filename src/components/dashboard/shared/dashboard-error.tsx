import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="w-full max-w-md mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <RefreshCw className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">
            Dashboard Error
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={onRetry}
              variant="default"
              className="flex-1 gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Button>
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
