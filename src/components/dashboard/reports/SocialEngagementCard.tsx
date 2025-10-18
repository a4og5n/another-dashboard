/**
 * Social Engagement Card Component
 * Displays social media engagement metrics for email campaigns
 *
 * Issue #135: Campaign report detail UI components - Social Engagement Card
 * Following established patterns from existing dashboard components
 * Migrated to StatsGridCard for consistency and reduced boilerplate
 */

import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { Share2 } from "lucide-react";
import type { SocialEngagementCardProps } from "@/types/components/dashboard/reports";

export function SocialEngagementCard({
  facebookLikes,
  className,
}: SocialEngagementCardProps) {
  return (
    <StatsGridCard
      title="Social Engagement"
      icon={Share2}
      iconColor="text-purple-600"
      stats={[
        {
          value: facebookLikes.facebook_likes.toLocaleString(),
          label: "Facebook Likes",
        },
        {
          value: facebookLikes.unique_likes.toLocaleString(),
          label: "Unique Likes",
        },
        {
          value: facebookLikes.recipient_likes.toLocaleString(),
          label: "Recipient Likes",
        },
      ]}
      columns={3}
      className={className}
    />
  );
}
