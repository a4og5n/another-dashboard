import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { List } from "@/types/mailchimp";
import { getVisibilityBadge } from "@/components/ui/helpers/badge-utils";
import { formatCompactNumber } from "@/utils/format-number";

interface ListCardProps {
  list: List;
  className?: string;
}

export function ListCard({ list, className }: ListCardProps) {
  const getGrowthIndicator = () => {
    const openRate = list.stats?.open_rate;
    if (openRate === undefined) return null;

    const isPositive = openRate > 20; // 20% open rate as threshold
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";

    return (
      <div className={cn("flex items-center text-sm", colorClass)}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{openRate.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <Link href={`/mailchimp/lists/${list.id}`} className="block">
      <Card
        className={cn(
          "hover:shadow-md transition-shadow duration-200 cursor-pointer",
          className,
        )}
        role="article"
        aria-labelledby={`list-${list.id}-title`}
      >
        <CardHeader>
          <CardTitle
            id={`list-${list.id}-title`}
            className="flex items-start justify-between"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate" title={list.name}>
                {list.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getVisibilityBadge(list.visibility)}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Member Statistics */}
            <div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>Total Members</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCompactNumber(list.stats?.member_count || 0)}
                </span>
                {getGrowthIndicator()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

ListCard.displayName = "ListCard";
