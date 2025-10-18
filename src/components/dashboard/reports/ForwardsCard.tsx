/**
 * Campaign Report Forwards Card Component
 * Displays email forwarding statistics
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share } from "lucide-react";
import type { ForwardsCardProps } from "@/types/components/dashboard/reports";

export function ForwardsCard({ forwards }: ForwardsCardProps) {
  // Calculate engagement rate from forwards (if any)
  const engagementRate =
    forwards.forwards_count > 0
      ? ((forwards.forwards_opens / forwards.forwards_count) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Forwards"
      icon={Share}
      iconColor="text-blue-500"
      stats={[
        {
          value: forwards.forwards_count.toLocaleString(),
          label: "Total Forwards",
        },
        {
          value: forwards.forwards_opens.toLocaleString(),
          label: "Opens from Forwards",
        },
      ]}
      columns={2}
      footer={
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{engagementRate}%</span> of forwarded
          emails were opened
        </p>
      }
    />
  );
}
