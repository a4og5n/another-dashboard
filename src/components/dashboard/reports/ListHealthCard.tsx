"use client";

/**
 * List Health Card Component
 * Displays list health metrics including unsubscribes and abuse reports
 *
 * Issue #135: Campaign report detail UI components - List Health Card
 * Following established patterns from existing dashboard components
 */

import {
  BaseMetricCard,
  MetricRow,
  formatPercentage,
} from "@/components/dashboard/reports/BaseMetricCard";
import { Users } from "lucide-react";
import type { ListHealthCardProps } from "@/types/components/dashboard/reports";

export function ListHealthCard({
  unsubscribed,
  abuseReports,
  emailsSent,
  className,
}: ListHealthCardProps) {
  // Calculate unsubscribe rate
  const unsubRate = emailsSent > 0 ? (unsubscribed / emailsSent) * 100 : 0;

  return (
    <BaseMetricCard
      title="List Health"
      icon={Users}
      iconColor="var(--blue-600, #2563eb)"
      className={className}
    >
      <MetricRow label="Unsubscribes" value={unsubscribed} />

      <MetricRow
        label="Abuse Reports"
        value={abuseReports}
        textColor="var(--red-600, #dc2626)"
      />

      <div className="text-xs text-muted-foreground">
        Unsub rate: {formatPercentage(unsubRate)}%
      </div>
    </BaseMetricCard>
  );
}
