/**
 * Campaign Abuse Reports Empty Component
 * Empty state component for when campaign has no abuse/spam complaints
 *
 * Shows positive messaging when no abuse reports are found, as this is good news
 * for the campaign's reputation.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CampaignAbuseReportsEmptyProps {
  /** Campaign ID for navigation links */
  campaignId: string;
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
}

export function CampaignAbuseReportsEmpty({
  campaignId,
  title,
  message,
}: CampaignAbuseReportsEmptyProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {/* Icon - ShieldCheck for positive messaging */}
        <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
          <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">
          {title || "No Abuse Reports"}
        </h3>

        {/* Message - Positive tone */}
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message ||
            "Great news! This campaign has no spam complaints. Your subscribers are engaging positively with your content."}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
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
