"use client";

/**
 * Industry Statistics Card Component
 * Displays campaign performance compared to industry averages
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart2, TrendingUp, TrendingDown } from "lucide-react";

interface IndustryStatsCardProps {
  industryStats: {
    type: string;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unopen_rate: number;
    unsub_rate: number;
    abuse_rate: number;
  };
  campaignStats: {
    open_rate: number;
    click_rate: number;
  };
}

export function IndustryStatsCard({
  industryStats,
  campaignStats,
}: IndustryStatsCardProps) {
  // Format percentage values for display
  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(1);
  };

  // Compare campaign stats with industry average
  const getComparisonIcon = (campaignValue: number, industryValue: number) => {
    if (campaignValue > industryValue) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (campaignValue < industryValue) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  // Get performance badge based on comparison
  const getPerformanceBadge = (
    campaignValue: number,
    industryValue: number,
  ) => {
    const ratio = campaignValue / industryValue;

    if (ratio >= 1.5) {
      return <Badge className="bg-green-600">Excellent</Badge>;
    } else if (ratio >= 1.1) {
      return <Badge className="bg-blue-600">Above Average</Badge>;
    } else if (ratio >= 0.9) {
      return <Badge variant="secondary">Average</Badge>;
    } else {
      return (
        <Badge variant="outline" className="border-red-600 text-red-600">
          Below Average
        </Badge>
      );
    }
  };

  // Calculate the percentage difference between campaign and industry values
  const getPercentageDifference = (
    campaignValue: number,
    industryValue: number,
  ): string => {
    if (industryValue === 0) return "N/A";

    const difference = ((campaignValue - industryValue) / industryValue) * 100;
    const sign = difference >= 0 ? "+" : "";
    return `${sign}${difference.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <BarChart2 className="h-4 w-4 text-purple-500" />
          <span>Industry Comparison</span>
          <Badge variant="outline" className="ml-2">
            {industryStats.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Open Rate</span>
              {getComparisonIcon(
                campaignStats.open_rate,
                industryStats.open_rate,
              )}
            </div>
            <div className="flex items-center space-x-2">
              {getPerformanceBadge(
                campaignStats.open_rate,
                industryStats.open_rate,
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="col-span-2">
              <Progress
                value={campaignStats.open_rate * 100}
                className="h-2 bg-slate-200"
              />
            </div>
            <div className="text-right text-sm">
              <span className="font-medium">
                {formatPercentage(campaignStats.open_rate)}%
              </span>
              <span className="text-muted-foreground text-xs ml-1">
                vs {formatPercentage(industryStats.open_rate)}%
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-right">
            {getPercentageDifference(
              campaignStats.open_rate,
              industryStats.open_rate,
            )}{" "}
            difference from industry average
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Click Rate</span>
              {getComparisonIcon(
                campaignStats.click_rate,
                industryStats.click_rate,
              )}
            </div>
            <div className="flex items-center space-x-2">
              {getPerformanceBadge(
                campaignStats.click_rate,
                industryStats.click_rate,
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="col-span-2">
              <Progress
                value={campaignStats.click_rate * 100}
                className="h-2 bg-slate-200"
              />
            </div>
            <div className="text-right text-sm">
              <span className="font-medium">
                {formatPercentage(campaignStats.click_rate)}%
              </span>
              <span className="text-muted-foreground text-xs ml-1">
                vs {formatPercentage(industryStats.click_rate)}%
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-right">
            {getPercentageDifference(
              campaignStats.click_rate,
              industryStats.click_rate,
            )}{" "}
            difference from industry average
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-center text-muted-foreground">
            Industry averages for{" "}
            <span className="font-medium">{industryStats.type}</span> campaigns:
            <div className="flex justify-between mt-1">
              <span>
                Bounce: {formatPercentage(industryStats.bounce_rate)}%
              </span>
              <span>Unsub: {formatPercentage(industryStats.unsub_rate)}%</span>
              <span>Abuse: {formatPercentage(industryStats.abuse_rate)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
