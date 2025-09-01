import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceModel } from "@/dal/models/audience.model";
import type { AudienceCardProps } from "@/types/mailchimp/audience";

export function AudienceCard({
  audience,
  className,
}: Pick<AudienceCardProps, "audience" | "className">) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusBadge = (status: AudienceModel["sync_status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Synced
          </Badge>
        );
      case "syncing":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Syncing
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: AudienceModel["visibility"]) => {
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
    const engagementRate = audience.cached_stats?.engagement_rate;
    if (engagementRate === undefined) return null;

    const isPositive = engagementRate > 0.5;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";

    return (
      <div className={cn("flex items-center text-sm", colorClass)}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{(engagementRate * 100).toFixed(1)}%</span>
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
      aria-labelledby={`audience-${audience.id}-title`}
    >
      <CardHeader>
        <CardTitle
          id={`audience-${audience.id}-title`}
          className="flex items-start justify-between"
        >
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-lg truncate"
              title={audience.name}
            >
              {audience.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(audience.sync_status)}
              {getVisibilityBadge(audience.visibility)}
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
                {formatNumber(audience.stats.member_count)}
              </span>
              {getGrowthIndicator()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

AudienceCard.displayName = "AudienceCard";
