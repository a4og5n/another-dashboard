/**
 * Campaign Report Charts Component
 * Displays time-series data visualizations for campaign performance
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
} from "lucide-react";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface ReportChartsProps {
  report: MailchimpCampaignReport;
}

// Helper functions moved to when they're needed

/**
 * Colors for pie chart segments
 */
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function ReportCharts({ report }: ReportChartsProps) {
  // Prepare timeseries data for line chart (empty for now since service returns Record<string, unknown>)
  const timeseriesData: unknown[] = []; // TODO: Update when service returns proper typed data

  // Prepare timewarp data for bar chart (empty for now since service returns Record<string, unknown>)
  const timewarpData: unknown[] = []; // TODO: Update when service returns proper typed data

  // Prepare engagement breakdown for pie chart
  const engagementData = [
    {
      name: "Unique Opens",
      value: report.opens.unique_opens,
      color: COLORS[0],
    },
    {
      name: "Unique Clicks",
      value: report.clicks.unique_clicks,
      color: COLORS[1],
    },
    {
      name: "Forwards",
      value: report.forwards.forwards_count,
      color: COLORS[2],
    },
    { name: "Unsubscribes", value: report.unsubscribed, color: COLORS[3] },
    {
      name: "Hard Bounces",
      value: report.bounces.hard_bounces,
      color: COLORS[4],
    },
  ].filter((item) => item.value > 0);

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

        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Engagement Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                    }
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Count",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {report.opens.opens_total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Opens</div>
              <Badge variant="outline" className="mt-1">
                {report.opens.unique_opens.toLocaleString()} unique
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {report.clicks.clicks_total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
              <Badge variant="outline" className="mt-1">
                {report.clicks.unique_clicks.toLocaleString()} unique
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {report.forwards.forwards_count.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Forwards</div>
              <Badge variant="outline" className="mt-1">
                {report.forwards.forwards_opens.toLocaleString()} opens
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {report.facebook_likes.facebook_likes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Facebook Likes
              </div>
              <Badge variant="outline" className="mt-1">
                {report.facebook_likes.unique_likes.toLocaleString()} unique
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
