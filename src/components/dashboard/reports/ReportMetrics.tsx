/**
 * Campaign Report Metrics Component
 * Displays detailed performance metrics with progress bars and comparisons
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { PerformanceMetricsCard } from "./PerformanceMetricsCard";
import { SocialEngagementCard } from "./SocialEngagementCard";
import { DeliveryIssuesCard } from "./DeliveryIssuesCard";
import { ListHealthCard } from "./ListHealthCard";
import { ListPerformanceCard } from "./ListPerformanceCard";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface ReportMetricsProps {
  report: MailchimpCampaignReport;
}

export function ReportMetrics({ report }: ReportMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <PerformanceMetricsCard
        opens={report.opens}
        clicks={report.clicks}
        industryStats={report.industry_stats}
        emailsSent={report.emails_sent}
      />

      {/* Engagement Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SocialEngagementCard facebookLikes={report.facebook_likes} />

        <DeliveryIssuesCard
          bounces={report.bounces}
          totalEmails={report.emails_sent}
        />

        <ListHealthCard
          unsubscribed={report.unsubscribed}
          abuseReports={report.abuse_reports}
          emailsSent={report.emails_sent}
        />
      </div>

      {/* List Performance Comparison */}
      <ListPerformanceCard listStats={report.list_stats} />
    </div>
  );
}
