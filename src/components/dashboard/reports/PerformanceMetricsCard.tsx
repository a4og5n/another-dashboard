/**
 * Performance Metrics Card Component
 * Displays open rate and click rate metrics with industry comparisons
 *
 * Issue #135: Campaign report detail UI components - Performance Metrics Card
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Mail, MousePointer } from "lucide-react";

interface PerformanceMetricsCardProps {
  opens: {
    open_rate: number;
    unique_opens: number;
  };
  clicks: {
    click_rate: number;
    unique_clicks: number;
  };
  industryStats: {
    open_rate: number;
    click_rate: number;
  };
  emailsSent: number;
  className?: string;
}

/**
 * Formats percentage for display
 */
function formatPercentage(value: number): string {
  return (value * 100).toFixed(1);
}

/**
 * Gets trend icon based on comparison with industry stats
 */
function getTrendIcon(actualRate: number, industryRate: number) {
  if (actualRate > industryRate) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (actualRate < industryRate) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return null;
}

/**
 * Gets performance badge based on comparison with industry stats
 */
function getPerformanceBadge(actualRate: number, industryRate: number) {
  const ratio = actualRate / industryRate;
  if (ratio >= 1.2) {
    return (
      <Badge variant="default" className="bg-green-600">
        Excellent
      </Badge>
    );
  } else if (ratio >= 1.0) {
    return (
      <Badge variant="default" className="bg-blue-600">
        Above Average
      </Badge>
    );
  } else if (ratio >= 0.8) {
    return <Badge variant="secondary">Average</Badge>;
  } else {
    return (
      <Badge variant="outline" className="border-red-600 text-red-600">
        Below Average
      </Badge>
    );
  }
}

export function PerformanceMetricsCard({
  opens,
  clicks,
  industryStats,
  emailsSent,
  className,
}: PerformanceMetricsCardProps) {
  const openRate = opens.open_rate;
  const clickRate = clicks.click_rate;
  const industryOpenRate = industryStats.open_rate;
  const industryClickRate = industryStats.click_rate;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Performance Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Open Rate</span>
                {getTrendIcon(openRate, industryOpenRate)}
              </div>
              {getPerformanceBadge(openRate, industryOpenRate)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your rate: {formatPercentage(openRate)}%</span>
                <span className="text-muted-foreground">
                  Industry avg: {formatPercentage(industryOpenRate)}%
                </span>
              </div>
              <Progress value={openRate * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {opens.unique_opens.toLocaleString()} unique opens from{" "}
                {emailsSent.toLocaleString()} sent
              </div>
            </div>
          </div>

          {/* Click Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Click Rate</span>
                {getTrendIcon(clickRate, industryClickRate)}
              </div>
              {getPerformanceBadge(clickRate, industryClickRate)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your rate: {formatPercentage(clickRate)}%</span>
                <span className="text-muted-foreground">
                  Industry avg: {formatPercentage(industryClickRate)}%
                </span>
              </div>
              <Progress value={clickRate * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {clicks.unique_clicks.toLocaleString()} unique clicks from{" "}
                {opens.unique_opens.toLocaleString()} opens
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
