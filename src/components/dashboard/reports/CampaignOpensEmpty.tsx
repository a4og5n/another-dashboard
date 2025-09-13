/**
 * Campaign Opens Empty Component
 * Empty state component for when campaign opens data is not available
 *
 * Issue #135: Campaign opens empty state component
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CampaignOpensEmptyProps {
  /** Campaign ID for navigation links */
  campaignId: string;
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
  /** Optional retry handler */
  onRetry?: () => void;
}

export function CampaignOpensEmpty({
  campaignId,
  title,
  message,
  onRetry,
}: CampaignOpensEmptyProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {/* Icon */}
        <div className="rounded-full bg-muted p-3 mb-4">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">
          {title || "No Opens Data Available"}
        </h3>

        {/* Message */}
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message ||
            "There's no opens data available for this campaign. This could mean the campaign hasn't been opened yet, or there might be an issue loading the data."}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <Link href={`/mailchimp/campaigns/${campaignId}/report`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/mailchimp/campaigns">View All Campaigns</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
