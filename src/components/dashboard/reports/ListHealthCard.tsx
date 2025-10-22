"use client";

/**
 * List Health Card Component
 * Displays list health metrics including unsubscribes and abuse reports
 *
 * Issue #135: Campaign report detail UI components - List Health Card
 * Following established patterns from existing dashboard components
 */

import Link from "next/link";
import {
  BaseMetricCard,
  MetricRow,
} from "@/components/dashboard/reports/BaseMetricCard";
import { formatPercentageValue } from "@/utils/format-number";
import { Users } from "lucide-react";
import type { ListHealthCardProps } from "@/types/components/dashboard/reports";

export function ListHealthCard({
  unsubscribed,
  abuseReports,
  emailsSent,
  campaignId,
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
      {/* Unsubscribes with link */}
      {campaignId ? (
        <Link
          href={`/mailchimp/reports/${campaignId}/unsubscribes`}
          className="flex items-center justify-between hover:underline"
        >
          <span className="text-sm text-muted-foreground">Unsubscribes</span>
          <span className="font-medium">{unsubscribed.toLocaleString()}</span>
        </Link>
      ) : (
        <MetricRow label="Unsubscribes" value={unsubscribed} />
      )}

      {/* Abuse Reports with link */}
      {campaignId ? (
        <Link
          href={`/mailchimp/reports/${campaignId}/abuse-reports`}
          className="flex items-center justify-between hover:underline"
        >
          <span className="text-sm text-muted-foreground">Abuse Reports</span>
          <span
            className="font-medium"
            style={{ color: "var(--red-600, #dc2626)" }}
          >
            {abuseReports.toLocaleString()}
          </span>
        </Link>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Abuse Reports</span>
          <span
            className="font-medium"
            style={{ color: "var(--red-600, #dc2626)" }}
          >
            {abuseReports.toLocaleString()}
          </span>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Unsub rate: {formatPercentageValue(unsubRate)}%
      </div>
    </BaseMetricCard>
  );
}
