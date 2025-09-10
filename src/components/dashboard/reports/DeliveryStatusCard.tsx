/**
 * Delivery Status Card Component
 * Displays the campaign delivery status information in a card format
 *
 * Issue #135: Campaign report detail UI components - Delivery Status
 * Following established patterns from existing dashboard components
 */

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DeliveryStatusCardProps } from "@/types/components/dashboard/reports";
import { capitalize } from "@/utils";

export function DeliveryStatusCard({
  deliveryStatus,
  totalEmails,
  className,
}: DeliveryStatusCardProps) {
  // Calculate sending progress percentage
  const sentPercentage =
    totalEmails > 0 ? (deliveryStatus.emails_sent / totalEmails) * 100 : 0;

  // Badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "delivering":
        return "secondary";
      case "delivered":
        return "default";
      case "canceling":
        return "destructive";
      case "canceled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Delivery Status</CardTitle>
          <Badge variant={getBadgeVariant(deliveryStatus.status)}>
            {capitalize(deliveryStatus.status)}
          </Badge>
        </div>
        <CardDescription>
          Campaign delivery information and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          {deliveryStatus.status === "delivering" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sending Progress</span>
                <span className="font-medium">
                  {Math.round(sentPercentage)}%
                </span>
              </div>
              <Progress value={sentPercentage} />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-muted-foreground text-sm">Emails Sent</div>
              <div className="text-2xl font-bold mt-1">
                {deliveryStatus.emails_sent.toLocaleString()}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <div className="text-muted-foreground text-sm">
                Emails Canceled
              </div>
              <div className="text-2xl font-bold mt-1">
                {deliveryStatus.emails_canceled.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {deliveryStatus.can_cancel && (
              <div className="text-sm text-muted-foreground">
                <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                  Can Cancel: Yes
                </span>
              </div>
            )}

            {deliveryStatus.enabled && (
              <div className="text-sm text-muted-foreground">
                <span className="rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
                  Tracking Enabled
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
