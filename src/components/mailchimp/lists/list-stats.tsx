/**
 * List Stats Component
 * Displays Mailchimp lists statistics overview
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListStatsProps } from "@/types/components/mailchimp/list";
import { formatCompactNumber } from "@/utils/format-number";

export function ListStats({ stats, className }: ListStatsProps) {
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
          { value: formatCompactNumber(totalLists), label: "Total Lists" },
          { value: formatCompactNumber(totalMembers), label: "Total Members" },
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
