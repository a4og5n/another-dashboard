/**
 * List Stats Component
 * Displays Mailchimp lists statistics overview
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListStatsProps } from "@/types/components/mailchimp/list";

export function ListStats({ stats, className }: ListStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const totalMembers = stats.total_members;
  const totalLists = stats.total_audiences;
  const publicLists = stats.audiences_by_visibility.pub;
  const privateLists = stats.audiences_by_visibility.prv;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <StatsGridCard
        title="List Statistics"
        icon={Users}
        iconColor="text-blue-500"
        stats={[
          { value: formatNumber(totalLists), label: "Total Lists" },
          { value: formatNumber(totalMembers), label: "Total Members" },
          {
            value: `${publicLists} / ${privateLists}`,
            label: "Visibility (Pub/Prv)",
          },
        ]}
        columns={3}
      />
    </div>
  );
}

ListStats.displayName = "ListStats";
