"use client";

/**
 * Error boundary for Campaign Send Checklist page
 * Catches unexpected errors and displays a recovery UI
 */

import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export default function SendChecklistError({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  return <DashboardInlineError error={error.message} />;
}
