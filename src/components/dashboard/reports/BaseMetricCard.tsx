"use client";

/**
 * Base Metric Card Component
 * Reusable card component for displaying various metric data in campaign reports
 *
 * This component serves as the foundation for all metric cards in the campaign report,
 * ensuring consistent styling and behavior while allowing for flexible content.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BaseMetricCardProps, MetricRowProps } from "@/types/components";

export function BaseMetricCard({
  title,
  icon: Icon,
  iconColor = "currentColor",
  compact = false,
  className = "",
  children,
  simpleCard = false,
}: BaseMetricCardProps) {
  // If simple card (no header, just content with icon in the corner)
  if (simpleCard) {
    return (
      <Card className={className}>
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex justify-between items-start">
            <div className="flex-1">{children}</div>
            {Icon && <Icon className="h-5 w-5" style={{ color: iconColor }} />}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed card with header and content
  return (
    <Card className={className}>
      {title && (
        <CardHeader className={compact ? "pb-2" : "pb-3"}>
          <CardTitle className="text-base flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4" style={{ color: iconColor }} />}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "" : "space-y-3"}>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Standard metric row for detailed cards
 */
export function MetricRow({
  label,
  value,
  textColor = "inherit",
}: MetricRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium" style={{ color: textColor }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}
