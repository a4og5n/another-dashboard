import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { List } from "@/types/mailchimp";

interface ListCardProps {
  list: List;
  className?: string;
}

export function ListCard({ list, className }: ListCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getVisibilityBadge = (visibility: "pub" | "prv") => {
    return visibility === "pub" ? (
      <Badge variant="outline" className="text-xs">
        Public
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Private
      </Badge>
    );
  };

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
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200",
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
                {formatNumber(list.stats?.member_count || 0)}
              </span>
              {getGrowthIndicator()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

ListCard.displayName = "ListCard";
