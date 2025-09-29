/**
 * Campaign Detail Error Page
 * Error boundary for the main campaign detail page
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface CampaignDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CampaignDetailError({
  error,
  reset,
}: CampaignDetailErrorProps) {
  useEffect(() => {
    console.error("Campaign detail error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <CardTitle>Failed to Load Campaign</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            There was an error loading the campaign details. Please try again.
          </p>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
