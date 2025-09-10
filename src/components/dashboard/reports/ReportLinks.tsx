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

export function ReportLinks({ report }: ReportLinksProps) {
  const hasShareReport = report.share_report?.share_url || false;
  const hasClicks = report.clicks.clicks_total > 0;

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
          {hasClicks && report.clicks.last_click && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Last click: {new Date(report.clicks.last_click).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Click Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MousePointer className="h-5 w-5" />
            <span>Link Click Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasClicks ? (
            <div className="text-center py-8 text-muted-foreground">
              <MousePointer className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No link clicks recorded for this campaign</p>
              <p className="text-sm mt-2">
                Once recipients click links in your campaign, detailed
                statistics will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-0.5">ℹ️</div>
                  <div>
                    <div className="font-medium text-blue-800 mb-1">
                      Individual Link Data
                    </div>
                    <div>
                      This report shows aggregate click statistics. For detailed
                      per-link click data, use Mailchimp&apos;s Click Details
                      report in your Mailchimp dashboard.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MousePointer className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Click Engagement
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {((report.clicks.click_rate || 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of recipients clicked at least one link
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Click-to-Open Rate
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {report.opens.unique_opens > 0
                      ? (
                          (report.clicks.unique_clicks /
                            report.opens.unique_opens) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of openers also clicked a link
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
