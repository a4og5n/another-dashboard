/**
 * Campaign Report Forwards Card Component
 * Displays email forwarding statistics
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share } from "lucide-react";

interface ForwardsCardProps {
  forwards: {
    forwards_count: number;
    forwards_opens: number;
  };
}

export function ForwardsCard({ forwards }: ForwardsCardProps) {
  // Calculate engagement rate from forwards (if any)
  const engagementRate =
    forwards.forwards_count > 0
      ? ((forwards.forwards_opens / forwards.forwards_count) * 100).toFixed(1)
      : "0.0";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Share className="h-4 w-4 text-blue-500" />
          <span>Email Forwards</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">
              {forwards.forwards_count.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Forwards</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {forwards.forwards_opens.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Opens from Forwards</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{engagementRate}%</span> of forwarded
            emails were opened
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
