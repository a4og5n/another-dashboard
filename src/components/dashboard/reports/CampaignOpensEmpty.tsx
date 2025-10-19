/**
 * Campaign Opens Empty Component
 * Empty state component for when campaign opens data is not available
 *
 * Issue #135: Campaign opens empty state component
 * Following established patterns from existing dashboard components
 */

import { EmptyStateCard } from "@/components/ui/empty-state-card";
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
    <EmptyStateCard
      icon={Mail}
      variant="empty"
      title={title || "No Opens Data Available"}
      message={
        message ||
        "There's no opens data available for this campaign. This could mean the campaign hasn't been opened yet, or there might be an issue loading the data."
      }
      actions={
        <>
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
        </>
      }
    />
  );
}
