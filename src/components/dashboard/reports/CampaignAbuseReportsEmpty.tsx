/**
 * Campaign Abuse Reports Empty Component
 * Empty state component for when campaign has no abuse/spam complaints
 *
 * Shows positive messaging when no abuse reports are found, as this is good news
 * for the campaign's reputation.
 */

import { EmptyStateCard } from "@/components/ui/empty-state-card";
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
    <EmptyStateCard
      icon={ShieldCheck}
      variant="success"
      title={title || "No Abuse Reports"}
      message={
        message ||
        "Great news! This campaign has no spam complaints. Your subscribers are engaging positively with your content."
      }
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/mailchimp/reports/${campaignId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Report
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/mailchimp/reports">View All Reports</Link>
          </Button>
        </>
      }
    />
  );
}
