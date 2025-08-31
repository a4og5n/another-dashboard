import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Edit,
  Archive,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceModel } from "@/dal/models/audience.model";
import type { AudienceCardProps } from "@/types/mailchimp/audience";


export function AudienceCard({
  audience,
  onEdit,
  onArchive,
  onViewStats,
  className,
}: AudienceCardProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

        <CardAction>
          <div className="flex items-center gap-1">
            {onViewStats && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewStats(audience.id)}
                aria-label={`View statistics for ${audience.name}`}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(audience.id)}
                aria-label={`Edit ${audience.name}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onArchive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(audience.id)}
                aria-label={`Archive ${audience.name}`}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Member Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
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

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">List Rating</div>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={cn(
                        "text-lg",
                        star <= audience.list_rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                      )}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {audience.list_rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {formatNumber(audience.stats.unsubscribe_count)}
              </div>
              <div className="text-xs text-muted-foreground">Unsubscribed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {formatNumber(audience.stats.cleaned_count)}
              </div>
              <div className="text-xs text-muted-foreground">Cleaned</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              <div className="truncate" title={audience.contact.company}>
                {audience.contact.company}
              </div>
              <div className="truncate">
                {audience.contact.city}, {audience.contact.state}
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Created: {formatDate(audience.date_created)}
              {audience.last_synced_at && (
                <> • Last synced: {formatDate(audience.last_synced_at)}</>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

AudienceCard.displayName = "AudienceCard";
