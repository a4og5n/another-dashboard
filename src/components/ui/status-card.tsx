/**
 * StatusCard Component
 *
 * Displays status information with badge, metrics, and optional
 * progress indicator. Commonly used for delivery status, connection
 * status, and other state displays.
 *
 * @example
 * ```tsx
 * <StatusCard
 *   title="Delivery Status"
 *   status="delivered"
 *   statusVariant="default"
 *   description="Campaign delivery information"
 *   metrics={[
 *     { label: "Emails Sent", value: 5000 },
 *     { label: "Emails Canceled", value: 0 }
 *   ]}
 *   progress={100}
 * />
 * ```
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/skeletons";
import type { StatusCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";
import { formatValue } from "@/components/ui/helpers/card-utils";

export function StatusCard({
  title,
  status,
  statusVariant = "default",
  description,
  metrics = [],
  progress,
  actions,
  footer,
  className = "",
  loading = false,
}: StatusCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          {description && <Skeleton className="h-4 w-full mt-2" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress !== undefined && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Metrics Grid */}
          {metrics.length > 0 && (
            <div
              className={cn(
                "grid gap-4 pt-2",
                metrics.length === 1
                  ? "grid-cols-1"
                  : metrics.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3",
              )}
            >
              {metrics.map((metric, index) => (
                <div key={index} className="rounded-lg bg-muted p-3">
                  <div className="text-muted-foreground text-sm">
                    {metric.label}
                  </div>
                  <div
                    className="text-2xl font-bold mt-1"
                    style={
                      metric.valueColor
                        ? { color: metric.valueColor }
                        : undefined
                    }
                  >
                    {formatValue(metric.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 pt-2">{actions}</div>
          )}

          {/* Footer */}
          {footer && <div className="pt-2 border-t">{footer}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

StatusCard.displayName = "StatusCard";
