/**
 * Link Click Information Component
 * Displays details about link clicks in a campaign
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, TrendingUp } from "lucide-react";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface LinkClickInfoProps {
  report: MailchimpCampaignReport;
}

export function LinkClickInfo({ report }: LinkClickInfoProps) {
  const hasClicks = report.clicks.clicks_total > 0;

  return (
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
              Once recipients click links in your campaign, detailed statistics
              will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Click Engagement</span>
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
  );
}
