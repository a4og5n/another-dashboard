/**
 * Campaign Report Links Component
 * Displays clicked links table and share report information
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  Share2,
  Lock,
  Globe,
  MousePointer,
  TrendingUp,
} from "lucide-react";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface ReportLinksProps {
  report: MailchimpCampaignReport;
}

/**
 * Gets domain from URL for display
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Formats URL for display (truncate if too long)
 */
function formatUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}

/**
 * Mock data for clicked links (since the API doesn't return this in the basic report)
 * In a real implementation, this would come from a separate endpoint
 */
function generateMockLinkData(report: MailchimpCampaignReport) {
  const totalClicks = report.clicks.clicks_total;
  if (totalClicks === 0) return [];

  // Generate some realistic mock data based on the actual click counts
  const mockLinks = [
    {
      url: "https://example.com/product-page",
      clicks: Math.floor(totalClicks * 0.4),
      uniqueClicks: Math.floor(report.clicks.unique_clicks * 0.35),
    },
    {
      url: "https://example.com/blog/latest-article",
      clicks: Math.floor(totalClicks * 0.25),
      uniqueClicks: Math.floor(report.clicks.unique_clicks * 0.22),
    },
    {
      url: "https://example.com/contact-us",
      clicks: Math.floor(totalClicks * 0.15),
      uniqueClicks: Math.floor(report.clicks.unique_clicks * 0.18),
    },
    {
      url: "https://example.com/social-media",
      clicks: Math.floor(totalClicks * 0.12),
      uniqueClicks: Math.floor(report.clicks.unique_clicks * 0.15),
    },
    {
      url: "https://example.com/newsletter-archive",
      clicks: Math.floor(totalClicks * 0.08),
      uniqueClicks: Math.floor(report.clicks.unique_clicks * 0.1),
    },
  ].filter((link) => link.clicks > 0);

  return mockLinks;
}

export function ReportLinks({ report }: ReportLinksProps) {
  const mockLinks = generateMockLinkData(report);
  const hasShareReport = report.share_report?.share_url || false;

  return (
    <div className="space-y-6">
      {/* Share Report */}
      {hasShareReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Public Report Link</div>
                  <div className="text-sm text-muted-foreground">
                    Share this campaign&apos;s performance with others
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {report.share_report.share_password && (
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Password Protected</span>
                  </Badge>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={report.share_report.share_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1"
                  >
                    <span>View Report</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
            {report.share_report.share_password && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Password: {report.share_report.share_password}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Click Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Click Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {report.clicks.clicks_total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {report.clicks.unique_clicks.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Unique Clicks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {report.clicks.unique_subscriber_clicks.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Subscriber Clicks
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Last click: {new Date(report.clicks.last_click).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Most Clicked Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MousePointer className="h-5 w-5" />
            <span>Most Clicked Links</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MousePointer className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No link clicks recorded for this campaign</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <strong>Note:</strong> This is example data. In a production
                environment, link click data would be fetched from the Mailchimp
                API&apos;s link tracking endpoints.
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-right">Total Clicks</TableHead>
                    <TableHead className="text-right">Unique Clicks</TableHead>
                    <TableHead className="text-right">Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLinks.map((link, index) => {
                    const clickRate =
                      report.emails_sent > 0
                        ? (link.uniqueClicks / report.emails_sent) * 100
                        : 0;

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {formatUrl(link.url)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getDomain(link.url)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {link.clicks.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">
                            {link.uniqueClicks.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {clickRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
