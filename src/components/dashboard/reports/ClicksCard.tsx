"use client";

/**
 * Campaign Report Clicks Card Component
 * Displays email click statistics
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <MousePointer className="h-4 w-4 text-green-500" />
          <span>Email Clicks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold">
              {clicks.clicks_total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {clicks.unique_clicks.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Unique Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(clicks.click_rate * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Click Rate</p>
          </div>
        </div>

        <div className="pt-2 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
}
