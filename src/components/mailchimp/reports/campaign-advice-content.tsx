"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Determine badge variant based on advice type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      case "neutral":
        return "secondary";
      default:
        return "outline";
    }
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
              {advice.map((item, index) => (
                <div
                  key={index}
                  className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant={getBadgeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
