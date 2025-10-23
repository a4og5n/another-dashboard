"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { CampaignAdviceResponse } from "@/types/mailchimp/campaign-advice";

interface CampaignAdviceContentProps {
  data: CampaignAdviceResponse;
  campaignId: string;
}

/**
 * Campaign Advice Content Component
 * Displays feedback and recommendations for improving campaign performance
 */
export function CampaignAdviceContent({ data }: CampaignAdviceContentProps) {
  const { advice, total_items } = data;

  // Get icon and color based on advice type
  const getAdviceIcon = (type: string) => {
    if (type === "advice-goodstat") {
      return {
        icon: ThumbsUp,
        className: "text-green-600 dark:text-green-400",
        label: "Good performance",
      };
    }
    // advice-badstat
    return {
      icon: ThumbsDown,
      className: "text-red-600 dark:text-red-400",
      label: "Needs improvement",
    };
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Campaign Advice ({total_items.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {total_items === 0 ? (
            <p className="text-muted-foreground">
              No advice available for this campaign. Great job!
            </p>
          ) : (
            <div className="space-y-4">
              {advice.map((item, index) => {
                const {
                  icon: Icon,
                  className,
                  label,
                } = getAdviceIcon(item.type);
                return (
                  <div
                    key={index}
                    className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`h-5 w-5 flex-shrink-0 ${className}`}
                        aria-label={label}
                      />
                      <div
                        className="prose prose-sm max-w-none flex-1 text-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
