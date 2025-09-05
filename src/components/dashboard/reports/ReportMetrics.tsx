/**
 * Campaign Report Metrics Component
 * Displays detailed performance metrics with progress bars and comparisons
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Mail,
  MousePointer,
  Share2,
  AlertTriangle,
  Users,
  Heart,
} from "lucide-react";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface ReportMetricsProps {
  report: MailchimpCampaignReport;
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

export function ReportMetrics({ report }: ReportMetricsProps) {
  const openRate = report.opens.open_rate;
  const clickRate = report.clicks.click_rate;
  const industryOpenRate = report.industry_stats.open_rate;
  const industryClickRate = report.industry_stats.click_rate;
  const bounceRate =
    (report.bounces.hard_bounces + report.bounces.soft_bounces) /
    report.emails_sent;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
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
                  {report.opens.unique_opens.toLocaleString()} unique opens from{" "}
                  {report.emails_sent.toLocaleString()} sent
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
                  {report.clicks.unique_clicks.toLocaleString()} unique clicks
                  from {report.opens.unique_opens.toLocaleString()} opens
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-purple-600" />
              <span>Social Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Forwards</span>
              <span className="font-medium">
                {report.forwards.forwards_count.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Facebook Likes
              </span>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="font-medium">
                  {report.facebook_likes.facebook_likes.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Delivery Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Hard Bounces
              </span>
              <span className="font-medium text-red-600">
                {report.bounces.hard_bounces.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Soft Bounces
              </span>
              <span className="font-medium text-yellow-600">
                {report.bounces.soft_bounces.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total bounce rate: {formatPercentage(bounceRate)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>List Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Unsubscribes
              </span>
              <span className="font-medium">
                {report.unsubscribed.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Abuse Reports
              </span>
              <span className="font-medium text-red-600">
                {report.abuse_reports.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Unsub rate:{" "}
              {formatPercentage(report.unsubscribed / report.emails_sent)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            List Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Average Open Rate</span>
                <span>
                  {formatPercentage(report.list_stats.open_rate / 100)}%
                </span>
              </div>
              <Progress value={report.list_stats.open_rate} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>List Average Click Rate</span>
                <span>
                  {formatPercentage(report.list_stats.click_rate / 100)}%
                </span>
              </div>
              <Progress value={report.list_stats.click_rate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
