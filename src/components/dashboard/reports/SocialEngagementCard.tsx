/**
 * Social Engagement Card Component
 * Displays social media engagement metrics for email campaigns
 *
 * Issue #135: Campaign report detail UI components - Social Engagement Card
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import type { SocialEngagementCardProps } from "@/types/components/dashboard/reports";

export function SocialEngagementCard({
  facebookLikes,
  className,
}: SocialEngagementCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <Share2 className="h-4 w-4 text-purple-600" />
          <span>Social Engagement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Facebook Likes</span>
          <span className="font-medium">
            {facebookLikes.facebook_likes.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Unique Likes</span>
          <span className="font-medium">
            {facebookLikes.unique_likes.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Recipient Likes</span>
          <span className="font-medium">
            {facebookLikes.recipient_likes.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
