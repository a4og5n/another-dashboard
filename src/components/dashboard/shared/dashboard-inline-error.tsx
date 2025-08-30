import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import React from "react";

interface DashboardInlineErrorProps {
  error: string;
}

/**
 * DashboardInlineError
 * Displays a styled inline error message for dashboard sections.
 * Follows PRD guidelines for clarity, accessibility, and visual feedback.
 */
export function DashboardInlineError({ error }: DashboardInlineErrorProps) {
  if (!error) return null;
  return (
    <Card
      className="border-yellow-200 bg-yellow-50"
      role="alert"
      aria-live="assertive"
    >
      <CardContent className="flex items-center space-x-3 pt-6">
        <AlertCircle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
        <p className="text-yellow-800">{error}</p>
      </CardContent>
    </Card>
  );
}
