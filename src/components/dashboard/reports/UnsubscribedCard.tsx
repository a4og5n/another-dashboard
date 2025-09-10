/**
 * Unsubscribed Card Component
 * Displays the number of unsubscribes and abuse reports for a campaign
 *
 * Issue #135: Campaign report detail UI components - Unsubscribed Card
 * Following established patterns from existing dashboard components
 */

import { BaseMetricCard } from "@/components/dashboard/reports/BaseMetricCard";
import { UserMinus } from "lucide-react";
import type { UnsubscribedCardProps } from "@/types/components/dashboard/reports";

export function UnsubscribedCard({
  unsubscribed,
  abuseReports,
  className,
}: UnsubscribedCardProps) {
  return (
    <BaseMetricCard
      icon={UserMinus}
      iconColor="var(--red-600, #dc2626)"
      className={className}
      simpleCard={true}
      compact={true}
    >
      <div className="text-2xl font-bold text-red-600">
        {unsubscribed.toLocaleString()}
      </div>
      <div className="text-xs text-muted-foreground">Unsubscribed</div>
      {abuseReports > 0 && (
        <div className="text-xs text-red-600 mt-1">
          {abuseReports} abuse reports
        </div>
      )}
    </BaseMetricCard>
  );
}
