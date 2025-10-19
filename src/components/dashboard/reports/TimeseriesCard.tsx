"use client";

/**
 * Timeseries Card Component
 * Displays the campaign timeseries data in a line chart
 *
 * Issue #135: Campaign report detail UI components - Performance Over Time
 * Following established patterns from existing dashboard components
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { CampaignReport } from "@/types/mailchimp";
import {
  CustomChartTooltip,
  formatChartNumber,
} from "@/components/dashboard/helpers";

interface TimeseriesCardProps {
  report: CampaignReport;
  className?: string;
}

export function TimeseriesCard({ report, className }: TimeseriesCardProps) {
  const [showProxy, setShowProxy] = useState(false);

  // Check if timeseries data exists
  if (!report.timeseries || report.timeseries.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-bold">Campaign Performance</h2>
        <Card className={className}>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>
              No time series data available for this campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data to display
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Define the type for our formatted chart data
  type ChartDataItem = {
    date: string;
    opens: number;
    proxyOpens: number;
    clicks: number;
    sent: number;
    timestamp: string;
  };

  // Format data for chart
  const chartData: ChartDataItem[] = report.timeseries.map((item) => ({
    date: format(parseISO(item.timestamp), "h:mm a"),
    opens: item.unique_opens,
    proxyOpens: item.proxy_excluded_unique_opens,
    clicks: item.recipients_clicks,
    sent: item.emails_sent,
    // Store original timestamp for sorting
    timestamp: item.timestamp,
  }));

  // Sort data by timestamp
  chartData.sort(
    (a: ChartDataItem, b: ChartDataItem) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <>
      <h2 className="text-2xl font-bold">Campaign Performance</h2>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Over Time</CardTitle>
            <div className="flex items-center">
              <label className="text-sm text-muted-foreground mr-2">
                Show Proxy-Excluded
              </label>
              <input
                type="checkbox"
                checked={showProxy}
                onChange={() => setShowProxy(!showProxy)}
                className="form-checkbox h-4 w-4 text-primary"
              />
            </div>
          </div>
          <CardDescription>
            Campaign performance metrics tracked over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={
                    <CustomChartTooltip valueFormatter={formatChartNumber} />
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="sent"
                  name="Emails Sent"
                  stroke="#8884d8"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="opens"
                  name="Unique Opens"
                  stroke="#2da44e"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
                {showProxy && (
                  <Line
                    type="monotone"
                    dataKey="proxyOpens"
                    name="Proxy-Excluded Opens"
                    stroke="#d4a72c"
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="Recipient Clicks"
                  stroke="#0969da"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
