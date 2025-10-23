/**
 * Table Empty State Component
 * Displays an empty state message within a Card when a table has no data
 *
 * @example
 * // Simple text-only
 * <TableEmptyState message="No data available" />
 *
 * // With icon
 * <TableEmptyState
 *   icon={Users}
 *   message="No lists found"
 * />
 */

import { cn } from "@/lib/utils";
import type { TableEmptyStateProps } from "@/types/components/ui/table-empty-state";

export function TableEmptyState({
  message,
  icon: Icon,
  className,
}: TableEmptyStateProps) {
  if (Icon) {
    // Rich empty state with icon
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 text-muted-foreground",
          className,
        )}
      >
        <Icon className="h-12 w-12 mb-3 opacity-50" aria-hidden="true" />
        <p>{message}</p>
      </div>
    );
  }

  // Simple text-only empty state
  return (
    <p className={cn("text-muted-foreground text-center py-8", className)}>
      {message}
    </p>
  );
}

TableEmptyState.displayName = "TableEmptyState";
