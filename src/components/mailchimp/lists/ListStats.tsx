import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceStatsProps } from "@/types/mailchimp/audience";

export function ListStats({ stats, className }: AudienceStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const totalMembers = stats.total_members;
  const totalLists = stats.total_audiences;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Lists
                </p>
                <p className="text-2xl font-bold">{formatNumber(totalLists)}</p>
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
              Across all lists
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Visibility
                </p>
                <div className="text-2xl font-bold">
                  <span className="text-blue-600">
                    {stats.audiences_by_visibility.pub}
                  </span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-gray-600">
                    {stats.audiences_by_visibility.prv}
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Public / Private
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

ListStats.displayName = "ListStats";
