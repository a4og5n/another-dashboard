import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceStats } from "@/dal/models/audience.model";
import type { AudienceStatsProps } from "@/types/mailchimp/audience";


export function AudienceStats({
  stats,
  loading = false,
  className,
}: AudienceStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalMembers = stats.total_members;
  const totalAudiences = stats.total_audiences;
  const avgMemberCount = stats.avg_member_count;
  const engagementRate = stats.avg_engagement_rate;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Audiences
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(totalAudiences)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active email lists
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Members
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(totalMembers)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all audiences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Audience Size
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(Math.round(avgMemberCount))}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Members per audience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Engagement Rate
                </p>
                <p className="text-2xl font-bold">
                  {formatPercentage(engagementRate)}
                </p>
              </div>
              <Activity
                className={cn(
                  "h-8 w-8",
                  engagementRate > 0.3
                    ? "text-green-600"
                    : engagementRate > 0.15
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average across audiences
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_status.completed)}
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_status.completed /
                            totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Syncing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_status.syncing)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_status.syncing / totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_status.pending)}
                  </span>
                  <Badge variant="outline">
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_status.pending / totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_status.failed)}
                  </span>
                  <Badge variant="destructive">
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_status.failed / totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              {/* Progress bar for sync completion */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Sync Completion
                  </span>
                  <span className="text-sm font-medium">
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_status.completed /
                            totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    totalAudiences > 0
                      ? (stats.audiences_by_status.completed / totalAudiences) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Public</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_visibility.pub)}
                  </span>
                  <Badge variant="outline">
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_visibility.pub / totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatNumber(stats.audiences_by_visibility.prv)}
                  </span>
                  <Badge variant="secondary">
                    {totalAudiences > 0
                      ? Math.round(
                          (stats.audiences_by_visibility.prv / totalAudiences) *
                            100,
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>

              {/* Visual representation */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.audiences_by_visibility.pub}
                    </div>
                    <div className="text-xs text-blue-600">Public</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {stats.audiences_by_visibility.prv}
                    </div>
                    <div className="text-xs text-gray-600">Private</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatDate(stats.last_updated)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>{totalAudiences}</span>
                <span>total audiences</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{formatNumber(totalMembers)}</span>
                <span>total members</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

AudienceStats.displayName = "AudienceStats";
