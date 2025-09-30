/**
 * Share Report Component
 * Displays information about a campaign's shared report link
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2, Lock, Globe } from "lucide-react";
import type { CampaignReport } from "@/types/mailchimp";

interface ShareReportProps {
  report: CampaignReport;
}

export function ShareReport({ report }: ShareReportProps) {
  const hasShareReport = report.share_report?.share_url || false;

  if (!hasShareReport) {
    return null;
  }

  return (
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
              <Badge variant="outline" className="flex items-center space-x-1">
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
  );
}
