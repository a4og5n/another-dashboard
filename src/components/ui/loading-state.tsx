import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MailchimpDashboardSkeleton } from "@/skeletons";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  type: "loading" | "error" | "empty" | "network-error";
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showSkeleton?: boolean;
}

export function LoadingState({
  type,
  title,
  message,
  onRetry,
  retryLabel = "Try again",
  showSkeleton = true,
}: LoadingStateProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (type === "loading") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    } else {
      // Reset dots when not loading to prevent stale state
      setDots("");
    }
    // Return undefined for non-loading cases (no cleanup needed)
    return undefined;
  }, [type]); // Keep dependency on type for proper cleanup

  if (type === "loading") {
    return (
      <div className="space-y-6">
        {showSkeleton ? (
          <MailchimpDashboardSkeleton />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {title || `Loading dashboard data${dots}`}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {message ||
                  "Fetching the latest data from your Mailchimp account..."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (type === "error") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <WifiOff className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {title || "Something went wrong"}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {message ||
              "We encountered an error while loading your dashboard data. Please try again."}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "network-error") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 mb-4">
            <Wifi className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {title || "Connection issue"}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {message ||
              "Unable to connect to Mailchimp API. Please check your internet connection and API configuration."}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "empty") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {title || "No data available"}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {message ||
              "There's no data to display right now. Try refreshing or check your Mailchimp account."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}

interface ProgressiveLoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  hasError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingTitle?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

export function ProgressiveLoading({
  children,
  isLoading,
  hasError = false,
  isEmpty = false,
  onRetry,
  loadingTitle,
  loadingMessage,
  errorTitle,
  errorMessage,
}: ProgressiveLoadingProps) {
  if (isLoading) {
    return (
      <LoadingState
        type="loading"
        title={loadingTitle}
        message={loadingMessage}
        showSkeleton={true}
      />
    );
  }

  if (hasError) {
    return (
      <LoadingState
        type="error"
        title={errorTitle}
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <LoadingState
        type="empty"
        title="No data to display"
        message="Your dashboard will appear here once data is available."
      />
    );
  }

  return <>{children}</>;
}
