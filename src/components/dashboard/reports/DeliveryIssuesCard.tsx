"use client";

/**
 * Delivery Issues Card Component
 * Displays bounce statistics for email campaigns
 *
 * Issue #135: Campaign report detail UI components - Delivery Issues Card
 * Following established patterns from existing dashboard components
 */

import {
  BaseMetricCard,
  MetricRow,
  formatPercentage,
} from "@/components/dashboard/reports/BaseMetricCard";
import { AlertTriangle } from "lucide-react";
import type { DeliveryIssuesCardProps } from "@/types/components/dashboard/reports";

export function DeliveryIssuesCard({
  bounces,
  totalEmails,
  className,
}: DeliveryIssuesCardProps) {
  // Calculate total bounce rate
  const totalBounces =
    bounces.hard_bounces + bounces.soft_bounces + bounces.syntax_errors;
  const bounceRate = totalEmails > 0 ? (totalBounces / totalEmails) * 100 : 0;

  return (
    <BaseMetricCard
      title="Delivery Issues"
      icon={AlertTriangle}
      iconColor="var(--yellow-600, #ca8a04)"
      className={className}
    >
      <MetricRow
        label="Hard Bounces"
        value={bounces.hard_bounces}
        textColor="var(--red-600, #dc2626)"
      />

      <MetricRow
        label="Soft Bounces"
        value={bounces.soft_bounces}
        textColor="var(--yellow-600, #ca8a04)"
      />

      <MetricRow
        label="Syntax Errors"
        value={bounces.syntax_errors}
        textColor="var(--orange-500, #f97316)"
      />

      <div className="text-xs text-muted-foreground">
        Total bounce rate: {formatPercentage(bounceRate)}%
      </div>
    </BaseMetricCard>
  );
}
