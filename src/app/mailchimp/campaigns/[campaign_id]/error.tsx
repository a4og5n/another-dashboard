"use client";

import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";

export default function CampaignDetailError({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  return <DashboardInlineError error={error.message} />;
}
