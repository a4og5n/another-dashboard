/**
 * EmptyStateCard Component
 * Generic empty state card for consistent empty/error states across the dashboard
 *
 * Features:
 * - Multiple visual variants (empty, success, error)
 * - Icon with colored background
 * - Title and message
 * - Optional action buttons/links
 *
 * Usage:
 * @example
 * ```tsx
 * <EmptyStateCard
 *   icon={Mail}
 *   variant="empty"
 *   title="No Data Available"
 *   message="There's no data to display at this time."
 *   actions={
 *     <>
 *       <Button onClick={handleRetry}>Try Again</Button>
 *       <Button variant="outline">Go Back</Button>
 *     </>
 *   }
 * />
 * ```
 */

import { Card, CardContent } from "@/components/ui/card";
import type { EmptyStateCardProps } from "@/types/components/ui";
import { cn } from "@/lib/utils";

/**
 * Get variant-specific styling for icon container and icon
 */
function getVariantStyles(variant: "empty" | "success" | "error") {
  const styles = {
    empty: {
      container: "bg-muted",
      icon: "text-muted-foreground",
    },
    success: {
      container: "bg-green-100 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
    },
    error: {
      container: "bg-destructive/10",
      icon: "text-destructive",
    },
  };

  return styles[variant];
}

/**
 * Generic empty state card component
 */
export function EmptyStateCard({
  icon: Icon,
  title,
  message,
  variant = "empty",
  actions,
  className,
}: EmptyStateCardProps) {
  const variantStyles = getVariantStyles(variant);

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {/* Icon Container */}
        <div className={cn("rounded-full p-3 mb-4", variantStyles.container)}>
          <Icon className={cn("h-8 w-8", variantStyles.icon)} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>

        {/* Message */}
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message}
        </p>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
