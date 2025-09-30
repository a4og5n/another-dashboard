/**
 * Campaign Report Charts Component
 * Displays time-series data visualizations for campaign performance
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Clock } from "lucide-react";
import type { CampaignReport } from "@/types/mailchimp";
import type {
  ReportTimeseries,
  ReportTimewarp,
} from "@/types/mailchimp/reports";

interface ReportChartsProps {
  report: CampaignReport;
}

// Helper functions moved to when they're needed

export function ReportCharts({ report }: ReportChartsProps) {
  // Prepare timeseries data for line chart using the proper type
  const timeseriesData: ReportTimeseries = report.timeseries || [];

  // Prepare timewarp data for bar chart using the proper type
  const timewarpData: ReportTimewarp = report.timewarp || [];

  return (
    <div className="space-y-6">
      {/* Performance Over Time */}
      {timeseriesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Rate (%)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(value, payload) => {
                      const point = payload?.[0]?.payload;
                      return point
                        ? new Date(point.fullDate).toLocaleDateString()
                        : value;
                    }}
                    formatter={(value, name) => {
                      if (name?.toString().includes("Rate")) {
                        return [`${Number(value).toFixed(1)}%`, name];
                      }
                      return [Number(value).toLocaleString(), name];
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="opens"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Opens"
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Clicks"
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="openRate"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Open Rate"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Opens</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Clicks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-yellow-500" />
                <span>Open Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timezone Performance */}
        {timewarpData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Performance by Timezone</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timewarpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timezone"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, name) => [
                        Number(value).toLocaleString(),
                        name
                          ?.toString()
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase()),
                      ]}
                    />
                    <Bar
                      dataKey="uniqueOpens"
                      fill="#3b82f6"
                      name="Unique Opens"
                    />
                    <Bar
                      dataKey="uniqueClicks"
                      fill="#10b981"
                      name="Unique Clicks"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
