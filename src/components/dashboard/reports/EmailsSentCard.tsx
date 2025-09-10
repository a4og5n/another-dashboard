/**
 * Emails Sent Card Component
 * Displays the total number of emails sent in a campaign
 *
 * Issue #135: Campaign report detail UI components - Emails Sent Card
 * Following established patterns from existing dashboard components
 */

import { BaseMetricCard } from "@/components/dashboard/reports/BaseMetricCard";
import { Mail } from "lucide-react";
import type { EmailsSentCardProps } from "@/types/components/dashboard/reports";

export function EmailsSentCard({ emailsSent, className }: EmailsSentCardProps) {
  return (
    <BaseMetricCard
      icon={Mail}
      iconColor="var(--muted-foreground)"
      className={className}
      simpleCard={true}
      compact={true}
    >
      <div className="text-2xl font-bold">{emailsSent.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">Emails Sent</div>
    </BaseMetricCard>
  );
}
