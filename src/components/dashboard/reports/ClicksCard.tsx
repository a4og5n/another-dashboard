"use client";

/**
 * Campaign Report Clicks Card Component
 * Displays email click statistics
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ClicksCardProps } from "@/types/components/dashboard/reports";

export function ClicksCard({ clicks }: ClicksCardProps) {
  // Format last click date as a relative time (e.g., "2 days ago")
  const lastClickDate = new Date(clicks.last_click);
  const lastClickRelative = formatDistanceToNow(lastClickDate, {
    addSuffix: true,
  });

  // Calculate percentage of unique clicks vs total clicks
  const uniqueClickPercentage =
    clicks.clicks_total > 0
      ? ((clicks.unique_clicks / clicks.clicks_total) * 100).toFixed(1)
      : "0.0";

  return (
    <StatsGridCard
      title="Email Clicks"
      icon={MousePointer}
      iconColor="text-green-500"
      stats={[
        {
          value: clicks.clicks_total.toLocaleString(),
          label: "Total Clicks",
        },
        {
          value: clicks.unique_clicks.toLocaleString(),
          label: "Unique Clicks",
        },
        {
          value: `${(clicks.click_rate * 100).toFixed(1)}%`,
          label: "Click Rate",
        },
      ]}
      columns={3}
      footer={
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {uniqueClickPercentage}% of clicks were unique
            </span>
            <span className="text-sm font-medium">
              {clicks.unique_subscriber_clicks.toLocaleString()} subscribers
              clicked
            </span>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            Last clicked {lastClickRelative}
          </div>
        </div>
      }
    />
  );
}
