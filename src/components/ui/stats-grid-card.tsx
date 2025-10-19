/**
 * StatsGridCard Component
 *
 * Displays multiple statistics in a grid layout with a header
 * and optional footer. Commonly used for metrics dashboards.
 *
 * @example
 * ```tsx
 * <StatsGridCard
 *   title="Email Opens"
 *   icon={MailOpen}
 *   iconColor="text-blue-500"
 *   stats={[
 *     { value: 1250, label: "Total Opens" },
 *     { value: 980, label: "Unique Opens" },
 *     { value: "23.4%", label: "Open Rate" }
 *   ]}
 *   footer={<Button>View Details</Button>}
 * />
 * ```
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";
import type { StatsGridCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";
import { formatValue } from "@/components/ui/helpers/card-utils";

export function StatsGridCard({
  title,
  icon: Icon,
  iconColor = "currentColor",
  stats,
  footer,
  headerAction,
  columns = 3,
  className = "",
  loading = false,
}: StatsGridCardProps) {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-3";
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            {headerAction && <Skeleton className="h-8 w-24" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("grid gap-4", getGridCols())}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            {Icon && <Icon className="h-4 w-4" style={{ color: iconColor }} />}
            <span>{title}</span>
          </CardTitle>
          {headerAction && <div>{headerAction}</div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("grid gap-4", getGridCols())}>
          {stats.map((stat, index) => (
            <div key={index}>
              <p
                className="text-2xl font-bold"
                style={stat.valueColor ? { color: stat.valueColor } : undefined}
              >
                {formatValue(stat.value)}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        {footer && <div className="pt-2 border-t">{footer}</div>}
      </CardContent>
    </Card>
  );
}

StatsGridCard.displayName = "StatsGridCard";
