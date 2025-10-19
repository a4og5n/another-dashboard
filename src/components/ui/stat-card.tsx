/**
 * StatCard Component
 *
 * Standardized card component for displaying simple metrics with
 * icon, value, label, and optional trend indicators.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={Mail}
 *   value={12500}
 *   label="Emails Sent"
 *   trend="up"
 *   change={5.2}
 * />
 * ```
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/skeletons";
import {
  getTrendIcon,
  getTrendColor,
  formatValue,
} from "@/components/ui/helpers/card-utils";
import type { StatCardProps } from "@/types/components/ui";

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  change,
  description,
  iconColor = "currentColor",
  className = "",
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(change !== undefined || trend) && (
          <div className="flex items-center space-x-2 mt-2">
            {change !== undefined && trend && (
              <Badge variant="outline" className={getTrendColor(trend)}>
                {getTrendIcon(trend)}
                <span className="ml-1">
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              </Badge>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

StatCard.displayName = "StatCard";
