/**
 * List Performance Comparison Card Component
 * Displays list performance metrics compared to campaign metrics
 *
 * Issue #135: Campaign report detail UI components - List Performance Card
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ListPerformanceCardProps {
  listStats: {
    open_rate: number;
    click_rate: number;
    sub_rate: number;
    unsub_rate: number;
    proxy_excluded_open_rate?: number;
  };
  className?: string;
}

/**
 * Formats percentage for display
 */
function formatPercentage(value: number): string {
  return (value * 100).toFixed(1);
}

export function ListPerformanceCard({
  listStats,
  className,
}: ListPerformanceCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">List Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* First row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Average Open Rate</span>
                <span>{formatPercentage(listStats.open_rate / 100)}%</span>
              </div>
              <Progress value={listStats.open_rate} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Average Click Rate</span>
                <span>{formatPercentage(listStats.click_rate / 100)}%</span>
              </div>
              <Progress value={listStats.click_rate} className="h-2" />
            </div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Subscription Rate</span>
                <span>{Math.round(listStats.sub_rate)}</span>
              </div>
              <Progress value={listStats.sub_rate} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Unsubscribe Rate</span>
                <span>{Math.round(listStats.unsub_rate)}</span>
              </div>
              <Progress value={listStats.unsub_rate} className="h-2" />
            </div>
          </div>

          {/* Third row (conditional) */}
          {listStats.proxy_excluded_open_rate !== undefined && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Proxy Excluded Open Rate</span>
                <span>
                  {formatPercentage(listStats.proxy_excluded_open_rate / 100)}%
                </span>
              </div>
              <Progress
                value={listStats.proxy_excluded_open_rate}
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
